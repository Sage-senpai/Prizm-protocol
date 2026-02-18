'use client';

import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { CheckCircle2, Clock, User, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { useWallet } from '@/context/wallet-context';
import { useToast } from '@/context/toast-context';

export default function VerificationPage() {
  useProtectedRoute({ requireVerified: false });
  const router = useRouter();
  const { isVerified, verifyPop } = useWallet();
  const { showToast } = useToast();

  const [step, setStep] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    {
      title: 'Why PoP Matters',
      description: 'Proof of Personhood prevents sybil borrowing and unlocks higher limits.',
      icon: User,
      details: ['Explain risk reduction', 'Ensure unique borrower caps', 'Improve protocol fairness'],
    },
    {
      title: 'Generate Proof',
      description: 'Simulate biometric and device proof generation.',
      icon: ShieldCheck,
      details: ['Mock biometric scan', 'Device attestation', 'Signature creation'],
    },
    {
      title: 'Finalize PoP',
      description: 'Mint your PoP credential and unlock borrow multiplier.',
      icon: Sparkles,
      details: ['Sign PoP minting', 'Record on-chain proof', 'Unlock borrow power'],
    },
  ];

  useEffect(() => {
    if (isVerified && !isComplete) {
      showToast('PoP already verified. Redirecting to dashboard.', 'info');
      router.push('/dashboard');
    }
  }, [isVerified, isComplete, router, showToast]);

  const handleStepComplete = () => {
    if (step < steps.length - 1) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setStep(step + 1);
      }, 1800);
    } else {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setIsComplete(true);
        verifyPop();
        showToast('PoP verified. Borrow limits unlocked.', 'success');
        setTimeout(() => router.push('/dashboard'), 2000);
      }, 2200);
    }
  };

  const StepIcon = steps[step]?.icon || CheckCircle2;
  const progressWidths = ['w-1/3', 'w-2/3', 'w-full'];
  const progressValue = Math.round(((step + 1) / steps.length) * 100);

  return (
    <main className="relative min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {!isComplete ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-3">
                Proof of Personhood Verification
              </h1>
              <p className="text-white/60 text-lg">
                Verify once to unlock higher borrow caps and safer protocol risk levels.
              </p>
            </div>

            <div className="glass p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-3 text-sm text-white/60">
                <span>Verification Progress</span>
                <span>{progressValue}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full bg-white/50 ${progressWidths[step]}`} />
              </div>
            </div>

            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-deep p-8 sm:p-12 rounded-3xl"
            >
              <div className="flex items-start gap-6 mb-8">
                <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center flex-shrink-0">
                  <StepIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{steps[step].title}</h2>
                  <p className="text-white/60">{steps[step].description}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {steps[step].details.map((detail) => (
                  <div key={detail} className="flex items-center gap-3 p-4 glass rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-white/70 flex-shrink-0" />
                    <span className="text-white">{detail}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="glass px-8 py-3 rounded-xl text-white hover:bg-white/20 transition-all"
                  >
                    Previous
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleStepComplete}
                  disabled={isVerifying}
                  className="glass-button px-8 py-3 rounded-xl text-white disabled:opacity-50 flex-1"
                >
                  {isVerifying ? (
                    <span className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4 animate-spin" />
                      Verifying...
                    </span>
                  ) : step === steps.length - 1 ? (
                    'Complete Verification'
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 text-center relative"
          >
            <div className="absolute inset-0 pointer-events-none">
              {['confetti-1', 'confetti-2', 'confetti-3', 'confetti-4', 'confetti-5', 'confetti-6', 'confetti-7', 'confetti-8'].map((confetti) => (
                <div
                  key={confetti}
                  className={`confetti-piece ${confetti} absolute w-2 h-4 bg-white/70 rounded-full`}
                />
              ))}
            </div>

            <div className="w-24 h-24 rounded-full border border-white/20 bg-white/10 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-white mb-3">Verification Complete</h1>
              <p className="text-white/60 text-lg">
                Your PoP credential is active. Borrow limits are now upgraded.
              </p>
            </div>

            <div className="glass-deep p-8 rounded-3xl space-y-4 max-w-md mx-auto">
              <div>
                <label className="text-white/60 text-sm font-medium">PoP Credential ID</label>
                <p className="mt-2 font-mono text-white break-all">0x7f3e...a2B1</p>
              </div>
              <div>
                <label className="text-white/60 text-sm font-medium">Borrow Limit Unlocked</label>
                <motion.p
                  className="mt-2 text-2xl font-bold text-white"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                >
                  $150,000
                </motion.p>
              </div>
              <div>
                <label className="text-white/60 text-sm font-medium">Valid Until</label>
                <p className="mt-2 text-white">February 17, 2027</p>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      <Footer />
    </main>
  );
}
