import { describe, expect, it } from 'vitest';
import { appConfig } from '@/lib/config';

describe('appConfig', () => {
  it('provides sane defaults', () => {
    expect(appConfig.polkadot.rpcUrl).toContain('ws');
    expect(appConfig.evm.chainId).toBeGreaterThan(0);
  });
});
