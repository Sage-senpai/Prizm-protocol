/**
 * lib/blockchain/pop.ts
 * ═════════════════════
 * End-to-end Proof of Personhood verification flow.
 *
 * Flow
 * ────
 *  1. queryPeopleChainPoP()  – reads Polkadot People Chain for the user's PoP tier
 *  2. requestAttestation()   – calls the /api/pop-attest Next.js route which signs
 *                               the attestation using the server-side ATTESTER_PRIVATE_KEY
 *  3. submitPopAttestation() – (from contracts.ts) submits the signed payload on-chain
 *
 * Privacy: no biometrics, no KYC, no centralised identity provider.
 * The root of trust is Polkadot's Ring-VRF–based People Chain personhood.
 */

import type { PopQueryResult } from './people-chain';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AttestationPayload {
  tier: number;
  polkadotAddress: string;
  nonce: string;          // 0x-prefixed hex bytes32
  signature: string;      // 0x-prefixed ECDSA hex
  attester: string;       // address that signed (for UI display)
}

export type PopVerificationStatus =
  | 'idle'
  | 'querying-people-chain'
  | 'requesting-attestation'
  | 'submitting-on-chain'
  | 'complete'
  | 'error';

// ─── People Chain query (re-export for convenience) ───────────────────────────

export { queryPeopleChainPoP, checkPeopleChainReachable } from './people-chain';
export type { PopQueryResult } from './people-chain';

// ─── Tier display helpers ─────────────────────────────────────────────────────

export const TIER_LABELS: Record<number, string> = {
  0: 'Unverified',
  1: 'DIM1 Verified',
  2: 'DIM2 Verified',
  3: 'Full-Stack PoP',
};

export const TIER_MULTIPLIERS: Record<number, string> = {
  0: '0×',
  1: '1.0×',
  2: '1.5×',
  3: '2.0×',
};

export const TIER_BORROW_CAPS: Record<number, string> = {
  0: '$0',
  1: '$100,000',
  2: '$150,000',
  3: '$200,000',
};

export const TIER_DESCRIPTIONS: Record<number, string> = {
  0: 'Connect a Polkadot wallet with People Chain PoP to unlock borrowing.',
  1: 'DIM1 (Dimensional Layer 1) – Ring VRF uniqueness proof. 1× borrow multiplier.',
  2: 'DIM2 (Dimensional Layer 2) – Enhanced uniqueness + social graph. 1.5× multiplier.',
  3: 'Full-stack PoP – All dimensions verified. Maximum 2× borrow multiplier.',
};

// ─── Backend attestation request ──────────────────────────────────────────────

/**
 * Ask the Prizm backend (/api/pop-attest) to sign an attestation.
 *
 * The backend:
 *  - (optionally) re-verifies the Polkadot address on People Chain
 *  - signs { evmAddress, tier, polkadotAddress, nonce, chainId } with ATTESTER_PRIVATE_KEY
 *  - returns the signature for on-chain submission
 *
 * @param evmAddress      The user's MetaMask / EVM address
 * @param polkadotAddress The user's Polkadot SS58 address (from People Chain query)
 * @param tier            Tier derived from People Chain (1-3)
 */
export async function requestAttestation(
  evmAddress: string,
  polkadotAddress: string,
  tier: number,
): Promise<AttestationPayload> {
  const response = await fetch('/api/pop-attest', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ evmAddress, polkadotAddress, tier }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Unknown error' })) as { error?: string };
    throw new Error(err.error ?? `Attestation request failed (${response.status})`);
  }

  return response.json() as Promise<AttestationPayload>;
}

// ─── Tier from on-chain credential ────────────────────────────────────────────

/**
 * Fetch the currently active on-chain PoP tier for an EVM address.
 * Returns 0 if no credential exists or it has expired.
 */
export async function fetchOnChainTier(evmAddress: string): Promise<number> {
  // Dynamic import to avoid SSR issues
  const { getOnChainPopStatus } = await import('./contracts');
  const status = await getOnChainPopStatus(evmAddress);
  if (!status.active || status.expired) return 0;
  return status.tier;
}
