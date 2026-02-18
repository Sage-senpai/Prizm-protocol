export type PolkadotAccount = {
  address: string;
  name?: string;
  source?: string;
};

type ExtensionDapp = typeof import('@polkadot/extension-dapp');

function assertBrowserApi(apiName: string) {
  if (typeof window === 'undefined') {
    throw new Error(`${apiName} is only available in the browser runtime.`);
  }
}

async function getExtensionDapp(): Promise<ExtensionDapp> {
  assertBrowserApi('Polkadot extension API');
  return import('@polkadot/extension-dapp');
}

async function waitForCryptoReady() {
  const { cryptoWaitReady } = await import('@polkadot/util-crypto');
  await cryptoWaitReady();
}

export async function enablePolkadotExtensions(appName: string) {
  await waitForCryptoReady();
  const { web3Enable } = await getExtensionDapp();
  return web3Enable(appName);
}

export async function getPolkadotAccounts(appName: string, preferredSource?: string) {
  const { web3Accounts } = await getExtensionDapp();
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
  const { web3FromSource } = await getExtensionDapp();
  const injector = await web3FromSource(source);
  return injector.signer;
}
