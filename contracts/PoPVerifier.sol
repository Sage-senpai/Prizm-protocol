// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title PoPVerifier
 * @notice Cross-chain Proof of Personhood verifier for Prizm Protocol.
 *
 * Architecture
 * ────────────
 * Polkadot's native PoP lives on the People Chain (parachain 1004 on mainnet,
 * or the Paseo People Chain on testnet). Because Moonbeam is an EVM-compatible
 * parachain, direct XCM queries to People Chain storage are not yet trivially
 * accessible inside Solidity.  We therefore use a lightweight, privacy-
 * preserving signature-bridge pattern:
 *
 *   1. The Prizm backend (or a user-run relayer) queries People Chain via
 *      polkadot/api for the caller's DIM1 / DIM2 personhood status.
 *   2. The backend derives a tier (1 = DIM1, 2 = DIM2, 3 = Full-stack) and
 *      signs an attestation over { evmAddress, tier, polkadotAddrBytes, nonce,
 *      chainId } using the trusted `attester` EOA.
 *   3. The user submits the signed attestation to this contract, which verifies
 *      the ECDSA signature and records the credential on-chain.
 *   4. Credentials expire after CREDENTIAL_VALIDITY to encourage fresh proofs.
 *
 * Crucially: no biometrics, no KYC, no centralised identity provider.
 * The root of trust is the People Chain's Ring-VRF–based Sybil resistance.
 *
 * In production: replace the signature bridge with a direct XCM storage proof
 * once Moonbeam's XCM query precompile supports People Chain reads.
 */
contract PoPVerifier is Ownable {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // ─── Constants ────────────────────────────────────────────────────────────
    uint256 public constant CREDENTIAL_VALIDITY = 365 days;

    // ─── State ────────────────────────────────────────────────────────────────
    /// @notice EOA whose signatures are accepted as authoritative attestations
    address public attester;

    struct PopCredential {
        uint8   tier;           // 0 = none | 1 = DIM1 | 2 = DIM2 | 3 = Full
        uint256 expiresAt;      // unix timestamp
        bytes32 polkadotHash;   // keccak256(polkadot SS58 address bytes) – for audit only
        bool    active;
    }

    mapping(address  => PopCredential) public credentials;
    mapping(bytes32  => bool)          public usedNonces;

    // ─── Events ───────────────────────────────────────────────────────────────
    event CredentialIssued(address indexed user, uint8 tier, uint256 expiresAt);
    event CredentialRevoked(address indexed user);
    event AttesterUpdated(address indexed oldAttester, address indexed newAttester);

    // ─── Constructor ──────────────────────────────────────────────────────────
    constructor(address _attester) Ownable(msg.sender) {
        require(_attester != address(0), "Zero attester");
        attester = _attester;
    }

    // ─── External: user-facing ────────────────────────────────────────────────

    /**
     * @notice Submit a People Chain PoP attestation signed by the authorised attester.
     * @param tier            PoP tier (1 = DIM1, 2 = DIM2, 3 = Full-stack)
     * @param polkadotAddress Raw bytes of the caller's Polkadot SS58 address (UTF-8)
     * @param nonce           Unique nonce preventing replay attacks
     * @param signature       Attester's ECDSA signature over the attestation payload
     */
    function submitAttestation(
        uint8          tier,
        bytes calldata polkadotAddress,
        bytes32        nonce,
        bytes calldata signature
    ) external {
        require(tier >= 1 && tier <= 3, "Invalid tier");
        require(!usedNonces[nonce],      "Nonce replayed");

        // Reconstruct the signed hash (must match the backend's signing logic)
        bytes32 structHash = keccak256(
            abi.encodePacked(msg.sender, tier, polkadotAddress, nonce, block.chainid)
        );
        address recovered = structHash.toEthSignedMessageHash().recover(signature);
        require(recovered == attester, "Bad attestation signature");

        usedNonces[nonce] = true;

        credentials[msg.sender] = PopCredential({
            tier:          tier,
            expiresAt:     block.timestamp + CREDENTIAL_VALIDITY,
            polkadotHash:  keccak256(polkadotAddress),
            active:        true
        });

        emit CredentialIssued(msg.sender, tier, block.timestamp + CREDENTIAL_VALIDITY);
    }

    // ─── External: owner-only ─────────────────────────────────────────────────

    /**
     * @notice Directly issue a credential without a signature (owner / hackathon demo).
     * @dev    Remove or gate behind a feature flag before mainnet deployment.
     */
    function issueCredential(address user, uint8 tier) external onlyOwner {
        require(tier >= 1 && tier <= 3, "Invalid tier");
        credentials[user] = PopCredential({
            tier:         tier,
            expiresAt:    block.timestamp + CREDENTIAL_VALIDITY,
            polkadotHash: bytes32(0),
            active:       true
        });
        emit CredentialIssued(user, tier, block.timestamp + CREDENTIAL_VALIDITY);
    }

    /// @notice Revoke a user's credential (e.g. if People Chain detects Sybil)
    function revokeCredential(address user) external onlyOwner {
        credentials[user].active = false;
        emit CredentialRevoked(user);
    }

    /// @notice Rotate the trusted attester EOA
    function updateAttester(address newAttester) external onlyOwner {
        require(newAttester != address(0), "Zero attester");
        emit AttesterUpdated(attester, newAttester);
        attester = newAttester;
    }

    // ─── Views ────────────────────────────────────────────────────────────────

    /// @notice Returns 0 if unverified or expired, otherwise the tier (1-3)
    function getPopTier(address user) external view returns (uint8) {
        PopCredential storage c = credentials[user];
        if (!c.active || block.timestamp > c.expiresAt) return 0;
        return c.tier;
    }

    function isVerified(address user) external view returns (bool) {
        PopCredential storage c = credentials[user];
        return c.active && block.timestamp <= c.expiresAt && c.tier >= 1;
    }

    function getCredential(address user)
        external
        view
        returns (uint8 tier, uint256 expiresAt, bool active, bool expired)
    {
        PopCredential storage c = credentials[user];
        return (c.tier, c.expiresAt, c.active, block.timestamp > c.expiresAt);
    }
}
