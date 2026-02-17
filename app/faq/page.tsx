'use client';

import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQS = [
  {
    question: 'What is Proof of Personhood (PoP)?',
    answer: 'PoP verifies a unique human without exposing personal data. It prevents sybil attacks and boosts borrow limits for verified users.',
  },
  {
    question: 'How does PoP affect my borrow limit?',
    answer: 'Verified users receive a borrow multiplier based on PoP strength, increasing safe LTV and protocol access.',
  },
  {
    question: 'What assets can I supply as collateral?',
    answer: 'Prizm supports tokenized real estate, invoices, commodities, and other real-world assets vetted by custodial partners.',
  },
  {
    question: 'Is Prizm live on mainnet?',
    answer: 'This is a demo experience. Mainnet deployment is planned for 2026 with PoP-weighted risk modules.',
  },
  {
    question: 'How are interest rates determined?',
    answer: 'Rates adjust based on utilization, risk parameters, and PoP-weighted demand across each vault.',
  },
  {
    question: 'What happens if my health factor drops?',
    answer: 'If health factors approach liquidation thresholds, you receive alerts and can repay or add collateral to stay safe.',
  },
];

export default function FAQPage() {
  return (
    <main className="relative min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-3">Frequently Asked Questions</h1>
            <p className="text-white/60">
              Everything you need to know about PoP-weighted RWA lending on Prizm.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {FAQS.map((item) => (
              <AccordionItem key={item.question} value={item.question} className="glass px-6">
                <AccordionTrigger className="text-white">{item.question}</AccordionTrigger>
                <AccordionContent className="text-white/60">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
