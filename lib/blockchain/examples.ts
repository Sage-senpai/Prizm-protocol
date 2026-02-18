import { BN } from '@polkadot/util';
import { appConfig } from '@/lib/config';
import { fetchChainInfo as fetchPolkadotChainInfo, getPolkadotApi, subscribeFinalizedHeads } from '@/lib/blockchain/polkadot';
import { getPolkadotSigner } from '@/lib/blockchain/polkadot-wallet';
import { connectEvmWallet, getEvmContract, getEvmProvider } from '@/lib/blockchain/evm';

export async function fetchPolkadotLatestBlock() {
  const api = await getPolkadotApi();
  const header = await api.rpc.chain.getHeader();
  return {
    number: header.number.toNumber(),
    hash: header.hash.toHex(),
  };
}

export async function fetchChainInfo() {
  return fetchPolkadotChainInfo();
}

export async function subscribePolkadotFinalizedBlocks(onBlock: (block: number) => void) {
  return subscribeFinalizedHeads((header) => onBlock(header.number.toNumber()));
}

export async function submitPolkadotTransfer(params: {
  from: string;
  to: string;
  amountPlanck: string;
  source: string;
}) {
  const api = await getPolkadotApi();
  const signer = await getPolkadotSigner(params.source);

  return new Promise<string>((resolve, reject) => {
    const amount = new BN(params.amountPlanck);
    const unsubscribe = api.tx.balances
      .transferKeepAlive(params.to, amount)
      .signAndSend(params.from, { signer }, (result) => {
        if (result.status.isInBlock || result.status.isFinalized) {
          resolve(result.status.asFinalized.toHex());
          unsubscribe();
        }
      })
      .catch((error) => reject(error));
  });
}

export async function fetchEvmChainData() {
  const provider = await getEvmProvider();
  const [network, blockNumber] = await Promise.all([
    provider.getNetwork(),
    provider.getBlockNumber(),
  ]);

  return {
    chainId: Number(network.chainId),
    name: network.name,
    blockNumber,
  };
}

export async function submitEvmExampleTransaction(abi: any, method: string, args: any[]) {
  if (!appConfig.evm.lendingPoolAddress) {
    throw new Error('Missing NEXT_PUBLIC_EVM_LENDING_POOL_ADDRESS.');
  }

  const { signer } = await connectEvmWallet();
  const contract = getEvmContract(appConfig.evm.lendingPoolAddress, abi, signer);

  const tx = await contract[method](...args);
  return tx.hash as string;
}
