import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),

  // ── Polkadot relay chain ─────────────────────────────────────────────────────
  NEXT_PUBLIC_POLKADOT_RPC_URL:     z.string().default('wss://rpc.polkadot.io'),
  NEXT_PUBLIC_POLKADOT_SS58_PREFIX: z.string().default('0'),
  NEXT_PUBLIC_POLKADOT_TRANSFER_TO: z.string().optional(),

  // ── Polkadot People Chain (PoP queries – Paseo testnet by default) ────────────
  NEXT_PUBLIC_PEOPLE_CHAIN_RPC_URL: z.string().default('wss://people-paseo.rpc.amforc.com'),

  // ── Moonbase Alpha EVM ───────────────────────────────────────────────────────
  NEXT_PUBLIC_MOONBEAM_RPC_URL:  z.string().default('https://rpc.api.moonbase.moonbeam.network'),
  NEXT_PUBLIC_MOONBEAM_CHAIN_ID: z.string().default('1287'),

  // ── Deployed contract addresses (fill after running scripts/deploy.js) ─────────
  NEXT_PUBLIC_RWA_VAULT_ADDRESS:       z.string().default(''),
  NEXT_PUBLIC_POP_VERIFIER_ADDRESS:    z.string().default(''),
  NEXT_PUBLIC_POP_RISK_ENGINE_ADDRESS: z.string().default(''),
  NEXT_PUBLIC_MOCK_RWA_TOKEN_ADDRESS:  z.string().default(''),
  NEXT_PUBLIC_MOCK_USDC_ADDRESS:       z.string().default(''),
});

const env = envSchema.parse({
  NEXT_PUBLIC_APP_ENV:               process.env.NEXT_PUBLIC_APP_ENV,
  NEXT_PUBLIC_POLKADOT_RPC_URL:      process.env.NEXT_PUBLIC_POLKADOT_RPC_URL,
  NEXT_PUBLIC_POLKADOT_SS58_PREFIX:  process.env.NEXT_PUBLIC_POLKADOT_SS58_PREFIX,
  NEXT_PUBLIC_POLKADOT_TRANSFER_TO:  process.env.NEXT_PUBLIC_POLKADOT_TRANSFER_TO,
  NEXT_PUBLIC_PEOPLE_CHAIN_RPC_URL:  process.env.NEXT_PUBLIC_PEOPLE_CHAIN_RPC_URL,
  NEXT_PUBLIC_MOONBEAM_RPC_URL:      process.env.NEXT_PUBLIC_MOONBEAM_RPC_URL,
  NEXT_PUBLIC_MOONBEAM_CHAIN_ID:     process.env.NEXT_PUBLIC_MOONBEAM_CHAIN_ID,
  NEXT_PUBLIC_RWA_VAULT_ADDRESS:       process.env.NEXT_PUBLIC_RWA_VAULT_ADDRESS,
  NEXT_PUBLIC_POP_VERIFIER_ADDRESS:    process.env.NEXT_PUBLIC_POP_VERIFIER_ADDRESS,
  NEXT_PUBLIC_POP_RISK_ENGINE_ADDRESS: process.env.NEXT_PUBLIC_POP_RISK_ENGINE_ADDRESS,
  NEXT_PUBLIC_MOCK_RWA_TOKEN_ADDRESS:  process.env.NEXT_PUBLIC_MOCK_RWA_TOKEN_ADDRESS,
  NEXT_PUBLIC_MOCK_USDC_ADDRESS:       process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS,
});

export const appConfig = {
  env: env.NEXT_PUBLIC_APP_ENV,

  polkadot: {
    rpcUrl:     env.NEXT_PUBLIC_POLKADOT_RPC_URL,
    ss58Prefix: Number(env.NEXT_PUBLIC_POLKADOT_SS58_PREFIX),
    transferTo: env.NEXT_PUBLIC_POLKADOT_TRANSFER_TO ?? '',
  },

  peopleChain: {
    rpcUrl: env.NEXT_PUBLIC_PEOPLE_CHAIN_RPC_URL,
  },

  evm: {
    rpcUrl:  env.NEXT_PUBLIC_MOONBEAM_RPC_URL,
    chainId: Number(env.NEXT_PUBLIC_MOONBEAM_CHAIN_ID),
  },

  contracts: {
    rwaVault:      env.NEXT_PUBLIC_RWA_VAULT_ADDRESS,
    popVerifier:   env.NEXT_PUBLIC_POP_VERIFIER_ADDRESS,
    popRiskEngine: env.NEXT_PUBLIC_POP_RISK_ENGINE_ADDRESS,
    mockRwaToken:  env.NEXT_PUBLIC_MOCK_RWA_TOKEN_ADDRESS,
    mockUsdc:      env.NEXT_PUBLIC_MOCK_USDC_ADDRESS,
  },

  /** True when all critical contract addresses are present */
  get contractsDeployed() {
    return (
      !!this.contracts.rwaVault &&
      !!this.contracts.popVerifier &&
      !!this.contracts.mockRwaToken &&
      !!this.contracts.mockUsdc
    );
  },
};

export type AppConfig = typeof appConfig;
