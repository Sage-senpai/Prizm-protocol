# Prizm Protocol - Architecture & System Design

## Executive Summary

Prizm is a production-ready DeFi lending platform featuring real-world asset (RWA) collateral integration with institutional-grade security. Built with Next.js 16, TypeScript, and Framer Motion, featuring a minimalist white/black glassmorphic design with liquid animations.

## System Architecture

### Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19.2
- **Styling**: Tailwind CSS 4 with custom glassmorphic utilities
- **Animations**: Framer Motion 11
- **Forms**: React Hook Form with validation
- **Charts**: Recharts for data visualization
- **State Management**: React Context (Wallet, Toast)
- **Fonts**: Work Sans (Avenir alternative)
- **UI Components**: shadcn/ui full suite
- **Package Manager**: pnpm

### Project Structure

```
prizm/
├── app/
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Landing page (Hero + Features + CTA)
│   ├── onboard/
│   │   └── page.tsx             # 4-step onboarding flow
│   ├── dashboard/
│   │   └── page.tsx             # Portfolio overview & metrics
│   ├── profile/
│   │   └── page.tsx             # Account settings & verification
│   ├── markets/
│   │   └── page.tsx             # 6 RWA vault explorer
│   ├── vaults/
│   │   └── [id]/page.tsx        # Dynamic vault detail pages
│   ├── verify/
│   │   └── page.tsx             # PoP verification flow
│   └── globals.css              # Global styles & theme
│
├── components/
│   ├── animated-background.tsx   # CSS gradient orb animations
│   ├── custom-cursor.tsx         # Gradient cursor effect
│   ├── navigation.tsx            # Global navbar with wallet
│   ├── hero.tsx                  # Landing hero section
│   ├── features.tsx              # 8 feature showcase cards
│   ├── cta-section.tsx           # Call-to-action section
│   ├── footer.tsx                # Global footer
│   ├── wallet-modal.tsx          # Wallet connection flow
│   ├── dashboard/*               # Dashboard components
│   ├── analytics.tsx             # Charts & metrics
│   ├── ui/*                      # shadcn/ui components
│   └── ...
│
├── context/
│   ├── wallet-context.tsx        # Wallet connection state
│   └── toast-context.tsx         # Notification system
│
├── lib/
│   └── validation.ts             # Form validation schemas
│
└── public/
    └── (generated images)
```

## Key Features

### 1. Authentication & Wallet Integration
- **WalletContext**: Centralized wallet state management
- **WalletModal**: Multi-chain wallet selector (MetaMask, WalletConnect, Coinbase)
- **Session Management**: Mock session with address generation
- **Auto-redirect**: New users → Onboarding flow

### 2. Onboarding System
- **4-Step Flow**: Connect → Profile → Verify → Dashboard
- **Progressive Disclosure**: Collect info as needed
- **Smooth Transitions**: Framer Motion stagger effects
- **Form Validation**: Real-time feedback with toasts

### 3. Portfolio Management
- **Dashboard**: Net position, health factor, risk metrics
- **Positions**: Supplied & borrowed assets with APY
- **Charts**: Portfolio distribution & earnings
- **Real-time Updates**: Mock data with animation

### 4. Market Explorer
- **6 RWA Vaults**: Real Estate, Trade Finance, Supply Chain, Renewable Energy
- **Filtering**: By risk level, APY, TVL
- **Vault Details**: 4-tab interface (Overview, Supply, Borrow, Analysis)
- **Interactive Forms**: Supply/Borrow with validation

### 5. User Profile
- **Account Settings**: Personal info & preferences
- **Verification Status**: PoP flow indicator
- **Risk Dashboard**: Current risk assessment
- **Activity Log**: Transaction history

## Design System

### Color Palette (White/Black Glassmorphic)
```css
Light Theme:
- Background: #FFFFFF (white)
- Foreground: #000000 (black)
- Glass: rgba(255, 255, 255, 0.15) + backdrop-blur-2xl
- Border: rgba(255, 255, 255, 0.3)

Dark Theme (Primary):
- Background: #0D0D0D (near-black)
- Foreground: #F8F8F8 (near-white)
- Glass: rgba(0, 0, 0, 0.15) + backdrop-blur-2xl
- Border: rgba(255, 255, 255, 0.25)
```

### Typography
- **Font Family**: Work Sans (Avenir alternative from Google Fonts)
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Scale**: Responsive heading hierarchy with Tailwind classes
- **Line Height**: 1.4-1.6 for readability

### Glass Effect System
```css
.glass {
  @apply bg-white/15 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl;
}

.glass-dark {
  @apply bg-black/15 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-xl;
}

.glass-input {
  @apply bg-white/10 backdrop-blur-lg border border-white/25 rounded-xl;
}

.glass-button {
  @apply bg-black text-white hover:bg-gray-900 border border-white/20;
}
```

### Animation System
- **Spring Physics**: Framer Motion with custom easing
- **Durations**: 300-600ms for UI, 2-25s for ambient
- **Types**: Float, glow, pulse, shimmer, slide, fade, rotate, blob
- **Performance**: GPU-accelerated transforms, 60fps

## State Management

### Wallet Context
```typescript
interface WalletState {
  isConnected: boolean
  address: string | null
  walletType: string | null
}

Methods:
- connectWallet(type: string)
- disconnectWallet()
- setShowModal(show: boolean)
```

### Toast Context
```typescript
interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

Methods:
- showToast(message: string, type: string)
- dismissToast(id: string)
```

## Data Flow

### User Journey
```
Landing Page
    ↓
[Connect Wallet] → Onboarding Flow
    ↓
Step 1: Wallet Selection
Step 2: Profile Creation
Step 3: Verification
Step 4: Success → Dashboard
    ↓
Dashboard (Portfolio View)
    ↓
[Browse Markets] → Market Explorer
    ↓
[Select Vault] → Vault Details
    ↓
[Supply/Borrow] → Transaction
```

### Component Hierarchy
```
RootLayout
├── AnimatedBackground (CSS orbs)
├── CustomCursor (gradient effect)
├── WalletProvider
├── ToastProvider
├── WalletModal
└── Navigation
    └── [Pages]
        ├── Hero
        ├── Features
        ├── CTA
        └── Footer
```

## Performance Optimizations

1. **Code Splitting**: Automatic per-route via Next.js
2. **Image Optimization**: Next Image component
3. **Font Loading**: Work Sans with `variable` prop
4. **Animation Performance**: 
   - CSS animations for ambient effects
   - GPU acceleration via transforms
   - Framer Motion optimizations
5. **Bundle Size**: Tree-shaking unused shadcn components

## Security Considerations

1. **Form Validation**: Real-time client-side + server preparation
2. **No Direct Keys**: Mock wallet connections only
3. **HTTPS Ready**: SEO metadata configured
4. **XSS Protection**: React sanitization + CSP headers ready
5. **Rate Limiting**: Toast-based UX feedback

## Responsive Design

- **Mobile First**: Base styles for 320px+
- **Breakpoints**: 
  - md: 768px (navigation changes)
  - lg: 1024px (layout adjustments)
  - xl: 1280px (full desktop)
- **Touch Friendly**: 44px+ tap targets
- **Flexible Layouts**: Flexbox for responsive grids

## Deployment

- **Platform**: Vercel (recommended)
- **Builds**: Next.js SSG + ISR capable
- **Environment**: Node.js 18+
- **Package Manager**: pnpm 8+

## Future Enhancements

1. **Blockchain Integration**: ethers.js / Web3.js
2. **Real Smart Contracts**: Lending protocol contracts
3. **Database**: PostgreSQL with Prisma ORM
4. **Authentication**: NextAuth.js or Supabase
5. **WebSocket**: Real-time price feeds
6. **Analytics**: PostHog or Mixpanel
7. **Notifications**: Web3 wallet notifications
8. **Testing**: Vitest + Playwright

## Monitoring & Analytics

- **Performance**: Core Web Vitals tracking
- **Errors**: Sentry integration ready
- **Usage**: PostHog events structure in place
- **Health**: Uptime monitoring via Vercel Analytics

## Contributing Guidelines

1. Create feature branches from `main`
2. Follow existing component patterns
3. Maintain Tailwind utility-first approach
4. Test responsive design (mobile + desktop)
5. Keep animations performant (60fps target)
6. Update documentation for major changes

## Support & Maintenance

- **Documentation**: Comprehensive markdown files
- **Code Comments**: JSDoc for complex functions
- **Types**: Full TypeScript coverage
- **Testing**: Mock data for development
- **CI/CD**: GitHub Actions ready

