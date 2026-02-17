'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

export default function NotFound() {
  return (
    <main className="relative min-h-screen">
      <Navigation />
      <section className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-24 h-24 mx-auto rounded-3xl glass flex items-center justify-center"
          >
            <span className="text-4xl font-bold text-white">404</span>
          </motion.div>
          <h1 className="text-4xl font-bold text-white">Vault not found</h1>
          <p className="text-white/60">
            The page you are looking for slipped through the protocol. Let us take you back home.
          </p>
          <Link href="/" className="glass-button px-6 py-3 inline-flex items-center gap-2">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}
