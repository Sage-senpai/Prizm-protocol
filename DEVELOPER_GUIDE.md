# Prizm - Developer Setup & Deployment Guide

## Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm 8+
- Git
- Browser (Chrome, Firefox, Safari, or Edge)

### Installation (5 minutes)

```bash
# Clone repository
git clone https://github.com/yourusername/prizm.git
cd prizm

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser
open http://localhost:3000
```

### Project Structure
```
prizm/
├── app/                  # Next.js 16 App Router
│   ├── layout.tsx       # Root layout with providers
│   ├── page.tsx         # Landing page
│   ├── globals.css      # Global styles + theme
│   └── [routes]/        # Pages (dashboard, markets, etc.)
├── components/          # React components
│   ├── navigation.tsx   # Top navigation
│   ├── hero.tsx        # Landing hero
│   └── [features]/      # Feature components
├── context/            # React Context (wallet, toast)
├── lib/                # Utilities
├── public/             # Static assets
├── tailwind.config.ts  # Tailwind configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies
```

## Development

### Environment Setup

```bash
# Create .env.local
cp .env.example .env.local

# Add these if needed (currently using defaults)
# NEXT_PUBLIC_API_URL=http://localhost:3000
# NEXT_PUBLIC_CHAIN_ID=1
```

### Running Development Server

```bash
# Start with hot reload
pnpm dev

# Runs on http://localhost:3000
# Auto-reloads on file changes
# Shows type errors in terminal
```

### Code Quality

```bash
# TypeScript type checking
pnpm type-check

# Format code (Prettier)
pnpm format

# Lint code (ESLint)
pnpm lint

# All checks together
pnpm check-all
```

### Creating New Components

**Pattern**: Functional component with TypeScript

```typescript
// components/my-component.tsx
'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MyComponentProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

export function MyComponent({ children, variant = 'primary' }: MyComponentProps) {
  return (
    <motion.div
      className="glass px-4 py-3 rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

### Using Styling

**Tailwind First** (preferred):
```tsx
<div className="flex items-center gap-4 rounded-lg bg-white/10 backdrop-blur-lg p-4">
  {/* content */}
</div>
```

**Glass Effects** (predefined):
```tsx
<div className="glass">
  {/* content */}
</div>

<button className="glass-button">
  Submit
</button>

<input className="glass-input" />
```

**Animations** (Tailwind + Framer):
```tsx
<motion.div
  className="animate-float"
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.3 }}
>
  {/* content */}
</motion.div>
```

### Adding New Pages

**Create page directory**:
```bash
mkdir app/my-page
touch app/my-page/page.tsx
```

**Page template**:
```typescript
// app/my-page/page.tsx
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'My Page - Prizm',
  description: 'Page description',
};

export default function MyPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen py-16 px-4">
        {/* Page content */}
      </main>
      <Footer />
    </>
  );
}
```

## Styling Guide

### Color System (CSS Variables)

Light theme (default):
```css
--background: 0 0% 100%;     /* White */
--foreground: 0 0% 0%;       /* Black */
--primary: 0 0% 0%;          /* Black */
--secondary: 0 0% 20%;       /* Dark gray */
```

Dark theme (applied):
```css
--background: 0 0% 8%;       /* Near black */
--foreground: 0 0% 98%;      /* Near white */
--primary: 0 0% 0%;          /* Black */
--secondary: 0 0% 25%;       /* Gray */
```

### Typography

Font family: Work Sans (Google Fonts)

```css
h1 { @apply text-4xl md:text-5xl lg:text-6xl font-bold; }
h2 { @apply text-3xl md:text-4xl font-semibold; }
h3 { @apply text-2xl md:text-3xl font-semibold; }
p { @apply text-base md:text-lg leading-relaxed; }
```

### Glass Morphism Classes

```css
.glass              /* White glass effect */
.glass-dark         /* Black glass effect */
.glass-input        /* Input field styling */
.glass-button       /* Primary button */
.glow-effect        /* Shadow glow */
.gradient-text      /* Black gradient text */
```

### Responsive Breakpoints

```css
/* Mobile First */
base          /* 320px+ */
sm: 640px     /* Small devices */
md: 768px     /* Tablets */
lg: 1024px    /* Laptops */
xl: 1280px    /* Desktops */
2xl: 1536px   /* Large screens */
```

## Testing

### Manual Testing Checklist

**Responsive Design**:
- [ ] Mobile (375px width)
- [ ] Tablet (768px width)
- [ ] Desktop (1920px width)

**Browser Compatibility**:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari (iOS)

**Features**:
- [ ] Onboarding flow (4 steps)
- [ ] Wallet connection
- [ ] Dashboard loads correctly
- [ ] Markets filtering works
- [ ] Vault details pages load
- [ ] Forms validate correctly
- [ ] Toasts appear correctly
- [ ] Mobile menu works

**Performance**:
- [ ] Page load < 2 seconds
- [ ] Animations smooth (60fps)
- [ ] No console errors
- [ ] No memory leaks

### Browser DevTools Tips

```javascript
// Check animation performance
performance.mark('animation-start');
// ... animation runs
performance.mark('animation-end');
performance.measure('animation', 'animation-start', 'animation-end');

// Monitor memory
console.memory

// Check Core Web Vitals
web-vital metrics
```

## Deployment

### Vercel Deployment (Recommended)

**Prerequisites**:
- Vercel account (free tier available)
- GitHub repository
- GitHub connected to Vercel

**Deploy steps**:

1. **Connect Repository**
   - Go to https://vercel.com/new
   - Select "Import Git Repository"
   - Choose your GitHub repo

2. **Configure Project**
   - Framework: Next.js
   - Root Directory: ./
   - Build Command: `pnpm build`
   - Install Command: `pnpm install`

3. **Environment Variables**
   - (Currently none required for demo)

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get production URL

5. **Domain Setup** (Optional)
   - Add custom domain in Vercel dashboard
   - Update DNS records
   - Enable HTTPS (automatic)

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Build application
COPY . .
RUN pnpm build

# Run production server
EXPOSE 3000
CMD ["pnpm", "start"]
```

**Build & run**:
```bash
docker build -t prizm:latest .
docker run -p 3000:3000 prizm:latest
```

### Docker Compose

```yaml
version: '3.8'
services:
  prizm:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
    restart: unless-stopped
```

```bash
docker-compose up -d
```

## Production Considerations

### Performance Optimization

**Next.js built-in**:
- Image optimization (via next/image)
- Code splitting (per route)
- CSS minification
- JS minification
- Automatic prerendering

**Manual optimization**:
- Monitor Core Web Vitals
- Use lazy loading for images
- Implement caching headers
- Enable gzip compression
- CDN for static assets

### Security Checklist

- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Environment variables secured (not in code)
- [ ] Sensitive data in `.env` files only
- [ ] Rate limiting on API (future)
- [ ] Input validation on all forms
- [ ] CORS configured properly
- [ ] Security headers set
- [ ] No API keys in client code

### Monitoring & Analytics

**Vercel Analytics**:
- Built-in performance monitoring
- Core Web Vitals tracking
- Usage statistics

**Third-party tools** (optional):
- Sentry for error tracking
- PostHog for product analytics
- Datadog for infrastructure
- Hotjar for user behavior

### Scaling Strategy

**Phase 1: Current (0-10k DAU)**
- Vercel Hobby or Pro
- No database needed
- Mock data sufficient

**Phase 2: Growth (10k-100k DAU)**
- Vercel Scale plan
- Database integration (PostgreSQL)
- API layer with caching
- CDN for assets

**Phase 3: Enterprise (100k+ DAU)**
- Custom infrastructure
- Load balancing
- Database replication
- Global CDN
- Dedicated support

## Troubleshooting

### Common Issues

**Issue**: Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use different port
pnpm dev -- -p 3001
```

**Issue**: Tailwind classes not applying
```bash
# Restart dev server
# Clear Next.js cache
rm -rf .next
pnpm dev
```

**Issue**: TypeScript errors
```bash
# Check all files
pnpm type-check

# Generate types
pnpm build
```

**Issue**: Animations stuttering
- Disable Chrome DevTools (impacts performance)
- Check for too many re-renders
- Profile in Performance tab
- Reduce number of concurrent animations

**Issue**: Mobile layout broken
```bash
# Check viewport meta tag in layout.tsx
# Ensure no fixed widths on responsive components
# Test with actual device or browser emulation
```

## Version Control

### Commit Convention

```
feat: Add new feature
fix: Fix bug
docs: Documentation changes
style: Styling changes (no logic)
refactor: Code restructuring
test: Test files
chore: Build/dependency changes
```

### Branch Strategy

```
main                 # Production-ready
├── develop          # Integration branch
│   ├── feat/*       # Feature branches
│   ├── fix/*        # Bug fix branches
│   └── docs/*       # Documentation branches
└── release/*        # Release branches
```

## Performance Profiling

```javascript
// In browser console
performance.mark('load-start');
// ... operation
performance.mark('load-end');
performance.measure('load', 'load-start', 'load-end');
console.log(performance.getEntriesByType('measure'));
```

## Debugging

### Debug in VSCode

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js dev",
      "type": "node",
      "request": "launch",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/node_modules/next/dist/bin/next",
      "args": ["dev"],
      "console": "integratedTerminal"
    }
  ]
}
```

Then press F5 to start debugging.

## Documentation

### Writing Code Comments

```typescript
// Use JSDoc for functions
/**
 * Validates wallet address format
 * @param address - The address to validate
 * @returns True if valid, false otherwise
 */
function isValidAddress(address: string): boolean {
  // Implementation
}
```

### Updating Documentation

- Update README.md for user-facing changes
- Update ARCHITECTURE.md for structural changes
- Update USER_FLOWS.md for feature changes
- Keep PRODUCT_PITCH.md in sync with roadmap

## Getting Help

### Resources

- [Next.js Docs](https://nextjs.org)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Framer Motion Docs](https://www.framer.com/motion)
- [TypeScript Docs](https://www.typescriptlang.org)

### Community

- GitHub Issues (for bugs)
- GitHub Discussions (for questions)
- Discord Server (community chat)
- Twitter (@prizm_protocol)

## Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feat/amazing-feature`)
3. Commit changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to branch (`git push origin feat/amazing-feature`)
5. Open Pull Request

See CONTRIBUTING.md for detailed guidelines.

