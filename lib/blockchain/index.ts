export * from './polkadot';
export * from './polkadot-wallet';
export * from './evm';
export * from './contracts';
export * from './people-chain';
// Named exports from pop.ts to avoid re-export conflicts
export {
  requestAttestation,
  fetchOnChainTier,
  TIER_LABELS,
  TIER_MULTIPLIERS,
  TIER_BORROW_CAPS,
  TIER_DESCRIPTIONS,
} from './pop';
export type { AttestationPayload, PopVerificationStatus } from './pop';
export {
  fetchPolkadotLatestBlock,
  subscribePolkadotFinalizedBlocks,
  submitPolkadotTransfer,
  fetchEvmChainData,
  submitEvmExampleTransaction,
} from './examples';
