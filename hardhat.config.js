require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

// Fallback to Hardhat account #0 (well-known test key – safe for local dev only)
// For Moonbase Alpha deployment you MUST set DEPLOYER_PRIVATE_KEY in .env.local
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY
  || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const MOONSCAN_API_KEY     = process.env.MOONSCAN_API_KEY     || '';

/** @type {import('hardhat/config').HardhatUserConfig} */
module.exports = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: false,
    },
  },
  networks: {
    // ── Moonbase Alpha (Moonbeam testnet) ────────────────────────────────────
    moonbase: {
      url:      'https://rpc.api.moonbase.moonbeam.network',
      chainId:  1287,
      accounts: [DEPLOYER_PRIVATE_KEY],
      gasPrice: 1_000_000_000, // 1 Gwei
    },
    // ── Moonbeam mainnet ─────────────────────────────────────────────────────
    moonbeam: {
      url:      'https://rpc.api.moonbeam.network',
      chainId:  1284,
      accounts: [DEPLOYER_PRIVATE_KEY],
      gasPrice: 100_000_000_000, // 100 Gwei
    },
    // ── Local Hardhat node ────────────────────────────────────────────────────
    hardhat: {
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: {
      moonbaseAlpha: MOONSCAN_API_KEY,
      moonbeam:      MOONSCAN_API_KEY,
    },
    customChains: [
      {
        network:  'moonbaseAlpha',
        chainId:  1287,
        urls: {
          apiURL:      'https://api-moonbase.moonscan.io/api',
          browserURL:  'https://moonbase.moonscan.io',
        },
      },
    ],
  },
  paths: {
    sources:   './contracts',
    tests:     './test',
    cache:     './cache',
    artifacts: './artifacts',
  },
};
