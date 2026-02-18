import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  NEXT_PUBLIC_POLKADOT_RPC_URL: z.string().default('wss://rpc.polkadot.io'),
  NEXT_PUBLIC_POLKADOT_SS58_PREFIX: z.string().default('0'),
  NEXT_PUBLIC_POLKADOT_TRANSFER_TO: z.string().optional(),
  NEXT_PUBLIC_MOONBEAM_RPC_URL: z.string().default('https://rpc.api.moonbase.moonbeam.network'),
  NEXT_PUBLIC_MOONBEAM_CHAIN_ID: z.string().default('1287'),
  NEXT_PUBLIC_EVM_LENDING_POOL_ADDRESS: z.string().optional(),
});

const env = envSchema.parse({
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  NEXT_PUBLIC_POLKADOT_RPC_URL: process.env.NEXT_PUBLIC_POLKADOT_RPC_URL,
  NEXT_PUBLIC_POLKADOT_SS58_PREFIX: process.env.NEXT_PUBLIC_POLKADOT_SS58_PREFIX,
  NEXT_PUBLIC_POLKADOT_TRANSFER_TO: process.env.NEXT_PUBLIC_POLKADOT_TRANSFER_TO,
  NEXT_PUBLIC_MOONBEAM_RPC_URL: process.env.NEXT_PUBLIC_MOONBEAM_RPC_URL,
  NEXT_PUBLIC_MOONBEAM_CHAIN_ID: process.env.NEXT_PUBLIC_MOONBEAM_CHAIN_ID,
  NEXT_PUBLIC_EVM_LENDING_POOL_ADDRESS: process.env.NEXT_PUBLIC_EVM_LENDING_POOL_ADDRESS,
});

export const appConfig = {
  env: env.NEXT_PUBLIC_APP_ENV,
  polkadot: {
    rpcUrl: env.NEXT_PUBLIC_POLKADOT_RPC_URL,
    ss58Prefix: Number(env.NEXT_PUBLIC_POLKADOT_SS58_PREFIX),
    transferTo: env.NEXT_PUBLIC_POLKADOT_TRANSFER_TO ?? '',
  },
  evm: {
    rpcUrl: env.NEXT_PUBLIC_MOONBEAM_RPC_URL,
    chainId: Number(env.NEXT_PUBLIC_MOONBEAM_CHAIN_ID),
    lendingPoolAddress: env.NEXT_PUBLIC_EVM_LENDING_POOL_ADDRESS ?? '',
  },
};

export type AppConfig = typeof appConfig;
