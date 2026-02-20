/**
 * lib/blockchain/contracts.ts
 * ═══════════════════════════
 * All EVM contract interactions for Prizm Protocol (Moonbase Alpha).
 * Uses ethers v6 with MetaMask as the signer.
 */

import { BrowserProvider, Contract, parseEther, parseUnits, formatEther, formatUnits, toUtf8Bytes, type Eip1193Provider } from 'ethers';
import { appConfig } from '@/lib/config';
import {
  RWA_VAULT_ABI,
  POP_VERIFIER_ABI,
  POP_RISK_ENGINE_ABI,
  ERC20_ABI,
} from '@/lib/abis';

// ─── Ethereum provider helpers ────────────────────────────────────────────────

type EthWindow = Window & { ethereum?: Eip1193Provider };

function getEthereum(): Eip1193Provider {
  if (typeof window === 'undefined' || !(window as EthWindow).ethereum) {
    throw new Error('MetaMask not found. Please install the MetaMask extension.');
  }
  return (window as EthWindow).ethereum!;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserPosition {
  supplied: string;         // RWA tokens (formatted, 18 dec)
  suppliedRaw: bigint;
  borrowed: string;         // USDC (formatted, 6 dec)
  borrowedRaw: bigint;
  healthFactor: number;     // Infinity if no debt
  maxBorrow: string;        // USDC
  maxBorrowRaw: bigint;
  popTier: number;          // 0-3
  collateralValueUsd: string; // USD value of collateral
}

export interface VaultStats {
  totalSupplied: string;    // USDC value
  totalBorrowed: string;    // USDC
  utilization: number;      // 0-100
  supplyApy: number;        // %
  borrowApy: number;        // %
  collateralPrice: string;  // USDC per token
}

export interface TokenBalances {
  rwa: string;
  rwaRaw: bigint;
  usdc: string;
  usdcRaw: bigint;
}

// ─── Provider helpers ─────────────────────────────────────────────────────────

async function getSigner() {
  const provider = new BrowserProvider(getEthereum());
  return provider.getSigner();
}

async function ensureCorrectNetwork(provider: BrowserProvider) {
  const network = await provider.getNetwork();
  const expected = BigInt(appConfig.evm.chainId);
  if (network.chainId !== expected) {
    await getEthereum().request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x' + appConfig.evm.chainId.toString(16) }],
    });
  }
}

// ─── Contract factories ───────────────────────────────────────────────────────

export async function getRwaVaultContract(withSigner = false) {
  const signer = withSigner ? await getSigner() : null;
  const addr   = appConfig.contracts.rwaVault;
  if (!addr) throw new Error('RWAVault address not configured. Run the deploy script first.');
  return new Contract(addr, RWA_VAULT_ABI, signer ?? (await getRoProvider()));
}

export async function getPopVerifierContract(withSigner = false) {
  const signer = withSigner ? await getSigner() : null;
  const addr   = appConfig.contracts.popVerifier;
  if (!addr) throw new Error('PoPVerifier address not configured.');
  return new Contract(addr, POP_VERIFIER_ABI, signer ?? (await getRoProvider()));
}

export async function getPopRiskEngineContract() {
  const addr = appConfig.contracts.popRiskEngine;
  if (!addr) throw new Error('PoPRiskEngine address not configured.');
  return new Contract(addr, POP_RISK_ENGINE_ABI, await getRoProvider());
}

export async function getRwaTokenContract(withSigner = false) {
  const signer = withSigner ? await getSigner() : null;
  const addr   = appConfig.contracts.mockRwaToken;
  if (!addr) throw new Error('MockRWAToken address not configured.');
  return new Contract(addr, ERC20_ABI, signer ?? (await getRoProvider()));
}

export async function getUsdcContract(withSigner = false) {
  const signer = withSigner ? await getSigner() : null;
  const addr   = appConfig.contracts.mockUsdc;
  if (!addr) throw new Error('MockUSDC address not configured.');
  return new Contract(addr, ERC20_ABI, signer ?? (await getRoProvider()));
}

async function getRoProvider() {
  return new BrowserProvider(getEthereum());
}

// ─── ERC-20 helpers ───────────────────────────────────────────────────────────

/**
 * Ensure the vault has ≥ `amount` allowance for the given token.
 * Returns the approval tx hash if a new approval was needed, or null.
 */
export async function ensureApproval(
  tokenContract: Contract,
  spender: string,
  amount: bigint,
  userAddress: string,
): Promise<string | null> {
  const allowance = await tokenContract.allowance(userAddress, spender) as bigint;
  if (allowance >= amount) return null;
  const tx = await tokenContract.approve(spender, amount);
  await tx.wait();
  return tx.hash as string;
}

// ─── Faucet ───────────────────────────────────────────────────────────────────

export async function claimRwaFaucet(): Promise<string> {
  const token = await getRwaTokenContract(true);
  const tx = await token.faucet();
  await tx.wait();
  return tx.hash as string;
}

export async function claimUsdcFaucet(): Promise<string> {
  const usdc = await getUsdcContract(true);
  const tx = await usdc.faucet();
  await tx.wait();
  return tx.hash as string;
}

// ─── Balances ─────────────────────────────────────────────────────────────────

export async function getTokenBalances(userAddress: string): Promise<TokenBalances> {
  const [rwaToken, usdcToken] = await Promise.all([
    getRwaTokenContract(),
    getUsdcContract(),
  ]);
  const [rwaRaw, usdcRaw] = await Promise.all([
    rwaToken.balanceOf(userAddress) as Promise<bigint>,
    usdcToken.balanceOf(userAddress) as Promise<bigint>,
  ]);
  return {
    rwa:     formatEther(rwaRaw),
    rwaRaw,
    usdc:    formatUnits(usdcRaw, 6),
    usdcRaw,
  };
}

// ─── Vault reads ──────────────────────────────────────────────────────────────

export async function getUserPosition(userAddress: string): Promise<UserPosition> {
  const vault = await getRwaVaultContract();

  const [pos, price] = await Promise.all([
    vault.getPosition(userAddress) as Promise<[bigint, bigint, bigint, bigint, number]>,
    vault.collateralPrice() as Promise<bigint>,
  ]);

  const [supplied, borrowed, healthFactorRaw, maxBorrowRaw, popTier] = pos;

  const hf = healthFactorRaw === BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
    ? Infinity
    : Number(healthFactorRaw) / 1e18;

  const collateralValueRaw = (supplied * price) / BigInt(1e18);

  return {
    supplied:          formatEther(supplied),
    suppliedRaw:       supplied,
    borrowed:          formatUnits(borrowed, 6),
    borrowedRaw:       borrowed,
    healthFactor:      hf,
    maxBorrow:         formatUnits(maxBorrowRaw, 6),
    maxBorrowRaw,
    popTier,
    collateralValueUsd: formatUnits(collateralValueRaw, 6),
  };
}

export async function getVaultStats(): Promise<VaultStats> {
  const vault = await getRwaVaultContract();

  const [totalSuppliedRaw, totalBorrowedRaw, utilization, supplyBps, borrowBps, price] =
    await Promise.all([
      vault.totalSupplied() as Promise<bigint>,
      vault.totalBorrowed() as Promise<bigint>,
      vault.getUtilization() as Promise<bigint>,
      vault.supplyRateBps() as Promise<bigint>,
      vault.borrowRateBps() as Promise<bigint>,
      vault.collateralPrice() as Promise<bigint>,
    ]);

  // Convert totalSupplied (18 dec RWA) to USD (6 dec USDC)
  const totalSuppliedUsd = (totalSuppliedRaw * price) / BigInt(1e18);

  return {
    totalSupplied:   formatUnits(totalSuppliedUsd, 6),
    totalBorrowed:   formatUnits(totalBorrowedRaw, 6),
    utilization:     Number(utilization),
    supplyApy:       Number(supplyBps) / 100,
    borrowApy:       Number(borrowBps) / 100,
    collateralPrice: formatUnits(price, 6),
  };
}

// ─── Vault writes ─────────────────────────────────────────────────────────────

export async function supplyCollateral(
  amountEther: string,
  onApproveHash?: (hash: string) => void,
): Promise<string> {
  const signer    = await getSigner();
  const vaultAddr = appConfig.contracts.rwaVault;
  const amount    = parseEther(amountEther);

  // Approve
  const rwaToken = await getRwaTokenContract(true);
  const approveHash = await ensureApproval(rwaToken, vaultAddr, amount, await signer.getAddress());
  if (approveHash && onApproveHash) onApproveHash(approveHash);

  // Supply
  const vault = await getRwaVaultContract(true);
  const tx    = await vault.supply(amount);
  await tx.wait();
  return tx.hash as string;
}

export async function withdrawCollateral(amountEther: string): Promise<string> {
  const vault = await getRwaVaultContract(true);
  const tx    = await vault.withdraw(parseEther(amountEther));
  await tx.wait();
  return tx.hash as string;
}

export async function borrowUsdc(amountUsdc: string): Promise<string> {
  const vault = await getRwaVaultContract(true);
  const tx    = await vault.borrow(parseUnits(amountUsdc, 6));
  await tx.wait();
  return tx.hash as string;
}

export async function repayUsdc(
  amountUsdc: string,
  onApproveHash?: (hash: string) => void,
): Promise<string> {
  const signer    = await getSigner();
  const vaultAddr = appConfig.contracts.rwaVault;
  const amount    = parseUnits(amountUsdc, 6);

  // Approve USDC
  const usdcToken   = await getUsdcContract(true);
  const approveHash = await ensureApproval(usdcToken, vaultAddr, amount, await signer.getAddress());
  if (approveHash && onApproveHash) onApproveHash(approveHash);

  // Repay
  const vault = await getRwaVaultContract(true);
  const tx    = await vault.repay(amount);
  await tx.wait();
  return tx.hash as string;
}

// ─── PoP contract reads ───────────────────────────────────────────────────────

export interface OnChainPopStatus {
  tier: number;
  expiresAt: number; // unix timestamp
  active: boolean;
  expired: boolean;
}

export async function getOnChainPopStatus(userAddress: string): Promise<OnChainPopStatus> {
  const verifier = await getPopVerifierContract();
  const [tier, expiresAt, active, expired] = await verifier.getCredential(userAddress) as [number, bigint, boolean, boolean];
  return {
    tier:      Number(tier),
    expiresAt: Number(expiresAt),
    active,
    expired,
  };
}

export async function getPeerTierInfo(userAddress: string) {
  const engine = await getPopRiskEngineContract();
  const [tier, multiplier, borrowCap] = await engine.getTierInfo(userAddress) as [number, bigint, bigint];
  return {
    tier:       Number(tier),
    multiplier: Number(multiplier) / 100, // convert from basis points to ×
    borrowCap:  formatUnits(borrowCap, 6),
  };
}

// ─── Network helper ───────────────────────────────────────────────────────────

export async function switchToMoonbase(): Promise<void> {
  const eth = getEthereum();

  try {
    await eth.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x507' }], // 0x507 = 1287 = Moonbase Alpha
    });
  } catch (switchError: unknown) {
    // Chain not yet added – add it
    if ((switchError as { code?: number }).code === 4902) {
      await eth.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId:          '0x507',
          chainName:        'Moonbase Alpha',
          nativeCurrency:   { name: 'DEV', symbol: 'DEV', decimals: 18 },
          rpcUrls:          ['https://rpc.api.moonbase.moonbeam.network'],
          blockExplorerUrls:['https://moonbase.moonscan.io'],
        }],
      });
    } else {
      throw switchError;
    }
  }
}

// ─── PoP on-chain submission ───────────────────────────────────────────────────

export interface SubmitAttestationParams {
  tier: number;
  polkadotAddress: string; // SS58 address string — encoded to UTF-8 bytes on-chain
  nonce: string;           // 0x-prefixed bytes32
  signature: string;       // 0x-prefixed ECDSA signature
}

/**
 * Submit a People Chain PoP attestation to PoPVerifier.sol on Moonbase Alpha.
 * Returns the ethers TransactionResponse so callers can await tx.wait().
 */
export async function submitPopAttestation(params: SubmitAttestationParams) {
  const verifier = await getPopVerifierContract(true);
  const polkadotBytes = toUtf8Bytes(params.polkadotAddress);
  const tx = await verifier.submitAttestation(
    params.tier,
    polkadotBytes,
    params.nonce,
    params.signature,
  );
  return tx as { wait: () => Promise<unknown>; hash: string };
}

export function getTxExplorerUrl(txHash: string): string {
  return `https://moonbase.moonscan.io/tx/${txHash}`;
}
