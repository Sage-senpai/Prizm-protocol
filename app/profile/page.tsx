'use client';

import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Moon, Sun, LogOut, ShieldCheck, Activity, Wallet } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { useWallet } from '@/context/wallet-context';
import { useToast } from '@/context/toast-context';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const preferencesSchema = z.object({
  riskProfile: z.enum(['conservative', 'balanced', 'aggressive']),
  newsletter: z.boolean(),
});

export default function ProfilePage() {
  useProtectedRoute();
  const { resolvedTheme, setTheme } = useTheme();
  const { address, isVerified, borrowMultiplier, disconnectWallet } = useWallet();
  const { showToast } = useToast();

  const form = useForm<z.infer<typeof preferencesSchema>>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      riskProfile: 'balanced',
      newsletter: true,
    },
  });

  const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Wallet';
  const isDark = resolvedTheme === 'dark';

  return (
    <main className="relative min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Profile</h1>
              <p className="text-white/60">Manage your PoP status, preferences, and wallet settings.</p>
            </div>
            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="glass px-6 py-3 rounded-full flex items-center gap-2 text-white hover:bg-white/20 transition-all"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="hidden sm:inline">Toggle Theme</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="w-5 h-5 text-white" />
                <h2 className="text-lg font-bold text-white">Wallet</h2>
              </div>
              <p className="text-white/60 text-sm mb-2">Connected address</p>
              <p className="text-white font-mono">{truncatedAddress}</p>
            </div>
            <div className="glass p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-5 h-5 text-white" />
                <h2 className="text-lg font-bold text-white">PoP Status</h2>
              </div>
              <p className="text-white/60 text-sm mb-2">Verification</p>
              <p className={`font-semibold ${isVerified ? 'text-white' : 'text-white/60'}`}>
                {isVerified ? 'Verified' : 'Pending'}
              </p>
            </div>
            <div className="glass p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-5 h-5 text-white" />
                <h2 className="text-lg font-bold text-white">Borrow Multiplier</h2>
              </div>
              <p className="text-white/60 text-sm mb-2">PoP-weighted boost</p>
              <p className="text-white font-semibold">{borrowMultiplier.toFixed(1)}x</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div className="lg:col-span-2 glass p-8 rounded-3xl">
              <h2 className="text-2xl font-bold text-white mb-6">Preferences</h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(() => {
                    showToast('Preferences saved.', 'success');
                  })}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="riskProfile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70">Risk Profile</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="glass text-white">
                              <SelectValue placeholder="Select risk profile" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="conservative">Conservative</SelectItem>
                              <SelectItem value="balanced">Balanced</SelectItem>
                              <SelectItem value="aggressive">Aggressive</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-sm text-white/60" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="newsletter"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between glass-dark px-4 py-3 rounded-xl">
                        <div>
                          <FormLabel className="text-white">Market Updates</FormLabel>
                          <p className="text-white/60 text-sm">Receive weekly vault insights.</p>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <button type="submit" className="glass-button px-6 py-3">
                    Save Preferences
                  </button>
                </form>
              </Form>
            </motion.div>

            <motion.div className="glass p-8 rounded-3xl space-y-6">
              <h3 className="text-lg font-bold text-white">Account Actions</h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => showToast('Security settings are locked in demo mode.', 'info')}
                  className="w-full glass px-6 py-3 rounded-xl text-white hover:bg-white/20 transition-all flex items-center justify-between"
                >
                  Security Settings
                  <span className="text-white/50 text-sm">Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Wallet management is available in production.', 'info')}
                  className="w-full glass px-6 py-3 rounded-xl text-white hover:bg-white/20 transition-all flex items-center justify-between"
                >
                  Connected Wallets
                  <span className="text-white/50 text-sm">Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    disconnectWallet();
                    showToast('Wallet disconnected.', 'info');
                  }}
                  className="w-full glass-button px-6 py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Disconnect Wallet
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
