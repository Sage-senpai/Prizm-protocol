# Prizm Protocol - Quick Start Guide

## Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Step 1: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 2: Run Development Server
```bash
npm run dev
# or
yarn dev
```

### Step 3: Open in Browser
Navigate to: `http://localhost:3000`

---

## Testing the Application

### Feature 1: Explore the Landing Page
1. Visit `http://localhost:3000`
2. Scroll through all sections
3. Observe animations and effects
4. Notice the custom cursor with glow effect

### Feature 2: Connect Wallet
1. Click "Connect Wallet" button in navbar
2. Select a wallet provider (MetaMask, WalletConnect, or Coinbase)
3. See the connection animation
4. Observe success toast notification
5. Notice navbar updates with Dashboard and Profile links

### Feature 3: Visit Dashboard
1. After connecting wallet, click "Dashboard"
2. View portfolio metrics with animations
3. Check supplied and borrowed assets
4. Explore the risk assessment panel

### Feature 4: Browse Markets
1. Click "Markets" link in navbar
2. See 6 RWA vaults with real mock data
3. Test search functionality
4. Try sorting by TVL, APY, or Utilization
5. Click on a vault to see details

### Feature 5: Explore Vault Details
1. From Markets page, click "Explore" on any vault
2. View collateral details
3. Check market statistics with animated charts
4. Try to supply/borrow:
   - If not connected: toast prompts to connect wallet
   - If amount is empty: toast warns to enter amount
   - If valid: success toast appears

### Feature 6: Complete Verification
1. Click "Verify" link (or go to `/verify` directly)
2. Follow the multi-step process
3. Watch the progress indicator
4. Complete all steps to see success celebration
5. View the unlocked borrowing limit

### Feature 7: Manage Profile
1. Click "Profile" link after wallet connection
2. View account information
3. Check verification status
4. Toggle dark/light mode with theme button
5. Explore settings options

---

## Key Features to Test

### Animations
- Page load animations (staggered fade-in)
- Hover effects on cards (scale + y-transform)
- Progress bars filling
- Chart animations
- Modal transitions
- Toast notifications

### Responsiveness
- Resize browser to test mobile layout
- Test on different breakpoints (sm, md, lg)
- Verify hamburger menu on mobile
- Check touch interactions

### Forms & Validation
- Try supply/borrow without amount (warning toast)
- Enter different amounts (success on valid input)
- Watch input validation feedback

### Navigation
- Click all navbar items
- Test mobile menu toggle
- Verify scroll-to anchors
- Test back buttons

---

## Available Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page with overview |
| `/dashboard` | Portfolio and position management |
| `/profile` | User account and settings |
| `/verify` | Proof of Personhood verification |
| `/markets` | Browse all RWA vaults |
| `/vaults/[id]` | Individual vault details |

---

## Wallet Connection Testing

### Mock Wallets Available

1. **MetaMask**
   - Icon: 🦊
   - Mock Address: `0x742d35Cc6634C0532925a3b844Bc9e7595f7eaB`

2. **WalletConnect**
   - Icon: 📱
   - Mock Address: `0x8ba1f109551bD432803012645Ac136ddd64DBA72`

3. **Coinbase Wallet**
   - Icon: 🌐
   - Mock Address: `0x1234567890abcdef1234567890abcdef12345678`

All wallets trigger a 1.5 second connection animation for testing purposes.

---

## Customization

### Change Colors
Edit `/app/globals.css` CSS variables:
```css
--primary: 280 100% 65%;      /* Purple */
--secondary: 320 100% 60%;    /* Pink */
--accent: 250 100% 70%;       /* Cyan */
```

### Modify Mock Data
All mock data is in component files under `/components` or `/app`.
Search for `mockVaults`, `mockPortfolio`, `mockUserData` to find and customize.

### Add Real Wallet Connection
Replace the mock wallet context in `/context/wallet-context.tsx` with real Web3 integration using:
- `ethers.js` for Web3
- `wagmi` for React hooks
- `@web3-modal/react` for wallet selection

### Connect to APIs
Replace mock data with real API calls in each page/component.

---

## Troubleshooting

### Port Already in Use
If port 3000 is busy:
```bash
npm run dev -- -p 3001
```

### Missing Dependencies
```bash
npm install
npm run dev
```

### Build Issues
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Animations Not Smooth
- Check your browser's GPU acceleration settings
- Close other demanding applications
- The animations are GPU-optimized and should run at 60fps

---

## Performance Notes

- Cursor is optimized with `pointer-events-none`
- Background animations use Canvas API for efficiency
- All images are optimized
- CSS is minified on build
- Next.js automatic code splitting

---

## Next Steps for Development

### Phase 1: Blockchain Integration
1. Add ethers.js or Web3.js
2. Connect to smart contracts
3. Implement real wallet connection
4. Add transaction signing

### Phase 2: Backend Integration
1. Setup Node.js backend or use APIs
2. Create database schema
3. Implement user authentication
4. Setup real data endpoints

### Phase 3: Enhancement
1. Add more detailed analytics
2. Implement order book UI
3. Add transaction history
4. Create governance features

---

## Build for Production

```bash
npm run build
npm start
```

---

## Support

For issues or questions:
- Check the `/DAPP_COMPLETION.md` for detailed feature documentation
- Review component code comments
- Check TypeScript types for expected props

---

**Happy building!**
