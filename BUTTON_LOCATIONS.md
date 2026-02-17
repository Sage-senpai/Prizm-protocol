# Prizm Protocol - Button & Link Locations

## How to Access Each Page

### 🚀 START ONBOARDING (Main Entry Point)

#### Button Location 1: Hero Section
```
Landing Page (/)
┌──────────────────────────────────────┐
│                                      │
│    🏠 NAVIGATION BAR (STICKY)        │
│    Logo | Features | Markets | Nav   │
│                   [Start Now] ◄──────┼─ Onboarding Link
│                                      │
├──────────────────────────────────────┤
│                                      │
│           HERO SECTION               │
│  "Unleash Real-World Assets"         │
│                                      │
│  [Start Onboarding] ◄────────────────┼─ Button 1
│  [Explore Markets]                   │
│                                      │
│  TVL: $2.4B | Users: 48K+            │
│                                      │
└──────────────────────────────────────┘
```
**Goes to:** `/onboard`

#### Button Location 2: Navigation Bar
```
ANY PAGE - Top Navigation
┌──────────────────────────────────────┐
│  Logo | Features | Phases | Markets  │
│  Docs | Community    [Start Now] ◄───┼─ Button 2
└──────────────────────────────────────┘
```
**Goes to:** `/onboard`

#### Button Location 3: CTA Section
```
Landing Page (/) - Scroll Down
┌──────────────────────────────────────┐
│  "Ready to Unlock Institutional      │
│   Returns?"                          │
│                                      │
│  Benefits: Secured | Liquidity | DAO │
│                                      │
│  [Create Account & Start] ◄──────────┼─ Button 3
│  [View Markets]                      │
│                                      │
│  Trust Badges                        │
└──────────────────────────────────────┘
```
**Goes to:** `/onboard`

#### Mobile Menu Entry
```
Landing Page (/) - Mobile View
┌──────────────────────────────────────┐
│  Logo            [☰ Menu]            │
└──────────────────────────────────────┘
           ↓ Click Menu
┌──────────────────────────────────────┐
│  Features                            │
│  Phases                              │
│  Markets                             │
│  Docs                                │
│  Community                           │
│  [Start Onboarding] ◄────────────────┼─ Mobile Button
└──────────────────────────────────────┘
```
**Goes to:** `/onboard`

---

### 📊 DASHBOARD (Portfolio Stats)

#### After Onboarding Complete
```
Onboarding Page (/onboard) - Step 4
┌──────────────────────────────────────┐
│       "You're All Set!"              │
│                                      │
│  📊 Dashboard | 💰 Markets | 👤 Profile│
│                                      │
│  [Go to Dashboard] ◄─────────────────┼─ Button
└──────────────────────────────────────┘
```
**Goes to:** `/dashboard`

#### From Navigation (After Connected)
```
ANY PAGE - Top Navigation (Logged In)
┌──────────────────────────────────────┐
│  Logo | Features | Markets           │
│         [Dashboard] ◄──────────────┐  │
│         [Profile]                  │  │
│         [Wallet Info]              │  │
│         [Disconnect]               │  │
└──────────────────────────────────────┘
```
**Goes to:** `/dashboard`

#### From Profile Page
```
Profile Page (/profile)
┌──────────────────────────────────────┐
│  Logo | Features | Markets           │
│         [Dashboard] ◄────────────────┼─ Link
└──────────────────────────────────────┘
```
**Goes to:** `/dashboard`

---

### 👤 PROFILE (Account Settings)

#### From Navigation (After Connected)
```
ANY PAGE - Top Navigation (Logged In)
┌──────────────────────────────────────┐
│  Logo | Features | Markets           │
│         [Dashboard]                  │
│         [Profile] ◄──────────────────┼─ Link
│         [0x742d...7eaB]              │
│         [Disconnect]                 │
└──────────────────────────────────────┘
```
**Goes to:** `/profile`

#### From Dashboard
```
Dashboard Page (/dashboard)
┌──────────────────────────────────────┐
│  Logo | Features | Markets           │
│         [Dashboard]                  │
│         [Profile] ◄──────────────────┼─ Link
└──────────────────────────────────────┘
```
**Goes to:** `/profile`

#### Mobile Menu
```
Mobile Menu (Any Page - Logged In)
┌──────────────────────────────────────┐
│  Features                            │
│  Phases                              │
│  Markets                             │
│  [Dashboard]                         │
│  [Profile] ◄──────────────────────────┼─ Link
│  [Disconnect]                        │
└──────────────────────────────────────┘
```
**Goes to:** `/profile`

---

### 🏢 MARKETS (Browse Vaults)

#### From Landing Page
```
Landing Page (/) - Markets Section
┌──────────────────────────────────────┐
│  "Featured Markets"                  │
│  [Explore Markets Button] ◄───────────┼─ Scroll Link
│  (Scrolls to #markets section)       │
└──────────────────────────────────────┘
```
**Scrolls to:** `#markets` on landing page

#### Direct Access
```
ANY PAGE - Type in URL
URL Bar: https://yoursite.com/markets
```
**Goes to:** `/markets`

#### From Navigation
```
ANY PAGE - Top Navigation
┌──────────────────────────────────────┐
│  Logo | Features | [Markets] | Docs  │
│                          ▲            │
│                      Click here       │
└──────────────────────────────────────┘
```
**Goes to:** `#markets` (scroll) or `/markets`

---

### 💎 VAULT DETAILS (Individual Vault)

#### From Markets Page
```
Markets Page (/markets)
┌──────────────────────────────────────┐
│  VAULT CARDS (Grid Layout)           │
│                                      │
│  ┌─────────────────────────────────┐ │
│  │ 🏠 Real Estate Fund             │ │
│  │ 8.5% APY  $450M TVL             │ │
│  │ [Supply] [Click Anywhere] ◄─────┼─┼─ Link
│  │ (Entire card is clickable)      │ │
│  └─────────────────────────────────┘ │
│                                      │
│  ┌─────────────────────────────────┐ │
│  │ 📈 Trade Finance                │ │
│  │ 6.2% APY  $280M TVL             │ │
│  │ [Supply] [Click Anywhere] ◄─────┼─┼─ Link
│  └─────────────────────────────────┘ │
│                                      │
│  ... 4 more vaults ...               │
│                                      │
└──────────────────────────────────────┘
```
**Goes to:** `/vaults/[id]`

#### From Vault Details Page
```
Vault Details Page (/vaults/[id])
┌──────────────────────────────────────┐
│  [← Back to Markets] ◄─────────────────┼─ Back Link
│                                      │
│  🏠 Real Estate Fund                 │
│  8.5% APY  $450M TVL                 │
│                                      │
│  [Overview] [Supply] [Borrow] [Analysis]│
└──────────────────────────────────────┘
```
**Goes back to:** `/markets`

---

## Complete Navigation Tree

```
ROOT LEVEL
├── Landing (/)
│   ├── [Start Onboarding] → /onboard
│   ├── [Start Now] (Nav) → /onboard
│   ├── [Create Account & Start] → /onboard
│   ├── [Explore Markets] → #markets
│   ├── [View Markets] → #markets
│   └── Scroll to Markets section
│
├── Onboarding (/onboard)
│   ├── Step 1: Connect Wallet
│   │   └── [Connect Wallet] → Wallet Modal
│   ├── Step 2: Create Profile
│   │   └── [Create Profile] → Step 3
│   ├── Step 3: Verify Account
│   │   └── [Start Verification] → Step 4
│   └── Step 4: Success
│       └── [Go to Dashboard] → /dashboard
│
├── Dashboard (/dashboard)
│   ├── Nav [Markets] → #markets
│   ├── Nav [Profile] → /profile
│   ├── Nav [Wallet Icon] → /profile
│   └── Nav [Disconnect] → Logout
│
├── Profile (/profile)
│   ├── Nav [Dashboard] → /dashboard
│   ├── Nav [Markets] → #markets
│   ├── [Logout] → Disconnect
│   └── [Update Settings] → Save
│
├── Markets (/markets)
│   ├── [Real Estate Fund Card] → /vaults/1
│   ├── [Trade Finance Card] → /vaults/2
│   ├── [Supply Chain Card] → /vaults/3
│   ├── [Renewable Energy Card] → /vaults/4
│   ├── [Carbon Credits Card] → /vaults/5
│   ├── [Commodity Backed Card] → /vaults/6
│   ├── Search/Filter → Real-time Filter
│   └── Sort → Re-sort Grid
│
└── Vault Details (/vaults/[id])
    ├── [← Back to Markets] → /markets
    ├── [Overview Tab] → Show Overview
    ├── [Supply Tab] → Show Supply Form
    │   └── [Supply REF] → Toast Feedback
    ├── [Borrow Tab] → Show Borrow Form
    │   └── [Borrow Now] → Toast Feedback
    ├── [Analysis Tab] → Show Charts
    └── Nav [Markets] → #markets
```

---

## Quick Reference: What Button Goes Where?

| Want To Go | From Landing | From Onboarding | From Dashboard | From Profile | From Markets |
|-----------|-------------|-----------------|----------------|-------------|------------|
| Home | Logo | Logo | Logo | Logo | Logo |
| Onboarding | [Start Onboarding] | - | - | - | - |
| Dashboard | - | [Go to Dashboard] | (Already there) | [Dashboard] | (Direct Nav) |
| Profile | - | - | [Profile] | (Already there) | (Direct Nav) |
| Markets | [Explore Markets] | - | [Markets] | [Markets] | (Already there) |
| Vault | - | - | - | - | [Click Vault] |

---

## Exact Button Text

### All Buttons on Each Page

**Landing Page**
- `[Start Onboarding]` → `/onboard` (Hero)
- `[Start Now]` → `/onboard` (Nav)
- `[Create Account & Start]` → `/onboard` (CTA)
- `[Explore Markets]` → `#markets` (Hero)
- `[View Markets]` → `#markets` (CTA)
- `[Start Onboarding]` → `/onboard` (Mobile Menu)

**Onboarding Page**
- `[Connect Wallet]` → Wallet Modal
- `[Continue to Next Step]` → Step 2
- `[Create Profile]` → Step 3
- `[Start Verification]` → Step 4
- `[Go to Dashboard]` → `/dashboard`

**Dashboard Page**
- Nav `[Dashboard]` → (Already here)
- Nav `[Profile]` → `/profile`
- Nav `[Markets]` → `#markets`
- Nav `[Disconnect]` → Logout

**Profile Page**
- Nav `[Dashboard]` → `/dashboard`
- Nav `[Markets]` → `#markets`
- `[Update Settings]` → Save
- `[Logout]` → Disconnect
- `[Toggle Theme]` → Switch dark/light

**Markets Page**
- `[Vault Card]` → `/vaults/[id]`
- Search Input → Filter results
- Sort Dropdown → Re-sort

**Vault Details**
- `[← Back]` → `/markets`
- `[Supply REF]` → Submit form
- `[Borrow Now]` → Submit form
- Tab Links → Switch tabs

---

## Mobile Navigation

**On Mobile (< 768px)**

Top Right Corner:
```
┌─────────────────────────────┐
│ Logo | [☰ Menu]             │
└─────────────────────────────┘
```

Click Menu to Open:
```
┌─────────────────────────────┐
│ Features                    │
│ Phases                      │
│ Markets                     │
│ Docs                        │
│ Community                   │
│ [Start Onboarding] (if not connected)
│ OR                          │
│ [Dashboard]                 │
│ [Profile]                   │
│ [Disconnect]                │
└─────────────────────────────┘
```

---

## Summary

**3 Ways to Get to Onboarding:**
1. Click `[Start Onboarding]` button in hero
2. Click `[Start Now]` in navigation
3. Click `[Create Account & Start]` in CTA section

**2 Ways to Get to Dashboard:**
1. Complete onboarding (auto-redirect)
2. Click `[Dashboard]` in nav (if connected)

**2 Ways to Get to Profile:**
1. Click `[Profile]` in nav (if connected)
2. Click wallet address in nav

**2 Ways to Get to Markets:**
1. Click `[Explore Markets]` button
2. Go to `/markets` directly

**To View Vault Details:**
1. Go to `/markets`
2. Click any vault card
3. View vault details with tabs

---

Everything is clickable and labeled. Just look for the purple buttons!

🎯 **Main Entry:** `[Start Onboarding]` button on landing page

🏠 **Return Home:** Click logo anytime

📱 **Mobile Menu:** Click ☰ in top right

That's all the buttons! 🎉
