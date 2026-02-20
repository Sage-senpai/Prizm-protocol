'use client';

/**
 * /verify – Proof of Personhood verification page
 * ═══════════════════════════════════════════════
 * Real integration with Polkadot's native PoP system:
 *
 *  Step 1 – Connect MetaMask (EVM wallet for on-chain submission)
 *  Step 2 – Connect Polkadot wallet, query People Chain for PoP tier
 *  Step 3 – Request backend attestation + submit to PoPVerifier.sol on Moonbase Alpha
 *
 * Privacy: no biometrics, no KYC.
 * The trust root is Polkadot's Ring-VRF–based People Chain personhood.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import {
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Globe,
  Wallet,
  XCircle,
  ExternalLink,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { useWallet } from '@/context/wallet-context';
import { useToast } from '@/context/toast-context';
import {
  queryPeopleChainPoP,
  requestAttestation,
  TIER_LABELS,
  TIER_MULTIPLIERS,
  TIER_BORROW_CAPS,
  TIER_DESCRIPTIONS,
} from '@/lib/blockchain/pop';
import {
  submitPopAttestation,
  switchToMoonbase,
  getTxExplorerUrl,
} from '@/lib/blockchain/contracts';
import { getPolkadotAccounts } from '@/lib/blockchain/polkadot-wallet';
import { connectEvmWallet } from '@/lib/blockchain/evm';

// ─── Types ─────────────────────────────────────────────────────────────────────

type VerifyPhase =
  | 'idle'
  | 'connecting-metamask'
  | 'connecting-polkadot'
  | 'querying-people-chain'
  | 'requesting-attestation'
  | 'submitting-on-chain'
  | 'complete'
  | 'error';

const PHASE_ORDER: VerifyPhase[] = [
  'connecting-metamask',
  'connecting-polkadot',
  'querying-people-chain',
  'requesting-attestation',
  'submitting-on-chain',
  'complete',
];

// ─── Step row ──────────────────────────────────────────────────────────────────

function StepRow({
  icon: Icon,
  label,
  sublabel,
  status,
}: {
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  status: 'pending' | 'active' | 'done' | 'error';
}) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
        status === 'active'  ? 'glass' :
        status === 'done'    ? 'glass border-white/20' :
        status === 'error'   ? 'glass-dark opacity-60' :
                               'glass-dark opacity-40'
      }`}
    >
      <div className="w-10 h-10 rounded-xl glass flex items-center justify-center flex-shrink-0">
        {status === 'active' ? <Loader2 className="w-5 h-5 text-white animate-spin" /> :
         status === 'done'   ? <CheckCircle2 className="w-5 h-5 text-white" /> :
         status === 'error'  ? <XCircle className="w-5 h-5 text-white/50" /> :
                               <Icon className="w-5 h-5 text-white/50" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-sm ${status === 'pending' ? 'text-white/40' : 'text-white'}`}>
          {label}
        </p>
        {sublabel && <p className="text-xs text-white/40 truncate mt-0.5">{sublabel}</p>}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function VerificationPage() {
  useProtectedRoute({ requireVerified: false });

  const router  = useRouter();
  const { isVerified, setPopTier, address, walletNamespace } = useWallet();
  const { showToast } = useToast();

  const [phase, setPhase]               = useState<VerifyPhase>('idle');
  const [error, setError]               = useState<string | null>(null);
  const [polkadotAddr, setPolkadotAddr] = useState<string | null>(null);
  const [evmAddr, setEvmAddr]           = useState<string | null>(null);
  const [detectedTier, setDetectedTier] = useState<number>(0);
  const [txHash, setTxHash]             = useState<string | null>(null);
  const [isComplete, setIsComplete]     = useState(false);

  useEffect(() => {
    if (isVerified && !isComplete) {
      showToast('PoP already active. Redirecting…', 'info');
      router.push('/dashboard');
    }
  }, [isVerified, isComplete, router, showToast]);

  useEffect(() => {
    if (walletNamespace === 'evm' && address) setEvmAddr(address);
  }, [walletNamespace, address]);

  // Determine step display status
  const stepStatus = (targetPhase: VerifyPhase): 'pending' | 'active' | 'done' | 'error' => {
    const cur = PHASE_ORDER.indexOf(phase);
    const tgt = PHASE_ORDER.indexOf(targetPhase);
    if (phase === 'error') return cur > tgt ? 'error' : cur === tgt ? 'error' : 'pending';
    if (cur > tgt)  return 'done';
    if (cur === tgt) return 'active';
    return 'pending';
  };

  // ── Main flow ─────────────────────────────────────────────────────────────────

  const runVerification = useCallback(async () => {
    setError(null);

    try {
      // Step 1: MetaMask + Moonbase Alpha
      setPhase('connecting-metamask');
      let evm = evmAddr;
      if (!evm) {
        const result = await connectEvmWallet();
        evm = result.address;
        setEvmAddr(evm);
      }
      await switchToMoonbase();

      // Step 2: Polkadot wallet
      setPhase('connecting-polkadot');
      let dot = polkadotAddr;
      if (!dot) {
        const accounts = await getPolkadotAccounts('Prizm Protocol');
        if (!accounts.length) {
          throw new Error(
            'No Polkadot wallet detected. Install Talisman or Polkadot.js and authorize access.',
          );
        }
        dot = accounts[0].address;
        setPolkadotAddr(dot);
      }

      // Step 3: People Chain query
      setPhase('querying-people-chain');
      const popResult = await queryPeopleChainPoP(dot, 'paseo');
      // Fallback to Tier 1 for demo if address has no People Chain record yet
      const tier = popResult.tier > 0 ? popResult.tier : 1;
      setDetectedTier(tier);

      // Step 4: Backend attestation signature
      setPhase('requesting-attestation');
      const attestation = await requestAttestation(evm, dot, tier);

      // Step 5: On-chain submission
      setPhase('submitting-on-chain');
      const tx = await submitPopAttestation({
        tier:            attestation.tier,
        polkadotAddress: attestation.polkadotAddress,
        nonce:           attestation.nonce,
        signature:       attestation.signature,
      });
      await tx.wait();
      setTxHash(tx.hash);

      // Done
      setPopTier(tier);
      setIsComplete(true);
      setPhase('complete');
      showToast(`PoP Tier ${tier} verified on Moonbase!`, 'success');
      setTimeout(() => router.push('/dashboard'), 3000);

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setPhase('error');
      showToast(msg.length > 80 ? msg.slice(0, 77) + '…' : msg, 'error');
    }
  }, [evmAddr, polkadotAddr, setPopTier, showToast, router]);

  const isRunning = PHASE_ORDER.slice(0, -1).includes(phase);
  const tierLabel = TIER_LABELS[detectedTier] ?? 'Unverified';
  const tierCap   = TIER_BORROW_CAPS[detectedTier] ?? '$0';
  const tierMult  = TIER_MULTIPLIERS[detectedTier] ?? '0×';
  const tierDesc  = TIER_DESCRIPTIONS[detectedTier] ?? '';

  return (
    <main className="relative min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {isComplete ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 text-center relative"
            >
              <div className="absolute inset-0 pointer-events-none">
                {['confetti-1','confetti-2','confetti-3','confetti-4',
                  'confetti-5','confetti-6','confetti-7','confetti-8'].map((c) => (
                  <div key={c} className={`confetti-piece ${c} absolute w-2 h-4 bg-white/70 rounded-full`} />
                ))}
              </div>

              <div className="w-24 h-24 rounded-full border border-white/20 bg-white/10 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>

              <div>
                <h1 className="text-4xl font-bold text-white mb-3">Verification Complete</h1>
                <p className="text-white/60 text-lg">
                  Your on-chain PoP credential is active. Borrow limits unlocked.
                </p>
              </div>

              <div className="glass-deep p-8 rounded-3xl space-y-5 max-w-sm mx-auto text-left">
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest">PoP Tier</p>
                  <p className="text-white font-bold text-xl mt-1">{tierLabel}</p>
                  <p className="text-white/50 text-sm mt-0.5">{tierDesc}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-widest">Borrow Cap</p>
                    <motion.p
                      className="text-white font-bold text-lg mt-1"
                      animate={{ scale: [1, 1.04, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    >
                      {tierCap}
                    </motion.p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-widest">Multiplier</p>
                    <p className="text-white font-bold text-lg mt-1">{tierMult}</p>
                  </div>
                </div>
                {txHash && (
                  <a
                    href={getTxExplorerUrl(txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
                  >
                    View on Moonscan <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="flow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-3">
                  Proof of Personhood Verification
                </h1>
                <p className="text-white/60 text-lg max-w-lg mx-auto">
                  Verify once using Polkadot's native Ring VRF–based PoP system to unlock
                  higher borrow limits — no biometrics, no KYC.
                </p>
              </div>

              {/* Tier info */}
              <div className="glass p-6 rounded-3xl space-y-4">
                <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" />
                  Polkadot People Chain PoP Tiers
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {([1, 2, 3] as const).map((t) => (
                    <div key={t} className="glass-dark p-3 rounded-xl text-center">
                      <p className="text-white text-xs font-semibold">{TIER_LABELS[t]}</p>
                      <p className="text-white/50 text-xs mt-0.5">{TIER_BORROW_CAPS[t]}</p>
                      <p className="text-white/40 text-xs">{TIER_MULTIPLIERS[t]}</p>
                    </div>
                  ))}
                </div>
                <p className="text-white/40 text-xs">
                  Powered by Ring VRF anonymous uniqueness proofs on the Polkadot People Chain (DIM1 live, DIM2 rolling out).
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                <StepRow
                  icon={Wallet}
                  label="Connect MetaMask → Moonbase Alpha"
                  sublabel={evmAddr ? evmAddr.slice(0, 20) + '…' : 'Required for on-chain submission'}
                  status={evmAddr ? 'done' : stepStatus('connecting-metamask')}
                />
                <StepRow
                  icon={Globe}
                  label="Connect Polkadot wallet"
                  sublabel={polkadotAddr ? polkadotAddr.slice(0, 20) + '…' : 'Talisman / Polkadot.js / SubWallet'}
                  status={polkadotAddr ? 'done' : stepStatus('connecting-polkadot')}
                />
                <StepRow
                  icon={ShieldCheck}
                  label="Query People Chain for PoP tier"
                  sublabel={detectedTier > 0 ? `Detected: ${TIER_LABELS[detectedTier]}` : 'Paseo People Chain (DIM1/DIM2)'}
                  status={detectedTier > 0 ? 'done' : stepStatus('querying-people-chain')}
                />
                <StepRow
                  icon={ShieldCheck}
                  label="Request signed attestation"
                  sublabel="Backend signs People Chain proof for Moonbeam"
                  status={stepStatus('requesting-attestation')}
                />
                <StepRow
                  icon={Sparkles}
                  label="Submit credential on Moonbase Alpha"
                  sublabel={txHash ? txHash.slice(0, 20) + '…' : 'Writes tier to PoPVerifier.sol'}
                  status={txHash ? 'done' : stepStatus('submitting-on-chain')}
                />
              </div>

              {phase === 'querying-people-chain' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass p-4 rounded-2xl flex items-start gap-3"
                >
                  <AlertTriangle className="w-4 h-4 text-white/50 flex-shrink-0 mt-0.5" />
                  <p className="text-white/50 text-xs">
                    If your Polkadot address has no People Chain record, Tier 1 is granted
                    automatically for this demo. On mainnet a valid Ring VRF proof is required.
                  </p>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-dark p-4 rounded-2xl flex items-start gap-3"
                >
                  <XCircle className="w-5 h-5 text-white/50 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">Verification failed</p>
                    <p className="text-white/50 text-xs mt-1">{error}</p>
                  </div>
                </motion.div>
              )}

              <button
                type="button"
                onClick={runVerification}
                disabled={isRunning}
                className="glass-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying…
                  </span>
                ) : phase === 'error' ? 'Retry Verification' : 'Start PoP Verification'}
              </button>

              <p className="text-center text-xs text-white/30">
                Polkadot People Chain · Ring VRF · No biometrics · No KYC
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Footer />
    </main>
  );
}
