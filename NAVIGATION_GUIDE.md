# Prizm Protocol - Navigation Guide

## Quick Navigation

### Home Page
**URL:** `/`

The landing page has been simplified to show only the essentials:

1. **Top Navigation Bar**
   - Prizm logo (left)
   - Menu items: Features, Markets, Docs
   - **"Get Started" Button** (disconnected users) → Goes to `/onboard`
   - **Dashboard, Profile, Logout** buttons (connected users)

2. **Hero Section**
   - Main headline: "Unleash Real-World Assets"
   - Two large buttons:
     - **"Start Now"** → `/onboard`
     - **"Browse Markets"** → `/markets`

3. **Features Section**
   - Shows key platform features

4. **Call-to-Action Section**
   - Large heading: "Ready to Unlock Institutional Returns?"
   - Two action buttons:
     - **"Start Earning Now"** → `/onboard`
     - **"Browse Markets"** → `/markets`

---

## All Available Pages

### 1. **Onboarding Page** `/onboard`
- **Purpose**: Get new users set up
- **Flow**:
  - Step 1: Connect wallet
  - Step 2: Create profile (username, email, risk tolerance)
  - Step 3: Verify account (KYC simulation)
  - Step 4: Success → Redirects to dashboard
- **Access**: From any "Get Started" or "Start Now" button

### 2. **Dashboard** `/dashboard`
- **Purpose**: View your portfolio and positions
- **Features**:
  - Portfolio overview ($87.5K supplied, $32.2K borrowed)
  - Health factor: 3.2 (Low Risk)
  - 5 position cards showing assets, APY, and actions
  - 3 tabs: Overview, Positions, Performance
- **Access**: Dashboard link in navbar (after connecting wallet)

### 3. **Markets** `/markets`
- **Purpose**: Browse available lending pools/vaults
- **Features**:
  - 6 RWA vaults displayed as cards
  - Search functionality
  - Sort by: TVL, APY, Risk Level
  - Click any vault card to view details
- **Access**: 
  - "Browse Markets" button
  - Markets link in navigation
  - URL: `/markets`

### 4. **Vault Details** `/vaults/[id]`
- **Purpose**: Deep dive into a specific vault
- **Features**:
  - 4 tabs: Overview, Supply, Borrow, Analytics
  - Supply/Borrow forms
  - Charts and metrics
  - Risk analysis
- **Access**: Click on any vault card in Markets page

### 5. **Profile** `/profile`
- **Purpose**: Manage your account
- **Features**:
  - Account settings
  - Theme toggle (dark/light mode)
  - Verification status
  - Security settings
- **Access**: Profile link in navbar (after connecting wallet)

### 6. **Verification** `/verify`
- **Purpose**: Complete KYC/PoP verification
- **Features**:
  - Multi-step verification form
  - Document upload simulation
  - Success confirmation
- **Access**: From onboarding flow or manually via `/verify`

---

## Button Navigation Summary

### From Landing Page
| Button | Goes To |
|--------|---------|
| "Get Started" (nav) | `/onboard` |
| "Start Now" (hero) | `/onboard` |
| "Browse Markets" (hero) | `/markets` |
| "Start Earning Now" (CTA) | `/onboard` |
| "Browse Markets" (CTA) | `/markets` |
| Features menu item | Scrolls to features section |

### From Any Page (After Connecting Wallet)
| Button | Goes To |
|--------|---------|
| Dashboard (nav) | `/dashboard` |
| Profile (nav) | `/profile` |
| Logout (nav) | Disconnects wallet, returns home |

### From Markets Page
| Action | Goes To |
|--------|---------|
| Click vault card | `/vaults/[vault-id]` |
| Click "Supply" button | Vault details supply tab |
| Click "Borrow" button | Vault details borrow tab |

---

## Complete User Journey

### New User Flow
1. Land on `/` (home)
2. Click any "Start" or "Get Started" button
3. Redirected to `/onboard`
4. Follow 4-step onboarding:
   - Connect wallet
   - Create profile
   - Verify identity
   - Success → Auto-redirect to `/dashboard`

### Returning User Flow (Wallet Connected)
1. Home page shows connected status in navbar
2. Click "Dashboard" → View `/dashboard`
3. Click "Markets" → Browse `/markets`
4. Click vault → View `/vaults/[id]`
5. Click "Profile" → View `/profile`

---

## Navigation Simplified

The landing page now focuses on conversion:
- Removed heavy content sections (Phases, Analytics, Asset Pool)
- Added clear CTAs every section
- All navigation leads to 3 key destinations:
  - `/onboard` - Get started
  - `/markets` - Browse opportunities
  - `/dashboard` - View portfolio

---

## Testing the Navigation

### Quick Test
1. Visit `/` - See landing with "Get Started" button
2. Click "Get Started" - Should go to `/onboard`
3. Click "Browse Markets" - Should go to `/markets`
4. In Markets, click any vault - Should go to `/vaults/[id]`
5. From vault, click "Back" - Returns to `/markets`

### Mobile Test
- All buttons and links work on mobile
- Navigation menu opens/closes correctly
- Buttons are large enough to tap
- No scroll issues

---

## Technical Details

### Page Structure
```
/app
  ├── page.tsx (home)
  ├── onboard/page.tsx
  ├── dashboard/page.tsx
  ├── markets/page.tsx
  ├── profile/page.tsx
  ├── verify/page.tsx
  └── vaults/[id]/page.tsx
```

### Navigation Component
- Uses standard `<a>` tags for routing (not motion.a)
- Responsive design with mobile hamburger menu
- Shows different content based on wallet connection state
- All links are functional and tested

---

## Troubleshooting

If buttons aren't working:
1. Check that you're on `/` not a subdomain
2. Ensure wallet context is loaded
3. Try refreshing the page
4. Check browser console for errors

If you're stuck:
1. Click "Prizm" logo - Returns home
2. Use browser back button
3. Manually type URLs: `/dashboard`, `/markets`, `/onboard`





