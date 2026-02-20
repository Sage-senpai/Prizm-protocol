/**
 * POST /api/pop-attest
 * ════════════════════
 * Signs a PoP attestation for the PoPVerifier.sol contract.
 *
 * In production this endpoint:
 *  1. Optionally re-queries the Polkadot People Chain to confirm the
 *     user's address has the claimed tier (Sybil-resistance guarantee).
 *  2. Signs { evmAddress, tier, polkadotAddress, nonce, chainId } with
 *     ATTESTER_PRIVATE_KEY (server-side env var, never exposed to the client).
 *  3. Returns the signature + nonce to the frontend for on-chain submission.
 *
 * The signature format matches PoPVerifier.sol → submitAttestation():
 *   keccak256(abi.encodePacked(evmAddress, tier, polkadotBytes, nonce, chainId))
 *   then prefixed with EIP-191 prefix via MessageHashUtils.toEthSignedMessageHash
 *
 * For the hackathon demo: if ATTESTER_PRIVATE_KEY is not set, a deterministic
 * demo key is used (safe on testnet, never use on mainnet).
 */

import { NextRequest, NextResponse } from 'next/server';
import { Wallet, solidityPackedKeccak256, getBytes, hexlify, randomBytes } from 'ethers';

// ─── Chain ID ─────────────────────────────────────────────────────────────────
const MOONBASE_CHAIN_ID = 1287;

// ─── Demo key (testnet only) ──────────────────────────────────────────────────
// Replace with a real ATTESTER_PRIVATE_KEY env var before any mainnet use.
const DEMO_ATTESTER_KEY =
  process.env.ATTESTER_PRIVATE_KEY ??
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // Hardhat #0

// ─── Request / Response types ─────────────────────────────────────────────────

interface AttestRequest {
  evmAddress:      string;
  polkadotAddress: string;
  tier:            number;
}

interface AttestResponse {
  tier:            number;
  polkadotAddress: string;
  nonce:           string; // bytes32 hex
  signature:       string; // ECDSA hex
  attester:        string; // address of signer (for UI)
  chainId:         number;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as Partial<AttestRequest>;

    const { evmAddress, polkadotAddress, tier } = body;

    // ── Validate inputs ──────────────────────────────────────────────────────
    if (!evmAddress || !/^0x[0-9a-fA-F]{40}$/.test(evmAddress)) {
      return NextResponse.json({ error: 'Invalid EVM address' }, { status: 400 });
    }
    if (!polkadotAddress || typeof polkadotAddress !== 'string') {
      return NextResponse.json({ error: 'Invalid Polkadot address' }, { status: 400 });
    }
    if (typeof tier !== 'number' || tier < 1 || tier > 3) {
      return NextResponse.json({ error: 'Tier must be 1, 2, or 3' }, { status: 400 });
    }

    // ── Build attester wallet ─────────────────────────────────────────────────
    const wallet = new Wallet(DEMO_ATTESTER_KEY);

    // ── Generate nonce (bytes32) ──────────────────────────────────────────────
    const nonceBytes = randomBytes(32);
    const nonce      = hexlify(nonceBytes);

    // ── Encode polkadot address as UTF-8 bytes ────────────────────────────────
    const polkadotBytes = new TextEncoder().encode(polkadotAddress);

    // ── Build the hash matching PoPVerifier.sol ───────────────────────────────
    //    keccak256(abi.encodePacked(msg.sender, tier, polkadotAddress, nonce, block.chainid))
    const structHash = solidityPackedKeccak256(
      ['address', 'uint8', 'bytes', 'bytes32', 'uint256'],
      [evmAddress, tier, polkadotBytes, nonce, MOONBASE_CHAIN_ID],
    );

    // ── Sign (wallet.signMessage adds EIP-191 prefix → matches toEthSignedMessageHash) ──
    const signature = await wallet.signMessage(getBytes(structHash));

    const response: AttestResponse = {
      tier,
      polkadotAddress,
      nonce,
      signature,
      attester: wallet.address,
      chainId:  MOONBASE_CHAIN_ID,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error('[pop-attest] Error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
