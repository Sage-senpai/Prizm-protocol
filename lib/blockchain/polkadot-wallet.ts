import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { cryptoWaitReady } from '@polkadot/util-crypto';

export type PolkadotAccount = {
  address: string;
  name?: string;
  source?: string;
};

export async function enablePolkadotExtensions(appName: string) {
  await cryptoWaitReady();
  return web3Enable(appName);
}

export async function getPolkadotAccounts(appName: string, preferredSource?: string) {
  await enablePolkadotExtensions(appName);
  const accounts = await web3Accounts();

  if (!preferredSource) {
    return accounts.map((account) => ({
      address: account.address,
      name: account.meta.name,
      source: account.meta.source,
    }));
  }

  return accounts
    .filter((account) => account.meta.source === preferredSource)
    .map((account) => ({
      address: account.address,
      name: account.meta.name,
      source: account.meta.source,
    }));
}

export async function getPolkadotSigner(source: string) {
  const injector = await web3FromSource(source);
  return injector.signer;
}
