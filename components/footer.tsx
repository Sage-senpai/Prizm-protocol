'use client';

import { motion } from 'framer-motion';
import { Mail, Github, Twitter, Linkedin, ArrowRight, ArrowUp } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/context/toast-context';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { showToast } = useToast();

  const newsletterSchema = z.object({
    email: z.string().email('Enter a valid email address'),
  });

  const form = useForm<z.infer<typeof newsletterSchema>>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: '' },
  });

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    product: [
      { label: 'Markets', href: '/markets' },
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Verify PoP', href: '/verify' },
      { label: 'Profile', href: '/profile' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '#contact' },
      { label: 'Careers', href: '#careers' },
    ],
    legal: [
      { label: 'Terms', href: '/terms' },
      { label: 'Privacy', href: '/terms' },
      { label: 'Security', href: '#security' },
      { label: 'Risk Disclosure', href: '/terms' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: '#twitter', label: 'Twitter' },
    { icon: Github, href: '#github', label: 'GitHub' },
    { icon: Linkedin, href: '#linkedin', label: 'LinkedIn' },
    { icon: Mail, href: '#email', label: 'Email' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <footer className="relative py-20 px-4 border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="glass p-8 md:p-12 mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Stay in the Loop
          </h3>
          <p className="text-white/60 mb-8 max-w-lg mx-auto">
            Receive product updates, vault summaries, and protocol changelogs.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => {
                showToast(`Subscribed ${values.email} to updates.`, 'success');
                form.reset();
              })}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="you@email.com"
                        className="glass-input w-full px-6 py-3 text-white placeholder-white/50"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-white/60 mt-2" />
                  </FormItem>
                )}
              />
              <button type="submit" className="glass-button">
                Subscribe
                <ArrowRight className="inline-block ml-2 w-4 h-4" />
              </button>
            </form>
          </Form>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-4 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl border border-white/15 bg-white/10 flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="font-semibold text-xl text-white">Prizm</span>
            </div>
            <p className="text-white/60 text-sm">
              Human-first RWA lending with Proof of Personhood-weighted borrowing power.
            </p>
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 glass rounded-lg flex items-center justify-center text-white hover:border-white/40 transition-all"
                    whileHover={{ scale: 1.1 }}
                    title={social.label}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-white mb-6">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-white mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-white mb-6">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-white/50 text-sm">
            (c) {currentYear} Prizm Protocol. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/terms" className="text-white/50 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/50 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <button
              type="button"
              onClick={() => showToast('Cookie settings are not yet configurable in the demo.', 'info')}
              className="text-white/50 hover:text-white transition-colors"
            >
              Cookie Settings
            </button>
          </div>
          <motion.button
            onClick={handleScrollToTop}
            className="glass px-4 py-2 rounded-full flex items-center gap-2 text-white hover:bg-white/10 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Top
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
}
