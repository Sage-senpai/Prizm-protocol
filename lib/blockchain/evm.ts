import { BrowserProvider, Contract, JsonRpcProvider, type Eip1193Provider, type ContractRunner, type InterfaceAbi } from 'ethers';
import { appConfig } from '@/lib/config';

type EthWindow = Window & { ethereum?: Eip1193Provider };

/** Moonbase Alpha chain parameters for wallet_addEthereumChain */
const MOONBASE_ALPHA_CHAIN = {
  chainId: '0x' + (1287).toString(16),
  chainName: 'Moonbase Alpha',
  nativeCurrency: { name: 'DEV', symbol: 'DEV', decimals: 18 },
  rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'],
  blockExplorerUrls: ['https://moonbase.moonscan.io'],
};

/** Check if an EVM wallet (MetaMask, Talisman EVM, etc.) is injected */
export function isEvmWalletInstalled(): boolean {
  return typeof window !== 'undefined' && !!(window as EthWindow).ethereum;
}

export async function getEvmProvider() {
  if (typeof window !== 'undefined' && (window as EthWindow).ethereum) {
    return new BrowserProvider((window as EthWindow).ethereum!);
  }

  return new JsonRpcProvider(appConfig.evm.rpcUrl);
}

export async function connectEvmWallet() {
  if (typeof window === 'undefined' || !(window as EthWindow).ethereum) {
    throw new Error('EVM wallet not detected. Install MetaMask or a Moonbeam-compatible wallet.');
  }

  const ethereum = (window as EthWindow).ethereum!;
  const provider = new BrowserProvider(ethereum);

  // Request accounts — triggers the wallet popup
  await provider.send('eth_requestAccounts', []);

  // Switch to Moonbase Alpha if needed
  const network = await provider.getNetwork();
  if (network.chainId !== BigInt(appConfig.evm.chainId)) {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MOONBASE_ALPHA_CHAIN.chainId }],
      });
    } catch (err: unknown) {
      // 4902 = chain not added yet — add it automatically
      if ((err as { code?: number })?.code === 4902) {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [MOONBASE_ALPHA_CHAIN],
        });
      } else {
        throw err;
      }
    }
  }

  // Re-create provider after potential chain switch
  const finalProvider = new BrowserProvider(ethereum);
  const signer = await finalProvider.getSigner();
  const address = await signer.getAddress();
  return { provider: finalProvider, signer, address };
}

export function getEvmContract(address: string, abi: InterfaceAbi, runner: ContractRunner) {
  return new Contract(address, abi, runner);
}
