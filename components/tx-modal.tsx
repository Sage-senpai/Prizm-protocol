'use client';

/**
 * TxModal – Multi-step on-chain transaction progress modal.
 * Preserves all existing glass-morphism / Framer Motion aesthetics.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, ExternalLink, X } from 'lucide-react';
import { getTxExplorerUrl } from '@/lib/blockchain/contracts';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TxStepStatus = 'pending' | 'loading' | 'success' | 'error';

export interface TxStep {
  id: string;
  label: string;
  status: TxStepStatus;
  txHash?: string;
  errorMsg?: string;
}

interface TxModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  steps: TxStep[];
  /** Called when user clicks the primary action after all steps complete */
  onComplete?: () => void;
  completionMessage?: string;
}

// ─── Step icon ────────────────────────────────────────────────────────────────

function StepIcon({ status }: { status: TxStepStatus }) {
  if (status === 'loading')
    return <Loader2 className="w-5 h-5 text-white animate-spin" />;
  if (status === 'success')
    return <CheckCircle2 className="w-5 h-5 text-white" />;
  if (status === 'error')
    return <XCircle className="w-5 h-5 text-white/50" />;
  return (
    <div className="w-5 h-5 rounded-full border border-white/30 bg-white/5" />
  );
}

// ─── Single step row ──────────────────────────────────────────────────────────

function StepRow({ step }: { step: TxStep }) {
  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
        step.status === 'loading'
          ? 'glass'
          : step.status === 'success'
          ? 'glass border-white/20'
          : step.status === 'error'
          ? 'glass border-white/10 opacity-60'
          : 'glass-dark'
      }`}
    >
      <StepIcon status={step.status} />

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${
            step.status === 'pending' ? 'text-white/50' : 'text-white'
          }`}
        >
          {step.label}
        </p>

        {step.status === 'error' && step.errorMsg && (
          <p className="text-xs text-white/40 mt-0.5 truncate">{step.errorMsg}</p>
        )}

        {step.txHash && (
          <a
            href={getTxExplorerUrl(step.txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors mt-0.5"
          >
            {step.txHash.slice(0, 10)}…{step.txHash.slice(-6)}
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Status badge */}
      <span
        className={`text-xs px-2 py-0.5 rounded-full ${
          step.status === 'success'
            ? 'bg-white/15 text-white'
            : step.status === 'loading'
            ? 'bg-white/10 text-white/70'
            : step.status === 'error'
            ? 'bg-white/5 text-white/40'
            : 'bg-white/5 text-white/30'
        }`}
      >
        {step.status === 'loading'
          ? 'Pending…'
          : step.status === 'success'
          ? 'Confirmed'
          : step.status === 'error'
          ? 'Failed'
          : 'Waiting'}
      </span>
    </motion.div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function TxModal({
  isOpen,
  onClose,
  title,
  steps,
  onComplete,
  completionMessage = 'Transaction complete.',
}: TxModalProps) {
  const allDone    = steps.every((s) => s.status === 'success');
  const hasError   = steps.some((s) => s.status === 'error');
  const inProgress = steps.some((s) => s.status === 'loading');

  const canClose = allDone || hasError;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={canClose ? onClose : undefined}
          />

          {/* Panel */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-deep w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-6"
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{title}</h2>
                {canClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-8 h-8 rounded-full glass flex items-center justify-center text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {steps.map((step) => (
                  <StepRow key={step.id} step={step} />
                ))}
              </div>

              {/* Footer message */}
              {allDone && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass p-4 rounded-xl text-center"
                >
                  <CheckCircle2 className="w-6 h-6 text-white mx-auto mb-2" />
                  <p className="text-white text-sm font-medium">{completionMessage}</p>
                </motion.div>
              )}

              {hasError && !inProgress && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-dark p-4 rounded-xl text-center"
                >
                  <p className="text-white/60 text-sm">
                    Transaction failed. Check MetaMask for details.
                  </p>
                </motion.div>
              )}

              {/* Action button */}
              {allDone && onComplete && (
                <button
                  type="button"
                  onClick={() => { onComplete(); onClose(); }}
                  className="glass-button w-full"
                >
                  Continue
                </button>
              )}

              {!canClose && (
                <p className="text-center text-xs text-white/30">
                  Do not close this window while transactions are pending.
                </p>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Hook for managing steps ──────────────────────────────────────────────────

export function useTxSteps(initialSteps: Omit<TxStep, 'status'>[]) {
  const { useState, useCallback } = require('react') as typeof import('react');

  const [steps, setSteps] = useState<TxStep[]>(
    initialSteps.map((s) => ({ ...s, status: 'pending' as TxStepStatus })),
  );

  const setStepStatus = useCallback(
    (id: string, status: TxStepStatus, extra?: { txHash?: string; errorMsg?: string }) => {
      setSteps((prev: TxStep[]) =>
        prev.map((s) => (s.id === id ? { ...s, status, ...extra } : s)),
      );
    },
    [],
  );

  const resetSteps = useCallback(() => {
    setSteps(initialSteps.map((s) => ({ ...s, status: 'pending' as TxStepStatus })));
  }, [initialSteps]);

  return { steps, setStepStatus, resetSteps };
}
