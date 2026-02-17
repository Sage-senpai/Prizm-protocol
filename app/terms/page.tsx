'use client';

import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { motion } from 'framer-motion';

const TERMS_TEXT = `
These Terms of Service are a mock placeholder for the Prizm protocol demo. By accessing or using the platform, you agree
to the terms below. All features shown are simulated and do not involve real funds. Prizm does not provide financial,
legal, or investment advice. You are responsible for understanding risks associated with digital assets and RWA lending.

You agree not to misuse the platform, attempt to bypass Proof of Personhood requirements, or engage in fraudulent
activities. Prizm reserves the right to update these terms at any time. Continued use of the demo constitutes acceptance
of the updated terms.

All content, analytics, and metrics are for demonstration only and do not reflect live markets. The protocol is subject
to regulatory requirements and may limit access based on jurisdiction.
`;

const PRIVACY_TEXT = `
This Privacy Policy is a mock placeholder. In the demo, Prizm does not collect or store personal data. In production,
Prizm would collect wallet addresses, usage telemetry, and optional contact information for notifications. Proof of
Personhood data would be handled through privacy-preserving verification partners and is not stored in plain form.

We implement industry-standard safeguards to protect data and limit access. You may request deletion of any personal data
stored by the protocol by contacting the Prizm team. This demo does not transmit real information.
`;

export default function TermsPage() {
  return (
    <main className="relative min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h1 className="text-4xl font-bold text-white">Terms and Privacy</h1>
          <p className="text-white/60">
            Review the mock Terms of Service and Privacy Policy for the Prizm demo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass p-6 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">Terms of Service</h2>
            <div className="max-h-96 overflow-y-auto text-white/70 text-sm leading-relaxed space-y-4 pr-2">
              {TERMS_TEXT.split('\n\n').map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="glass p-6 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">Privacy Policy</h2>
            <div className="max-h-96 overflow-y-auto text-white/70 text-sm leading-relaxed space-y-4 pr-2">
              {PRIVACY_TEXT.split('\n\n').map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
