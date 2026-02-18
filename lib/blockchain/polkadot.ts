import { ApiPromise, WsProvider } from '@polkadot/api';
import { appConfig } from '@/lib/config';

type HeaderLike = {
  number: {
    toNumber: () => number;
  };
};

let apiPromise: ApiPromise | null = null;
let provider: WsProvider | null = null;

export async function getPolkadotApi(endpoint = appConfig.polkadot.rpcUrl) {
  if (apiPromise) return apiPromise;
  provider = new WsProvider(endpoint);
  apiPromise = await ApiPromise.create({ provider });
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
