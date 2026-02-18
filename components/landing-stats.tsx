'use client';

import { motion } from 'framer-motion';
import { StatsCounter } from './stats-counter';

export function LandingStats() {
  return (
    <section id="metrics" className="py-16 px-4 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="glass p-10 md:p-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatsCounter end={1900} label="Total Supplied" suffix="M" />
            <StatsCounter end={32000} label="Verified Humans" suffix="+" />
            <StatsCounter end={6} label="Active Vaults" />
            <StatsCounter end={9} label="Avg Supply APY" suffix="%" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
