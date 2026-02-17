export type VaultHistoryPoint = {
  month: string;
  supplyApy: number;
  borrowApy: number;
  utilization: number;
};

export type VaultComposition = {
  name: string;
  value: number;
  color: string;
};

export type Vault = {
  id: string;
  name: string;
  symbol: string;
  description: string;
  collateralType: string;
  risk: 'Very Low' | 'Low' | 'Medium' | 'High';
  tvl: number;
  totalSupplied: number;
  totalBorrowed: number;
  supplyApy: number;
  borrowApy: number;
  utilization: number;
  maxLtv: number;
  liquidationThreshold: number;
  healthFactor: number;
  history: VaultHistoryPoint[];
  composition: VaultComposition[];
};

const baseHistory: VaultHistoryPoint[] = [
  { month: 'Jan', supplyApy: 6.2, borrowApy: 4.9, utilization: 48 },
  { month: 'Feb', supplyApy: 6.5, borrowApy: 5.1, utilization: 52 },
  { month: 'Mar', supplyApy: 6.8, borrowApy: 5.3, utilization: 56 },
  { month: 'Apr', supplyApy: 7.2, borrowApy: 5.6, utilization: 60 },
  { month: 'May', supplyApy: 7.6, borrowApy: 5.9, utilization: 63 },
  { month: 'Jun', supplyApy: 7.1, borrowApy: 5.5, utilization: 58 },
];

export const vaults: Vault[] = [
  {
    id: 'real-estate',
    name: 'Prime Real Estate Vault',
    symbol: 'PRE',
    description: 'Tokenized residential and commercial properties across tier-one cities.',
    collateralType: 'Real Estate',
    risk: 'Low',
    tvl: 320_000_000,
    totalSupplied: 230_000_000,
    totalBorrowed: 142_000_000,
    supplyApy: 8.4,
    borrowApy: 6.1,
    utilization: 62,
    maxLtv: 70,
    liquidationThreshold: 78,
    healthFactor: 2.9,
    history: baseHistory.map((point, index) => ({
      ...point,
      supplyApy: point.supplyApy + 0.5,
      borrowApy: point.borrowApy + 0.4,
      utilization: point.utilization + index * 2,
    })),
    composition: [
      { name: 'Residential', value: 45, color: '#a855f7' },
      { name: 'Commercial', value: 35, color: '#94a3b8' },
      { name: 'Hospitality', value: 20, color: '#38bdf8' },
    ],
  },
  {
    id: 'trade-finance',
    name: 'Trade Finance Vault',
    symbol: 'TRF',
    description: 'Invoice-backed lending for verified global trade flows.',
    collateralType: 'Invoices',
    risk: 'Low',
    tvl: 180_000_000,
    totalSupplied: 140_000_000,
    totalBorrowed: 88_000_000,
    supplyApy: 7.6,
    borrowApy: 5.8,
    utilization: 63,
    maxLtv: 68,
    liquidationThreshold: 75,
    healthFactor: 2.6,
    history: baseHistory.map((point, index) => ({
      ...point,
      supplyApy: point.supplyApy + 0.2,
      borrowApy: point.borrowApy + 0.6,
      utilization: point.utilization + index,
    })),
    composition: [
      { name: 'Short-term Invoices', value: 50, color: '#a855f7' },
      { name: 'Shipping Receivables', value: 30, color: '#94a3b8' },
      { name: 'Supplier Credit', value: 20, color: '#38bdf8' },
    ],
  },
  {
    id: 'commodity',
    name: 'Commodities Vault',
    symbol: 'COM',
    description: 'Vault of tokenized metals and agricultural contracts.',
    collateralType: 'Commodities',
    risk: 'Medium',
    tvl: 210_000_000,
    totalSupplied: 165_000_000,
    totalBorrowed: 101_000_000,
    supplyApy: 6.9,
    borrowApy: 5.2,
    utilization: 61,
    maxLtv: 62,
    liquidationThreshold: 70,
    healthFactor: 2.4,
    history: baseHistory.map((point, index) => ({
      ...point,
      supplyApy: point.supplyApy + 0.1,
      borrowApy: point.borrowApy + 0.3,
      utilization: point.utilization + index * 1.5,
    })),
    composition: [
      { name: 'Metals', value: 55, color: '#a855f7' },
      { name: 'Agriculture', value: 30, color: '#94a3b8' },
      { name: 'Energy', value: 15, color: '#38bdf8' },
    ],
  },
  {
    id: 'carbon',
    name: 'Carbon Credit Vault',
    symbol: 'CRB',
    description: 'Tokenized carbon offsets with audited verification.',
    collateralType: 'Carbon Credits',
    risk: 'Medium',
    tvl: 120_000_000,
    totalSupplied: 92_000_000,
    totalBorrowed: 52_000_000,
    supplyApy: 9.1,
    borrowApy: 6.7,
    utilization: 56,
    maxLtv: 60,
    liquidationThreshold: 68,
    healthFactor: 2.2,
    history: baseHistory.map((point, index) => ({
      ...point,
      supplyApy: point.supplyApy + 1.2,
      borrowApy: point.borrowApy + 0.8,
      utilization: point.utilization - index,
    })),
    composition: [
      { name: 'Renewables', value: 40, color: '#a855f7' },
      { name: 'Reforestation', value: 35, color: '#94a3b8' },
      { name: 'Industrial', value: 25, color: '#38bdf8' },
    ],
  },
  {
    id: 'treasury',
    name: 'Treasury Bill Vault',
    symbol: 'TBL',
    description: 'Tokenized short-duration government debt instruments.',
    collateralType: 'Treasury Bills',
    risk: 'Very Low',
    tvl: 260_000_000,
    totalSupplied: 210_000_000,
    totalBorrowed: 86_000_000,
    supplyApy: 5.3,
    borrowApy: 3.4,
    utilization: 41,
    maxLtv: 75,
    liquidationThreshold: 82,
    healthFactor: 3.4,
    history: baseHistory.map((point, index) => ({
      ...point,
      supplyApy: point.supplyApy - 0.6,
      borrowApy: point.borrowApy - 1.3,
      utilization: point.utilization - index * 2,
    })),
    composition: [
      { name: '3 Month', value: 45, color: '#a855f7' },
      { name: '6 Month', value: 35, color: '#94a3b8' },
      { name: '12 Month', value: 20, color: '#38bdf8' },
    ],
  },
  {
    id: 'supply-chain',
    name: 'Supply Chain Vault',
    symbol: 'SCF',
    description: 'Working capital for verified supply chain operators.',
    collateralType: 'Supply Chain',
    risk: 'Medium',
    tvl: 150_000_000,
    totalSupplied: 112_000_000,
    totalBorrowed: 74_000_000,
    supplyApy: 8.2,
    borrowApy: 6.3,
    utilization: 66,
    maxLtv: 64,
    liquidationThreshold: 72,
    healthFactor: 2.5,
    history: baseHistory.map((point, index) => ({
      ...point,
      supplyApy: point.supplyApy + 0.7,
      borrowApy: point.borrowApy + 0.9,
      utilization: point.utilization + index * 1.2,
    })),
    composition: [
      { name: 'Logistics', value: 35, color: '#a855f7' },
      { name: 'Inventory', value: 35, color: '#94a3b8' },
      { name: 'Receivables', value: 30, color: '#38bdf8' },
    ],
  },
];

export const getVaultById = (id: string) => vaults.find((vault) => vault.id === id);
