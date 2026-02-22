export type PolkadotAccount = {
  address: string;
  name?: string;
  source?: string;
};

// ─── Types for direct window.injectedWeb3 access ─────────────────────────────

type InjectedAccount = { address: string; name?: string; type?: string };

type InjectedExtension = {
  enable: (origin: string) => Promise<{
    accounts: {
      get: (anyType?: boolean) => Promise<InjectedAccount[]>;
    };
    signer: unknown;
  }>;
  version?: string;
};

type WindowWithInjected = Window & {
  injectedWeb3?: Record<string, InjectedExtension>;
};

// ─── Constants ───────────────────────────────────────────────────────────────

/** Keys that Polkadot wallet extensions inject into window.injectedWeb3 */
export const POLKADOT_INJECT_KEYS: Record<string, string> = {
  'polkadot-js': 'polkadot-js',
  talisman: 'talisman',
  subwallet: 'subwallet-js',
  nova: 'nova',
};

/** Check if a specific Polkadot wallet extension is present in the page */
export function isPolkadotExtensionInstalled(walletId: string): boolean {
  if (typeof window === 'undefined') return false;
  const key = POLKADOT_INJECT_KEYS[walletId];
  if (!key) return false;
  return !!(window as WindowWithInjected).injectedWeb3?.[key];
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function assertBrowser() {
  if (typeof window === 'undefined') {
    throw new Error('Polkadot wallet API is only available in the browser.');
  }
}

async function waitForCryptoReady() {
  const { cryptoWaitReady } = await import('@polkadot/util-crypto');
  await Promise.race([
    cryptoWaitReady(),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Polkadot crypto init timed out. Reload the page and try again.')), 10_000),
    ),
  ]);
}

/** Delay helper */
const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Enable a SINGLE wallet extension via window.injectedWeb3 directly.
 *
 * Chrome MV3 puts extension service workers to sleep after ~30 s of
 * inactivity.  The first enable() call sends a postMessage that WAKES
 * the worker, but the message itself is lost (the worker wasn't ready
 * to receive it).  We therefore retry up to 3 times with a delay
 * between attempts — the second or third call reaches the now-awake
 * worker and succeeds.
 */
async function enableSingleExtension(appName: string, injectedKey: string) {
  assertBrowser();
  const injectedWeb3 = (window as WindowWithInjected).injectedWeb3;

  if (!injectedWeb3?.[injectedKey]) {
    throw new Error(
      `"${injectedKey}" extension not found. Install it and reload the page.`,
    );
  }

  // Attempt 1: Long timeout so the user has time to find and approve the
  // authorization popup the extension shows on first-connect.
  // We only retry if the FAILURE was a service-worker error (not a timeout),
  // because retrying after a timeout would dismiss the pending approval popup.
  let serviceWorkerError = false;

  try {
    return await Promise.race([
      injectedWeb3[injectedKey].enable(appName),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('ENABLE_TIMEOUT')), 40_000),
      ),
    ]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);

    serviceWorkerError =
      msg.includes('Receiving end does not exist') ||
      msg.includes('service worker') ||
      msg.includes('Could not establish connection') ||
      msg.includes('Failed to wake up') ||
      msg.includes('Failed to send message');

    if (msg === 'ENABLE_TIMEOUT') {
      throw new Error(
        `"${injectedKey}" authorization timed out. ` +
          'Check your extension — it may be waiting for you to approve the connection.',
      );
    }

    if (!serviceWorkerError) throw err; // user rejected or other non-retryable error
  }

  // Attempts 2-4: Retries only for service-worker wake-up errors.
  // The first call woke the sleeping worker; wait for it to fully initialise
  // (Chrome MV3 workers can take 3-5 s) then retry.
  for (let attempt = 2; attempt <= 4; attempt++) {
    await delay(4_000); // 4 s – enough for MV3 worker to reinitialise
    try {
      return await Promise.race([
        injectedWeb3[injectedKey].enable(appName),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('ENABLE_TIMEOUT')), 15_000),
        ),
      ]);
    } catch (retryErr: unknown) {
      const retryMsg = retryErr instanceof Error ? retryErr.message : String(retryErr);
      const stillBad =
        retryMsg.includes('Receiving end does not exist') ||
        retryMsg.includes('service worker') ||
        retryMsg.includes('Could not establish connection') ||
        retryMsg.includes('Failed to wake up') ||
        retryMsg.includes('Failed to send message') ||
        retryMsg === 'ENABLE_TIMEOUT';

      if (!stillBad || attempt === 4) break;
    }
  }

  throw new Error(
    `Could not connect to "${injectedKey}". ` +
      'Click the extension icon in your toolbar, wait a moment, then click Connect again.',
  );
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Fire-and-forget: start loading the @polkadot/util-crypto WASM binary early
 * (e.g. at app startup) so that by the time the user clicks Connect, the
 * library is already initialised and enable() fires without any delay.
 *
 * Safe to call multiple times — cryptoWaitReady() is idempotent once resolved.
 */
export function preloadPolkadotCrypto(): void {
  import('@polkadot/util-crypto')
    .then(({ cryptoWaitReady }) => cryptoWaitReady())
    .catch(() => {
      // Silently ignore — getPolkadotAccounts will retry at connect time
    });
}

/**
 * Enable all Polkadot extensions via @polkadot/extension-dapp.
 * Kept for backward-compatibility but prefer getPolkadotAccounts() which
 * calls the specific extension directly when preferredSource is given.
 */
export async function enablePolkadotExtensions(appName: string) {
  await waitForCryptoReady();
  const { web3Enable } = await import('@polkadot/extension-dapp');
  return web3Enable(appName);
}

/**
 * Get accounts from a Polkadot wallet extension.
 *
 * When `preferredSource` is provided (the injected key, e.g. 'subwallet-js')
 * we call that extension directly instead of web3Enable, avoiding the Chrome
 * MV3 service-worker sleep issue.
 */
export async function getPolkadotAccounts(
  appName: string,
  preferredSource?: string,
): Promise<PolkadotAccount[]> {
  assertBrowser();
  await waitForCryptoReady();

  // ── Fast path: call the specific extension directly ──────────────────────
  if (preferredSource) {
    const injected = await enableSingleExtension(appName, preferredSource);
    const accounts = await injected.accounts.get();

    if (!accounts.length) {
      throw new Error(
        `No accounts found in "${preferredSource}". Open the extension and create or import an account.`,
      );
    }

    return accounts.map((a) => ({
      address: a.address,
      name: a.name,
      source: preferredSource,
    }));
  }

  // ── Fallback: web3Enable for all extensions (with timeout) ───────────────
  const { web3Enable, web3Accounts } = await import('@polkadot/extension-dapp');
  const extensions = await Promise.race([
    web3Enable(appName),
    new Promise<never>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              'Wallet extensions did not respond. Open your extension popup first, then retry.',
            ),
          ),
        15_000,
      ),
    ),
  ]);

  if (!extensions.length) {
    throw new Error(
      'No Polkadot extensions responded. Install a wallet extension and reload.',
    );
  }

  const accounts = await web3Accounts();
  if (!accounts.length) {
    throw new Error(
      'No Polkadot accounts found. Open your wallet and create or import an account.',
    );
  }

  return accounts.map((account) => ({
    address: account.address,
    name: account.meta.name,
    source: account.meta.source,
  }));
}

/**
 * Get the signer for a specific Polkadot extension source.
 * Uses web3FromSource which is properly typed — by the time we need a
 * signer the extension's service worker is already awake from the
 * earlier enable() call during account retrieval.
 */
export async function getPolkadotSigner(source: string) {
  assertBrowser();
  const { web3FromSource } = await import('@polkadot/extension-dapp');
  const injector = await web3FromSource(source);
  return injector.signer;
}
