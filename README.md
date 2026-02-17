# Prizm Protocol - Next-Gen DeFi RWA Lending Platform

A modern, fully-animated iOS 26 glassmorphic DeFi lending platform showcasing real-world asset (RWA) integration with institutional-grade transparency and risk management.

## Features

### 🎨 Design System
- **iOS 26 Glassmorphism**: Frosted glass effects with backdrop blur and sophisticated layering
- **Gradient Color Palette**: Purple, pink, blue, and cyan gradients throughout
- **Smooth Animations**: Framer Motion powered interactions on all components
- **Mobile Responsive**: Fully responsive across all device sizes
- **Dark Theme**: Enterprise-grade dark interface with optimized contrast

### 🏗️ Architecture

#### Navigation & Layout
- **Navigation**: Fixed header with mobile menu, animated transitions
- **Hero Section**: Full-screen entry with animated blobs, stats, and scroll indicator
- **Smooth Scrolling**: CSS scroll behavior with custom styled scrollbar

#### Core Features
1. **Features Section**: 8 key differentiators with hover effects
2. **Development Roadmap**: 3-phase timeline with animated milestones
3. **Asset Pools**: 4 institutional-grade RWA pools with real-time metrics
4. **Lending Markets**: Interactive pool selector with detailed metrics and utilization gauges
5. **Analytics Dashboard**: Earnings charts, portfolio distribution, and risk assessment
6. **User Wallet**: Asset portfolio display with transaction history
7. **Call-to-Action**: Conversion-focused section with key benefits
8. **Footer**: Complete with links, social icons, and newsletter signup

### 🎭 Animation Details
- **Page Load**: Staggered animations on all sections with ease-out timing
- **Scroll Triggers**: Elements animate into view as user scrolls using `whileInView`
- **Hover States**: Smooth scale and color transitions on interactive elements
- **Background Effects**: Animated gradient orbs that float and pulse
- **Micro-interactions**: Button animations, number counters, and chart fills

### 🛠️ Tech Stack
- **Next.js 16**: Latest app router with React 19.2.3
- **Tailwind CSS**: Utility-first styling with custom animations
- **Framer Motion**: Industry-leading animation library
- **Lucide Icons**: Beautiful SVG icons throughout
- **TypeScript**: Full type safety

## Components

```
components/
├── navigation.tsx          # Fixed header with mobile menu
├── hero.tsx               # Full-screen hero with stats
├── features.tsx           # 8 feature cards
├── phases.tsx             # 3-phase roadmap
├── asset-pool.tsx         # 4 asset pools display
├── lending-market.tsx     # Interactive lending markets
├── analytics.tsx          # Performance dashboard
├── wallet.tsx             # Portfolio and transactions
├── cta-section.tsx        # Call-to-action section
├── footer.tsx             # Footer with links
└── scroll-indicator.tsx   # Animated scroll hint
```

## Design Tokens

### Colors
- **Primary**: Purple (280° 100% 65%)
- **Secondary**: Pink (320° 100% 60%)
- **Accent**: Cyan (250° 100% 70%)
- **Background**: Deep Purple (270° 30% 8%)
- **Surface**: (270° 20% 12%)

### Spacing
- Uses Tailwind default scale (4px units)
- Gap classes for flexbox spacing
- Padding/margin for layout

### Typography
- **Sans Serif**: Geist font family (regular + semibold weights)
- **Sizes**: 
  - H1: 5xl-6xl
  - H2: 4xl-5xl
  - H3: 2xl-3xl
  - Body: base (16px)

## Animations

### Keyframe Animations
- `float`: 4s vertical float motion
- `blob`: 8s organic morph animation
- `glow`: 2s opacity pulse
- `pulse-glow`: 2.5s shadow expansion
- `shimmer`: 2s background position slide
- `fade-in-up`: 0.7s upward entrance
- `slide-in-right/left`: 0.6s horizontal entrance
- `rotate-slow`: 25s continuous rotation

### Framer Motion Variants
- `containerVariants`: Staggered children (0.1-0.2s delays)
- `itemVariants`: Fade in + translate with easing
- `whileHover`: Scale 1.05-1.1 for interactive elements
- `whileTap`: Scale 0.95 for button feedback
- `whileInView`: Trigger animations on scroll

## Performance Optimizations

- Client components only where animation needed (performance critical)
- Lazy loading with `whileInView` triggers
- Optimized animations (GPU-accelerated transforms)
- No layout shifts or repaints
- Smooth 60fps animations

## Responsive Breakpoints

- **Mobile**: 320px - 640px (sm: 640px)
- **Tablet**: 640px - 1024px (md: 768px, lg: 1024px)
- **Desktop**: 1024px+ (xl: 1280px, 2xl: 1536px)

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) to view.

## Deployment

Deploy to Vercel with a single click. All components are optimized for Vercel's Edge Functions and serverless infrastructure.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires CSS backdrop-filter support for glassmorphism effects.

## License

MIT License - see LICENSE file for details
