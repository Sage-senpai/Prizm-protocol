import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },

  // Pin Turbopack root to this project dir — prevents it from picking up
  // a stale package-lock.json in the user's home directory.
  turbopack: {
    root: __dirname,
  },

  // Transpile @polkadot/* so Next.js processes their ESM/CJS correctly on all platforms
  transpilePackages: [
    '@polkadot/api',
    '@polkadot/util',
    '@polkadot/util-crypto',
    '@polkadot/extension-dapp',
    '@polkadot/types',
    '@polkadot/rpc-provider',
  ],

  webpack(config, { isServer }) {
    // Disable webpack's filesystem pack cache.
    // @polkadot/wasm-crypto embeds a multi-MB WASM binary; webpack tries to
    // load the entire cache pack as a single ArrayBuffer which OOMs even with
    // --max-old-space-size=4096 because ArrayBuffers use native heap, not V8.
    // Memory cache still speeds up incremental rebuilds without the OOM risk.
    config.cache = { type: 'memory' };

    // Enable async WebAssembly — required by @polkadot/util-crypto wasm binaries
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    // Polyfill / stub Node.js built-ins that @polkadot/* references but browsers lack
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        path: false,
        os: false,
        buffer: false,
      };
    }

    return config;
  },
};

export default nextConfig;
