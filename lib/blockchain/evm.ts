import { BrowserProvider, Contract, JsonRpcProvider } from 'ethers';
import { appConfig } from '@/lib/config';

export async function getEvmProvider() {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    return new BrowserProvider((window as any).ethereum);
  }

  return new JsonRpcProvider(appConfig.evm.rpcUrl);
}

export async function connectEvmWallet() {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    throw new Error('EVM wallet not detected. Install MetaMask or use a Moonbeam-compatible wallet.');
  }

  const provider = new BrowserProvider((window as any).ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  return { provider, signer, address };
}

export function getEvmContract(address: string, abi: any, runner: any) {
  return new Contract(address, abi, runner);
}
