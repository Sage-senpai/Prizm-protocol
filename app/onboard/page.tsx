'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Wallet, User, Shield, Zap } from 'lucide-react';
import { useWallet } from '@/context/wallet-context';
import { useToast } from '@/context/toast-context';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

const ONBOARDING_STEPS = [
  { id: 1, title: 'Connect Wallet', description: 'Link your Web3 wallet to Prizm' },
  { id: 2, title: 'Create Profile', description: 'Set up your Prizm identity' },
  { id: 3, title: 'Verify Account', description: 'Complete verification for full access' },
  { id: 4, title: 'Start Trading', description: 'Begin lending and earning' },
];

export default function OnboardPage() {
  const router = useRouter();
  const { isConnected, setShowModal, address } = useWallet();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    riskTolerance: 'medium',
  });
  const [isLoading, setIsLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const handleWalletConnect = () => {
    if (!isConnected) {
      setShowModal(true);
    } else {
      setCurrentStep(2);
      showToast('Wallet connected! Proceeding to profile creation...', 'success');
    }
  };

  const handleProfileCreate = async () => {
    if (!profileData.username.trim()) {
      showToast('Please enter a username', 'warning');
      return;
    }
    if (!profileData.email.includes('@')) {
      showToast('Please enter a valid email', 'warning');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(3);
      showToast('Profile created successfully!', 'success');
    }, 1500);
  };

  const handleVerification = () => {
    // Route to the real PoP verification page (Polkadot Ring VRF-based)
    router.push('/verify');
  };

  const handleStartTrading = () => {
    showToast('Welcome to Prizm! Redirecting to dashboard...', 'success');
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <main className="relative min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
              Welcome to Prizm
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Complete your onboarding in 4 simple steps and start earning with real-world assets
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex justify-between items-center gap-2 sm:gap-4">
              {ONBOARDING_STEPS.map((step, idx) => (
                <div key={step.id} className="flex-1 flex items-center gap-2 sm:gap-3">
                  <motion.div
                    className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                      currentStep >= step.id
                        ? 'bg-white/15 text-white border border-white/30'
                        : 'bg-white/5 text-white/50 border border-white/15'
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </motion.div>
                  {idx < ONBOARDING_STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                        currentStep > step.id
                          ? 'bg-white/40'
                          : 'bg-white/10'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step Descriptions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              {ONBOARDING_STEPS.map((step) => (
                <motion.div
                  key={step.id}
                  className={`text-center transition-all duration-300 ${
                    currentStep === step.id ? 'opacity-100' : 'opacity-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="text-xs sm:text-sm font-semibold text-white">{step.title}</p>
                  <p className="text-xs text-white/50 mt-1 hidden sm:block">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Step Content */}
          <motion.div variants={itemVariants} className="glass rounded-3xl p-8 sm:p-12">
            {/* Step 1: Connect Wallet */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="flex justify-center">
                  <motion.div
                    className="w-20 h-20 rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Wallet className="w-10 h-10 text-white" />
                  </motion.div>
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Connect Your Wallet</h2>
                  <p className="text-white/60">
                    Connect your Web3 wallet to link your Prizm account and start managing your assets
                  </p>
                </div>

                <motion.button
                  onClick={handleWalletConnect}
                  className="w-full glass-button py-4 rounded-xl text-lg font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isConnected ? (
                    <>
                      <Check className="inline-block mr-2 w-5 h-5" />
                      Wallet Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                    </>
                  ) : (
                    <>
                      Connect Wallet
                      <ArrowRight className="inline-block ml-2 w-5 h-5" />
                    </>
                  )}
                </motion.button>

                {isConnected && (
                  <motion.button
                    onClick={() => {
                      setCurrentStep(2);
                      showToast('Proceeding to profile creation...', 'success');
                    }}
                    className="w-full glass px-6 py-3 rounded-xl text-white font-semibold hover:bg-white/20 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue to Next Step
                    <ArrowRight className="inline-block ml-2 w-4 h-4" />
                  </motion.button>
                )}
              </div>
            )}

            {/* Step 2: Create Profile */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="flex justify-center">
                  <motion.div
                    className="w-20 h-20 rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center"
                    animate={{ rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <User className="w-10 h-10 text-white" />
                  </motion.div>
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Create Your Profile</h2>
                  <p className="text-white/60">
                    Set up your Prizm profile and customize your experience
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Username</label>
                    <input
                      type="text"
                      placeholder="Choose your username"
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                      className="glass-input w-full px-4 py-3 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="glass-input w-full px-4 py-3 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Risk Tolerance</label>
                    <select
                      value={profileData.riskTolerance}
                      onChange={(e) => setProfileData({ ...profileData, riskTolerance: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-white bg-white/5 backdrop-blur-md border border-white/15 hover:bg-white/10 transition-colors"
                    >
                      <option value="low" className="bg-slate-900">Low - Conservative</option>
                      <option value="medium" className="bg-slate-900">Medium - Balanced</option>
                      <option value="high" className="bg-slate-900">High - Aggressive</option>
                    </select>
                  </div>
                </div>

                <motion.button
                  onClick={handleProfileCreate}
                  disabled={isLoading}
                  className="w-full glass-button py-4 rounded-xl text-lg font-semibold disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⚙️</span>
                      Creating Profile...
                    </>
                  ) : (
                    <>
                      Create Profile
                      <ArrowRight className="inline-block ml-2 w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </div>
            )}

            {/* Step 3: Verify Account */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="flex justify-center">
                  <motion.div
                    className="w-20 h-20 rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Shield className="w-10 h-10 text-white" />
                  </motion.div>
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Verify Your Account</h2>
                  <p className="text-white/60">
                    Complete Proof of Personhood via your Polkadot identity to unlock higher borrow limits
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white/70" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Profile Created</p>
                      <p className="text-white/50 text-sm">Your account is ready</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-white font-semibold">2</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Connect Polkadot Wallet</p>
                      <p className="text-white/50 text-sm">Link your Substrate identity</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-white font-semibold">3</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">PoP Attestation</p>
                      <p className="text-white/50 text-sm">Submit on-chain Proof of Personhood</p>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={handleVerification}
                  disabled={isLoading}
                  className="w-full glass-button py-4 rounded-xl text-lg font-semibold disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <>
                    Go to PoP Verification
                    <ArrowRight className="inline-block ml-2 w-5 h-5" />
                  </>
                </motion.button>
              </div>
            )}

            {/* Step 4: Start Trading */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="flex justify-center">
                  <motion.div
                    className="w-20 h-20 rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className="w-10 h-10 text-white" />
                  </motion.div>
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">You're All Set!</h2>
                  <p className="text-white/60">
                    Your account is verified and ready. Start exploring Prizm and earning with RWA assets.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { icon: '📊', title: 'Dashboard', desc: 'View your portfolio' },
                    { icon: '💰', title: 'Markets', desc: 'Explore vaults' },
                    { icon: '👤', title: 'Profile', desc: 'Manage settings' },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      className="glass rounded-xl p-4 text-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <p className="text-3xl mb-2">{item.icon}</p>
                      <p className="text-white font-semibold">{item.title}</p>
                      <p className="text-white/50 text-sm mt-1">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  onClick={handleStartTrading}
                  className="w-full glass-button py-4 rounded-xl text-lg font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Go to Dashboard
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
