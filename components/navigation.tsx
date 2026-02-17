'use client';

import { Menu, Wallet, Sun, Moon, ShieldCheck, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useWallet } from '@/context/wallet-context';
import { useToast } from '@/context/toast-context';
import { useTheme } from 'next-themes';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected, address, isVerified, setShowModal, disconnectWallet } = useWallet();
  const { showToast } = useToast();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Markets', href: '/markets' },
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: '/faq' },
  ];

  const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Wallet';

  return (
    <nav className="fixed top-0 w-full z-50 pt-4 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="glass px-6 py-4 flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-white/20">
              <span className="text-black font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl text-white hidden sm:inline">Prizm</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-white/70 hover:text-white transition-colors font-medium text-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="glass px-3 py-2 rounded-full text-white hover:bg-white/20 transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="glass px-3 py-2 rounded-full text-white flex items-center gap-2 hover:bg-white/20 transition-all">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-white text-black text-xs">
                        {address ? address.slice(2, 3).toUpperCase() : 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{truncatedAddress}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {!isVerified && (
                    <DropdownMenuItem asChild>
                      <Link href="/verify" className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        Verify PoP
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      disconnectWallet();
                      showToast('Wallet disconnected.', 'info');
                    }}
                    className="flex items-center gap-2 text-red-400 focus:text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="glass-button text-sm font-semibold px-6 py-2"
              >
                Connect Wallet
              </button>
            )}
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden text-white p-2" aria-label="Open menu">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="glass-deep border-white/10">
              <div className="flex flex-col gap-6 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-white/80 hover:text-white transition-colors text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                    className="glass px-3 py-2 rounded-full text-white hover:bg-white/20 transition-all"
                    aria-label="Toggle theme"
                  >
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                  <span className="text-white/70 text-sm">Theme</span>
                </div>

                {isConnected ? (
                  <div className="space-y-3">
                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className="glass px-4 py-3 rounded-xl text-white flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link href="/profile" onClick={() => setIsOpen(false)} className="glass px-4 py-3 rounded-xl text-white flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    {!isVerified && (
                      <Link href="/verify" onClick={() => setIsOpen(false)} className="glass px-4 py-3 rounded-xl text-white flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        Verify PoP
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        disconnectWallet();
                        setIsOpen(false);
                        showToast('Wallet disconnected.', 'info');
                      }}
                      className="glass px-4 py-3 rounded-xl text-red-300 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(true);
                      setIsOpen(false);
                    }}
                    className="glass-button w-full text-center py-3 font-semibold"
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </motion.div>
      </div>
    </nav>
  );
}
