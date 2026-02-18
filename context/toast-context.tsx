'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-white/80" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-white/80" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-white/70" />;
      default:
        return <Info className="w-5 h-5 text-white/70" />;
    }
  };

  const getBackground = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-white/10 border-white/15';
      case 'error':
        return 'bg-white/10 border-white/15';
      case 'warning':
        return 'bg-white/10 border-white/10';
      default:
        return 'bg-white/10 border-white/10';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col gap-3 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ duration: 0.3 }}
            className={`glass p-4 rounded-lg border ${getBackground(toast.type)} flex items-start gap-3`}
          >
            {getIcon(toast.type)}
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{toast.message}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onRemove(toast.id)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
