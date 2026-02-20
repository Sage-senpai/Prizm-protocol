import { BrowserProvider, Contract, JsonRpcProvider, type Eip1193Provider, type ContractRunner, type InterfaceAbi } from 'ethers';
import { appConfig } from '@/lib/config';

type EthWindow = Window & { ethereum?: Eip1193Provider };

export async function getEvmProvider() {
  if (typeof window !== 'undefined' && (window as EthWindow).ethereum) {
    return new BrowserProvider((window as EthWindow).ethereum!);
  }

  return new JsonRpcProvider(appConfig.evm.rpcUrl);
}

export async function connectEvmWallet() {
  if (typeof window === 'undefined' || !(window as EthWindow).ethereum) {
    throw new Error('EVM wallet not detected. Install MetaMask or use a Moonbeam-compatible wallet.');
  }

  const provider = new BrowserProvider((window as EthWindow).ethereum!);
  await provider.send('eth_requestAccounts', []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  return { provider, signer, address };
}

export function getEvmContract(address: string, abi: InterfaceAbi, runner: ContractRunner) {
  return new Contract(address, abi, runner);
}
