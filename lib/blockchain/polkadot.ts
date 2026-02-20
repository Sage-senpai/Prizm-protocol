import { ApiPromise, WsProvider } from '@polkadot/api';
import { appConfig } from '@/lib/config';

type HeaderLike = {
  number: {
    toNumber: () => number;
  };
};

let apiPromise: ApiPromise | null = null;
let provider: WsProvider | null = null;

/** Reject after `ms` milliseconds with a descriptive error. */
function wsTimeout(ms: number, label: string) {
  return new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms),
  );
}

export async function getPolkadotApi(endpoint = appConfig.polkadot.rpcUrl) {
  if (apiPromise?.isConnected) return apiPromise;

  provider = new WsProvider(endpoint, 2_500); // 2.5 s reconnect interval
  const api = await ApiPromise.create({ provider, throwOnConnect: false });

  // Enforce a 12-second ceiling so a dead RPC never hangs the UI indefinitely
  apiPromise = await Promise.race([
    api.isReady,
    wsTimeout(12_000, `Polkadot API (${endpoint})`),
  ]);

  return apiPromise;
}

export async function disconnectPolkadot() {
  if (apiPromise) {
    await apiPromise.disconnect();
  }
  apiPromise = null;
  provider = null;
}

export async function fetchChainInfo() {
  const api = await getPolkadotApi();
  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version(),
  ]);

  return {
    chain: chain.toString(),
    nodeName: nodeName.toString(),
    nodeVersion: nodeVersion.toString(),
    genesisHash: api.genesisHash.toHex(),
  };
}

export async function subscribeNewHeads(onHeader: (header: HeaderLike) => void) {
  const api = await getPolkadotApi();
  return api.rpc.chain.subscribeNewHeads(onHeader);
}

export async function subscribeFinalizedHeads(
  onHeader: (header: HeaderLike) => void,
) {
  const api = await getPolkadotApi();
  return api.rpc.chain.subscribeFinalizedHeads(onHeader);
}
