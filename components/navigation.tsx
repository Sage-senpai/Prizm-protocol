'use client';

import { Menu, Sun, Moon, ShieldCheck, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/context/wallet-context';
import { useToast } from '@/context/toast-context';
import { useTheme } from 'next-themes';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { isConnected, address, isVerified, setShowModal, disconnectWallet } = useWallet();
  const { showToast } = useToast();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // next-themes resolvedTheme is undefined on the server — only render
  // the theme-dependent icon after hydration to prevent mismatch.
  useEffect(() => { setMounted(true); }, []);

  const navItems = [
    { label: 'Overview', href: '/#overview' },
    { label: 'Protocol', href: '/#protocol' },
    { label: 'Markets', href: '/markets' },
    { label: 'FAQ', href: '/faq' },
  ];

  const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Wallet';

  return (
    <nav className="fixed top-0 w-full z-50 px-4 pt-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border border-white/15 bg-white/10 flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-semibold text-lg text-white hidden sm:inline">Prizm</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-white/70 hover:text-white transition-colors text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white hover:bg-white/10 transition-all"
              aria-label="Toggle theme"
            >
              {mounted && isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white flex items-center gap-2 hover:bg-white/10 transition-all">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-white/90 text-black text-xs">
                        {address ? address.slice(2, 3).toUpperCase() : 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{truncatedAddress}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem onSelect={() => router.push('/dashboard')} className="flex items-center gap-2 cursor-pointer">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => router.push('/profile')} className="flex items-center gap-2 cursor-pointer">
                    <User className="w-4 h-4" />
                    Profile
                  </DropdownMenuItem>
                  {!isVerified && (
                    <DropdownMenuItem onSelect={() => router.push('/verify')} className="flex items-center gap-2 cursor-pointer">
                      <ShieldCheck className="w-4 h-4" />
                      Verify PoP
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => {
                      disconnectWallet();
                      showToast('Wallet disconnected.', 'info');
                    }}
                    className="flex items-center gap-2 text-white/70 focus:text-white cursor-pointer"
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
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white hover:bg-white/10 transition-all"
                    aria-label="Toggle theme"
                  >
                    {mounted && isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
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
                      className="glass px-4 py-3 rounded-xl text-white/70 flex items-center gap-2"
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
        </div>
      </div>
    </nav>
  );
}
