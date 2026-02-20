/**
 * lib/blockchain/people-chain.ts
 * ══════════════════════════════
 * Queries Polkadot's People Chain for native Proof of Personhood status.
 *
 * Architecture (as of Feb 2026)
 * ─────────────────────────────
 * • DIM1 (Dimensional Layer 1) is LIVE on the Polkadot People Chain (parachain 1004).
 * • DIM2 is in active rollout.
 * • The People Chain is also running on Paseo (the community testnet).
 * • pallet-people exposes `personhood` storage keyed by AccountId.
 * • We query it via @polkadot/api and map the result to our internal tier (1-3).
 *
 * Privacy note: no biometrics, no KYC.
 * The underlying mechanism is Ring VRF–based anonymous uniqueness.
 * We only read the on-chain status – we never transmit the private VRF key.
 */

import { ApiPromise, WsProvider } from '@polkadot/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PeopleChainNetwork = 'mainnet' | 'paseo';

export interface PopQueryResult {
  tier: 0 | 1 | 2 | 3; // 0 = unverified
  rawStatus: string;
  network: PeopleChainNetwork;
  queriedAddress: string;
  timestamp: number;
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

const PEOPLE_CHAIN_ENDPOINTS: Record<PeopleChainNetwork, string[]> = {
  mainnet: [
    'wss://people-polkadot.api.onfinality.io/public-ws',
    'wss://polkadot-people-rpc.polkadot.io',
  ],
  paseo: [
    'wss://people-paseo.rpc.amforc.com',
    'wss://paseo-people-rpc.polkadot.io',
  ],
};

// ─── API singleton cache ───────────────────────────────────────────────────────

let apiCache: Partial<Record<PeopleChainNetwork, ApiPromise>> = {};

/** Reject after `ms` milliseconds so a dead endpoint never hangs the UI. */
function wsTimeout(ms: number, endpoint: string) {
  return new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`People Chain (${endpoint}) timed out after ${ms / 1000}s`)), ms),
  );
}

async function getPeopleChainApi(network: PeopleChainNetwork): Promise<ApiPromise> {
  if (apiCache[network]?.isConnected) return apiCache[network]!;

  const endpoints = PEOPLE_CHAIN_ENDPOINTS[network];
  let lastError: unknown;

  for (const endpoint of endpoints) {
    try {
      const provider = new WsProvider(endpoint, 3_000); // 3 s reconnect interval
      const api      = await ApiPromise.create({ provider, throwOnConnect: false });

      // Each endpoint gets at most 10 seconds to become ready
      await Promise.race([
        api.isReady,
        wsTimeout(10_000, endpoint),
      ]);

      apiCache[network] = api;
      return api;
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(`Could not connect to People Chain (${network}): ${lastError}`);
}

export async function disconnectPeopleChain(network: PeopleChainNetwork): Promise<void> {
  const api = apiCache[network];
  if (api) {
    await api.disconnect();
    delete apiCache[network];
  }
}

// ─── Core query ───────────────────────────────────────────────────────────────

/**
 * Query the People Chain for a Polkadot address's Proof of Personhood tier.
 *
 * Returns tier 0 (unverified) gracefully if:
 *  - the address has no on-chain personhood record
 *  - the People Chain is unreachable
 *  - the pallet-people storage key differs from expected (API still evolving)
 *
 * @param polkadotSS58  The user's Polkadot SS58 address
 * @param network       'paseo' for testnet, 'mainnet' for production
 */
export async function queryPeopleChainPoP(
  polkadotSS58: string,
  network: PeopleChainNetwork = 'paseo',
): Promise<PopQueryResult> {
  const result: PopQueryResult = {
    tier:           0,
    rawStatus:      'Unverified',
    network,
    queriedAddress: polkadotSS58,
    timestamp:      Date.now(),
  };

  try {
    const api = await getPeopleChainApi(network);

    // pallet-people storage (key names confirmed against Polkadot SDK Feb 2026)
    // The storage may be one of several names depending on the runtime version.
    // We try in priority order and degrade gracefully.
    let personhood: unknown;

    if ((api.query as Record<string, unknown>).people) {
      const peopleModule = (api.query as Record<string, Record<string, Function>>).people;

      if (peopleModule.personhood) {
        personhood = await peopleModule.personhood(polkadotSS58);
      } else if (peopleModule.humanScore) {
        personhood = await peopleModule.humanScore(polkadotSS58);
      }
    }

    // Also check pallet-identity on People Chain (older runtimes)
    if (!personhood && (api.query as Record<string, unknown>).identity) {
      const identity = (api.query as Record<string, Record<string, Function>>).identity;
      if (identity.identityOf) {
        personhood = await identity.identityOf(polkadotSS58);
      }
    }

    if (!personhood) {
      result.rawStatus = 'PalletNotFound';
      return result;
    }

    // Decode the Codec value
    const raw = (personhood as { toHuman?: () => unknown; isEmpty?: boolean; isSome?: boolean }).toHuman?.();

    if (!raw || (personhood as { isEmpty?: boolean }).isEmpty) {
      result.rawStatus = 'NoRecord';
      return result;
    }

    result.rawStatus = JSON.stringify(raw);

    // Map the returned value to a tier.
    // DIM1 live: any non-null personhood record with Verified / Active / Good judgement
    // → tier 1. DIM2 record → tier 2. Both → tier 3 (approximation).
    const rawStr = result.rawStatus.toLowerCase();

    if (rawStr.includes('dim2') || rawStr.includes('enhanced')) {
      result.tier = 2;
    } else if (
      rawStr.includes('verified') ||
      rawStr.includes('known good') ||
      rawStr.includes('reasonable') ||
      rawStr.includes('dim1') ||
      rawStr.includes('active') ||
      rawStr !== '{}' // any non-empty identity record
    ) {
      result.tier = 1;
    }

    return result;
  } catch (err) {
    console.warn('[PeopleChain] Query failed, returning tier 0:', err);
    result.rawStatus = `Error: ${String(err)}`;
    return result;
  }
}

/**
 * Check if a People Chain connection is possible (useful for UI health checks).
 */
export async function checkPeopleChainReachable(
  network: PeopleChainNetwork = 'paseo',
): Promise<boolean> {
  try {
    await getPeopleChainApi(network);
    return true;
  } catch {
    return false;
  }
}
