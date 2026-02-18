import { describe, expect, it } from 'vitest';
import { validateAmount, validateEmail, validateWalletAddress } from '@/lib/validation';

describe('validation helpers', () => {
  it('validates emails', () => {
    expect(validateEmail('hello@prizm.xyz')).toBe(true);
    expect(validateEmail('bad-email')).toBe(false);
  });

  it('validates numeric amounts', () => {
    expect(validateAmount('10', 5).valid).toBe(true);
    expect(validateAmount('3', 5).valid).toBe(false);
    expect(validateAmount('abc').valid).toBe(false);
  });

  it('accepts EVM addresses', () => {
    expect(validateWalletAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f7eaB')).toBe(true);
    expect(validateWalletAddress('0x123')).toBe(false);
  });
});
