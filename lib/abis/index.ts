/**
 * Prizm Protocol – Contract ABIs
 * ══════════════════════════════
 * These must stay in sync with the Solidity files in /contracts.
 * Generated from the human-readable ABI format; ethers v6 accepts both.
 */

// ─── PoPVerifier ────────────────────────────────────────────────────────────
export const POP_VERIFIER_ABI = [
  // views
  'function attester() view returns (address)',
  'function getPopTier(address user) view returns (uint8)',
  'function isVerified(address user) view returns (bool)',
  'function getCredential(address user) view returns (uint8 tier, uint256 expiresAt, bool active, bool expired)',
  'function usedNonces(bytes32 nonce) view returns (bool)',
  // user-facing
  'function submitAttestation(uint8 tier, bytes polkadotAddress, bytes32 nonce, bytes signature)',
  // owner
  'function issueCredential(address user, uint8 tier)',
  'function revokeCredential(address user)',
  'function updateAttester(address newAttester)',
  // events
  'event CredentialIssued(address indexed user, uint8 tier, uint256 expiresAt)',
  'event CredentialRevoked(address indexed user)',
  'event AttesterUpdated(address indexed oldAttester, address indexed newAttester)',
] as const;

// ─── PoPRiskEngine ──────────────────────────────────────────────────────────
export const POP_RISK_ENGINE_ABI = [
  'function isVerified(address user) view returns (bool)',
  'function getBorrowMultiplier(address user) view returns (uint256)',
  'function getBorrowCap(address user) view returns (uint256)',
  'function getTierInfo(address user) view returns (uint8 tier, uint256 multiplier, uint256 borrowCap)',
  'function tierMultiplier(uint8) view returns (uint256)',
  'function tierBorrowCap(uint8) view returns (uint256)',
  // owner
  'function setTierParameters(uint8 tier, uint256 multiplier, uint256 borrowCap)',
  'function updateVerifier(address newVerifier)',
  // events
  'event TierParametersUpdated(uint8 indexed tier, uint256 multiplier, uint256 borrowCap)',
] as const;

// ─── RWAVault ───────────────────────────────────────────────────────────────
export const RWA_VAULT_ABI = [
  // constants
  'function BASE_LTV() view returns (uint256)',
  'function LIQUIDATION_THRESHOLD() view returns (uint256)',
  'function LIQUIDATION_BONUS() view returns (uint256)',
  // state
  'function collateralToken() view returns (address)',
  'function borrowToken() view returns (address)',
  'function collateralPrice() view returns (uint256)',
  'function supplyRateBps() view returns (uint256)',
  'function borrowRateBps() view returns (uint256)',
  'function totalSupplied() view returns (uint256)',
  'function totalBorrowed() view returns (uint256)',
  // user state
  'function positions(address user) view returns (uint256 supplied, uint256 borrowed, uint256 lastUpdate)',
  'function getPosition(address user) view returns (uint256 supplied, uint256 borrowed, uint256 healthFactor, uint256 maxBorrow, uint8 popTier)',
  'function getUtilization() view returns (uint256)',
  'function collateralValueUsd(uint256 amount) view returns (uint256)',
  // core
  'function supply(uint256 amount)',
  'function withdraw(uint256 amount)',
  'function borrow(uint256 amount)',
  'function repay(uint256 amount)',
  'function liquidate(address user, uint256 debtToCover)',
  // owner
  'function setCollateralPrice(uint256 newPrice)',
  'function fundVault(uint256 amount)',
  'function setRates(uint256 supply_, uint256 borrow_)',
  'function updateRiskEngine(address newEngine)',
  // events
  'event Supplied(address indexed user, uint256 amount)',
  'event Withdrawn(address indexed user, uint256 amount)',
  'event Borrowed(address indexed user, uint256 amount)',
  'event Repaid(address indexed user, uint256 amount)',
  'event Liquidated(address indexed user, address indexed liquidator, uint256 debtRepaid, uint256 collateralSeized)',
  'event PriceUpdated(uint256 oldPrice, uint256 newPrice)',
] as const;

// ─── ERC-20 (shared by MockRWAToken and MockUSDC) ───────────────────────────
export const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  // faucet
  'function faucet()',
  // owner
  'function mint(address to, uint256 amount)',
  // events
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'event Faucet(address indexed recipient, uint256 amount)',
] as const;

// Alias for clarity
export const MOCK_RWA_TOKEN_ABI = ERC20_ABI;
export const MOCK_USDC_ABI      = ERC20_ABI;
