/**
 * Prizm Protocol – Full Deployment Script
 * ═══════════════════════════════════════
 * Deploys all five contracts to Moonbase Alpha (or any configured network).
 *
 * Usage:
 *   npx hardhat run scripts/deploy.js --network moonbase
 *
 * After deployment:
 *   1. Copy the printed addresses into your .env.local file.
 *   2. Set ATTESTER_ADDRESS to the deployer address (for demo) or a dedicated key.
 *   3. Run `fundVault` to seed USDC liquidity.
 */

const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('\n🚀 Deploying Prizm Protocol contracts');
  console.log('   Deployer :', deployer.address);
  console.log('   Network  :', (await ethers.provider.getNetwork()).name);
  console.log('   Balance  :', ethers.formatEther(await ethers.provider.getBalance(deployer.address)), 'DEV\n');

  // ── 1. MockRWAToken ───────────────────────────────────────────────────────
  console.log('📄 Deploying MockRWAToken (Prime Real Estate)…');
  const RWA = await ethers.getContractFactory('MockRWAToken');
  const rwa = await RWA.deploy('Prime Real Estate Token', 'PRE');
  await rwa.waitForDeployment();
  console.log('   ✅ MockRWAToken :', await rwa.getAddress());

  // ── 2. MockUSDC ──────────────────────────────────────────────────────────
  console.log('📄 Deploying MockUSDC…');
  const USDC = await ethers.getContractFactory('MockUSDC');
  const usdc = await USDC.deploy();
  await usdc.waitForDeployment();
  console.log('   ✅ MockUSDC     :', await usdc.getAddress());

  // ── 3. PoPVerifier ────────────────────────────────────────────────────────
  // Attester = deployer for demo; replace with a dedicated key in production.
  const attesterAddress = deployer.address;
  console.log(`\n📄 Deploying PoPVerifier (attester = ${attesterAddress})…`);
  const Verifier = await ethers.getContractFactory('PoPVerifier');
  const verifier = await Verifier.deploy(attesterAddress);
  await verifier.waitForDeployment();
  console.log('   ✅ PoPVerifier  :', await verifier.getAddress());

  // ── 4. PoPRiskEngine ──────────────────────────────────────────────────────
  console.log('📄 Deploying PoPRiskEngine…');
  const Engine = await ethers.getContractFactory('PoPRiskEngine');
  const engine = await Engine.deploy(await verifier.getAddress());
  await engine.waitForDeployment();
  console.log('   ✅ PoPRiskEngine:', await engine.getAddress());

  // ── 5. RWAVault ───────────────────────────────────────────────────────────
  console.log('📄 Deploying RWAVault…');
  const Vault = await ethers.getContractFactory('RWAVault');
  const vault = await Vault.deploy(
    await rwa.getAddress(),
    await usdc.getAddress(),
    await engine.getAddress()
  );
  await vault.waitForDeployment();
  console.log('   ✅ RWAVault     :', await vault.getAddress());

  // ── 6. Seed vault with USDC liquidity ────────────────────────────────────
  console.log('\n💰 Seeding vault with 1 000 000 USDC…');
  const seedAmount = ethers.parseUnits('1000000', 6);
  const approveTx  = await usdc.approve(await vault.getAddress(), seedAmount);
  await approveTx.wait();
  const fundTx = await vault.fundVault(seedAmount);
  await fundTx.wait();
  console.log('   ✅ Vault funded');

  // ── 7. Summary ────────────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════════════════');
  console.log('  CONTRACT ADDRESSES – copy into .env.local');
  console.log('══════════════════════════════════════════════════════');
  console.log(`NEXT_PUBLIC_MOCK_RWA_TOKEN_ADDRESS=${await rwa.getAddress()}`);
  console.log(`NEXT_PUBLIC_MOCK_USDC_ADDRESS=${await usdc.getAddress()}`);
  console.log(`NEXT_PUBLIC_POP_VERIFIER_ADDRESS=${await verifier.getAddress()}`);
  console.log(`NEXT_PUBLIC_POP_RISK_ENGINE_ADDRESS=${await engine.getAddress()}`);
  console.log(`NEXT_PUBLIC_RWA_VAULT_ADDRESS=${await vault.getAddress()}`);
  console.log(`ATTESTER_ADDRESS=${attesterAddress}`);
  console.log('══════════════════════════════════════════════════════\n');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
