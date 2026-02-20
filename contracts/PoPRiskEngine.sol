// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./PoPVerifier.sol";

/**
 * @title PoPRiskEngine
 * @notice Translates on-chain Proof of Personhood tier into risk parameters.
 *
 * Tier system (mirrors Polkadot's DIM1 / DIM2 rollout):
 *   Tier 0 – Unverified  : cannot borrow at all (Sybil risk)
 *   Tier 1 – DIM1 verified: 1.0× multiplier, $100 000 cap
 *   Tier 2 – DIM2 verified: 1.5× multiplier, $150 000 cap
 *   Tier 3 – Full-stack   : 2.0× multiplier, $200 000 cap
 *
 * All multipliers are in basis-point-scale (100 = 1.0×).
 * The RWAVault calls this contract before every borrow.
 */
contract PoPRiskEngine is Ownable {
    PoPVerifier public popVerifier;

    // tier → borrow multiplier (basis points, 100 = 1.0×)
    mapping(uint8 => uint256) public tierMultiplier;
    // tier → maximum USDC borrow cap (6 decimals)
    mapping(uint8 => uint256) public tierBorrowCap;

    event TierParametersUpdated(uint8 indexed tier, uint256 multiplier, uint256 borrowCap);
    event VerifierUpdated(address indexed newVerifier);

    constructor(address _popVerifier) Ownable(msg.sender) {
        require(_popVerifier != address(0), "Zero verifier");
        popVerifier = PoPVerifier(_popVerifier);

        // DIM1 – baseline personhood
        tierMultiplier[1] = 100;
        tierBorrowCap[1]  = 100_000e6;

        // DIM2 – enhanced uniqueness proof
        tierMultiplier[2] = 150;
        tierBorrowCap[2]  = 150_000e6;

        // Full-stack (DIM1 + DIM2 + additional on-chain social graph)
        tierMultiplier[3] = 200;
        tierBorrowCap[3]  = 200_000e6;
    }

    // ─── Views (called by RWAVault) ───────────────────────────────────────────

    function isVerified(address user) external view returns (bool) {
        return popVerifier.getPopTier(user) >= 1;
    }

    /// @notice Returns multiplier in basis points (0 if unverified)
    function getBorrowMultiplier(address user) external view returns (uint256) {
        uint8 tier = popVerifier.getPopTier(user);
        return tier == 0 ? 0 : tierMultiplier[tier];
    }

    /// @notice Returns the USDC borrow cap for the user (0 if unverified)
    function getBorrowCap(address user) external view returns (uint256) {
        uint8 tier = popVerifier.getPopTier(user);
        return tier == 0 ? 0 : tierBorrowCap[tier];
    }

    /// @notice Convenience bundle used by the frontend
    function getTierInfo(address user)
        external
        view
        returns (uint8 tier, uint256 multiplier, uint256 borrowCap)
    {
        tier       = popVerifier.getPopTier(user);
        multiplier = tier > 0 ? tierMultiplier[tier] : 0;
        borrowCap  = tier > 0 ? tierBorrowCap[tier]  : 0;
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    function setTierParameters(uint8 tier, uint256 multiplier, uint256 borrowCap)
        external
        onlyOwner
    {
        require(tier >= 1 && tier <= 3, "Invalid tier");
        tierMultiplier[tier] = multiplier;
        tierBorrowCap[tier]  = borrowCap;
        emit TierParametersUpdated(tier, multiplier, borrowCap);
    }

    function updateVerifier(address newVerifier) external onlyOwner {
        require(newVerifier != address(0), "Zero address");
        popVerifier = PoPVerifier(newVerifier);
        emit VerifierUpdated(newVerifier);
    }
}
