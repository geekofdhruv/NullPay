# AleoZKPay Frontend Design Document

## 🎨 Design System

### Color Palette - Black & Green Glassmorphism

```css
:root {
  /* Backgrounds */
  --bg-black: #000000;
  --bg-dark: #0a0a0a;
  --bg-card: rgba(15, 15, 15, 0.8);
  
  /* Green Accents */
  --green-primary: #00ff88;
  --green-secondary: #00d4aa;
  --green-light: #88ffbb;
  --green-glow: rgba(0, 255, 136, 0.15);
  
  /* Text */
  --text-white: #ffffff;
  --text-gray: #888888;
  --text-muted: #555555;
  
  /* Status Colors */
  --status-pending: #ffaa00;
  --status-settled: #00ff88;
  --status-expired: #ff3366;
  
  /* Glass Effects */
  --glass-bg: rgba(15, 15, 15, 0.85);
  --glass-border: rgba(0, 255, 136, 0.1);
  --glass-blur: blur(24px);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 
                  0 0 12px rgba(0, 255, 136, 0.08);
  
  /* Spacing */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
}
```

### Typography

- **Font Family**: SF Pro Display (or Inter)
- **Headings**: 600-700 weight
- **Body**: 400-500 weight
- **Monospace**: SF Mono (for hashes)

---

## 📐 Application Structure

### Top Navigation Bar

```
┌────────────────────────────────────────────────────────┐
│ [Logo] AleoZKPay    Explorer | Create Invoice | Profile │
│                                                          │
│                     [Connect Wallet] [Theme] [Settings] │
└────────────────────────────────────────────────────────┘
```

**Elements:**
- Logo: White "AleoZKPay" with green shield icon
- Nav Links: Explorer (active by default), Create Invoice, Profile
- Right Side: Wallet connect button (green gradient), theme toggle, settings icon
- Glass background with subtle green border bottom

---

## 📄 Pages & Routes

### 1. Explorer Page (Home - `/`)

**Purpose**: Public dashboard showing platform statistics and recent activity

**Layout:**

```
┌─────────────────────────────────────────────────────────┐
│                    SEARCH BAR                           │
│       "Search by invoice hash or address..."           │
└─────────────────────────────────────────────────────────┘

┌──────────┬──────────┬──────────┬──────────┬──────────┐
│  Total   │ Pending  │ Settled  │ Merchants│  Volume  │
│  Invoices│  Count   │  Count   │  Count   │  24h     │
│  1,234   │   156    │  1,078   │   342    │ 50K USDC │
└──────────┴──────────┴──────────┴──────────┴──────────┘

┌─────────────────────────────────────────────────────────┐
│              FILTER TABS                                │
│  [All] [Pending] [Settled] [Expired]                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              RECENT INVOICES TABLE                      │
│                                                         │
│ Hash         │ Status  │ Created │ Expiry  │ Block    │
│─────────────────────────────────────────────────────────│
│ 0x7f8a...3d2f│🟡PENDING│ 2h ago  │ 2h left │ #123456  │
│ 0x9abc...1e4g│🟢SETTLED│ 5h ago  │ Paid    │ #123450  │
│ 0x2def...8h9i│🔴EXPIRED│ 1d ago  │ Expired │ #123400  │
│                                                         │
│                    [Load More]                          │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- **Search Bar**: Glass effect, search by invoice hash or address
- **Stats Cards**: 5 glassmorphic cards showing:
  1. Total Invoices
  2. Pending Count (yellow badge)
  3. Settled Count (green badge)
  4. Total Merchants
  5. 24h Volume (in USDC equivalent)
- **Filter Tabs**: Rounded pill buttons (All, Pending, Settled, Expired)
- **Invoice Table**: 
  - Truncated hashes (click to expand)
  - Color-coded status badges
  - Relative timestamps
  - Expiry countdown (green → yellow → red)
  - Click row to see modal details
- **Real-time Updates**: WebSocket connection for live stats

---

### 2. Create Invoice Page (`/create`)

**Purpose**: Merchant creates new invoice

**Layout:**

```
┌─────────────────────────────────────────────────┐
│         CREATE INVOICE                          │
│                                                 │
│  Amount (USDC):                                 │
│  [_______________]                              │
│                                                 │
│  Memo (Optional):                               │
│  [_______________]                              │
│                                                 │
│  Expiry:                                        │
│  [▼ No Expiry | 4 Hours | 24 Hours | 7 Days]   │
│                                                 │
│         [Generate Invoice Link]                 │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  📱 QR Code:                                    │
│  [QR CODE PREVIEW]                              │
│                                                 │
│  🔗 Payment Link:                               │
│  [aleozkpay.com/pay?h=0x...]  [COPY]           │
│                                                 │
│  [Share via Twitter] [Share via WhatsApp]       │
└─────────────────────────────────────────────────┘
```

**Features:**
- **Form Fields**:
  - Amount: Large input with USDC indicator
  - Memo: Optional text (max 100 chars)
  - Expiry: Dropdown (No Expiry, 4h, 24h, 7d, Custom)
- **QR Code**: Live preview updates as you type
- **Payment Link**: Copyable link with visual feedback
- **Share Buttons**: Quick share to social platforms
- **Validation**: Real-time form validation
- **Success Animation**: Confetti on invoice creation

---

### 3. Payment Page (`/pay?merchant=...&amount=...`)

**Purpose**: User pays an invoice

**Layout:**

```
┌─────────────────────────────────────────────────┐
│              INVOICE DETAILS                    │
│                                                 │
│  Amount: 100 USDC                               │
│  Merchant: aleo1mer...abc                       │
│  Memo: Logo Design Work                         │
│  Expires: ⏱️ 3h 24m remaining                    │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Payment Steps:                                 │
│  ✅ 1. Transfer Credits                         │
│  ⏳ 2. Submit Proof                             │
│                                                 │
│         [Connect Wallet]                        │
│         [Pay Now]                               │
│                                                 │
│  Transaction Hash:                              │
│  0xabc...def (Aleo Explorer →)                  │
└─────────────────────────────────────────────────┘
```

**Features:**
- **Invoice Info**: Large amount display, merchant, memo, expiry
- **Countdown Timer**: Color changes (green → yellow → red)
- **Step Indicator**: Visual progress bar
- **Pay Button**: Large green gradient button
- **Transaction Flow**:
  1. Connect wallet
  2. Transfer credits (Transaction 1)
  3. Submit proof (Transaction 2)
  4. Show success & receipt
- **Status Updates**: Real-time transaction status
- **Error Handling**: Clear error messages

---

### 4. Profile Page (`/profile`)

**Purpose**: Merchant's personal dashboard

**Layout:**

```
┌─────────────────────────────────────────────────┐
│  MERCHANT DASHBOARD                             │
│                                                 │
│  Connected: aleo1mer...abc  [Copy] [Disconnect] │
│                                                 │
├─────────────┬──────────────┬──────────────────┤
│ Total       │ Pending      │ Total Received   │
│ Invoices    │ Invoices     │ Volume           │
│   42        │    12        │   5,000 USDC     │
└─────────────┴──────────────┴──────────────────┘
│                                                 │
│  MY INVOICES                                    │
│  [All] [Pending] [Settled] [Expired]           │
│                                                 │
│  Hash        │Amount│Status │Created │Action   │
│ ─────────────────────────────────────────────   │
│ 0x7f8a...│100 │🟡PENDING│2h ago│[View][Delete]│
│ 0x9abc...│250 │🟢SETTLED│5h ago│[View][Share] │
│ 0x2def...│50  │🔴EXPIRED│1d ago│[View][Resend]│
│                                                 │
│              [Create New Invoice]               │
└─────────────────────────────────────────────────┘
```

**Features:**
- **Wallet Info**: Connected address with copy/disconnect
- **Stats Cards**: Personal statistics
  - Total invoices created
  - Pending invoices
  - Total volume received
- **My Invoices Table**: Merchant's invoice history
  - Filter by status
  - Quick actions (View, Delete, Share, Resend)
  - Pagination
- **Quick Create**: Button to create new invoice

---

## 🔧 Components

### Glass Card Component

```jsx
<GlassCard className="stats-card">
  <h3>Total Invoices</h3>
  <p className="stat-number">1,234</p>
  <span className="trend">+12% from yesterday</span>
</GlassCard>
```

**Styles:**
- Background: `rgba(15, 15, 15, 0.85)`
- Backdrop filter: `blur(24px)`
- Border: `1px solid rgba(0, 255, 136, 0.1)`
- Border radius: `16px`
- Hover: Intensified border & shadow

### Status Badge Component

```jsx
<StatusBadge status="PENDING" />
<StatusBadge status="SETTLED" />
<StatusBadge status="EXPIRED" />
```

**Variants:**
- `PENDING`: Yellow text, yellow glow
- `SETTLED`: Green text, green glow
- `EXPIRED`: Red text, red glow

### Countdown Timer Component

```jsx
<CountdownTimer expiryBlock={123456} />
```

**Behavior:**
- Shows time remaining (e.g., "3h 24m")
- Color changes: >1hr (green), <1hr (yellow), <15min (red)
- Pulses when <5min remaining

### Search Bar Component

```jsx
<SearchBar 
  placeholder="Search by invoice hash or address..." 
  onSearch={handleSearch}
/>
```

**Features:**
- Glass effect background
- Green glow on focus
- Debounced search
- Clear button

---

## 🔄 Data Flow & API Integration

### Supabase Indexer API

**Endpoints:**
- `GET /api/invoices` - Fetch all invoices (paginated)
- `GET /api/invoices/:hash` - Get invoice details
- `GET /api/stats` - Get platform stats
- `GET /api/merchant/:address` - Get merchant's invoices

### Aleo Wallet Integration

```jsx
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';

const { publicKey, requestTransaction } = useWallet();

// Create invoice
await requestTransaction({
  program: 'zk_pay.aleo',
  function: 'create_invoice',
  inputs: [invoiceHash, expiryHours]
});
```

### Hash Computation

```js
import { BHP256 } from '@aleohq/sdk';

function computeInvoiceHash(merchant, amount, salt, memo) {
  const hashMerchant = BHP256.hash_to_field(merchant);
  const hashAmount = BHP256.hash_to_field(amount);
  const hashSalt = BHP256.hash_to_field(salt);
  const hashMemo = BHP256.hash_to_field(memo || '');
  
  return hashMerchant + hashAmount + hashSalt + hashMemo;
}
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile */
@media (max-width: 640px) { }

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }
```

### Mobile Adaptations

- **Navigation**: Hamburger menu
- **Stats Cards**: Stack vertically
- **Table**: Horizontal scroll or card view
- **QR Codes**: Full width with download button
- **Touch Targets**: Minimum 48px height

---

## ✨ Animations & Interactions

### Micro-interactions

- **Button Hover**: Scale(1.02) + green glow
- **Card Hover**: Lift with intensified shadow
- **Copy Success**: Checkmark animation
- **Loading**: Spinning green gradient ring
- **Page Transitions**: Fade in/out
- **Invoice Creation**: Confetti burst

### Real-time Updates

- **WebSocket Connection**: Live invoice status updates
- **Countdown Timers**: Update every second
- **Stats Refresh**: Auto-refresh every 30s

---

## 🚀 Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS
- **Aleo SDK**: `@demox-labs/aleo-wallet-adapter-react`
- **State Management**: Zustand
- **Routing**: React Router v6
- **API Client**: Axios
- **Hashing**: `@aleohq/sdk`
- **QR Codes**: `qrcode.react`
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **UI Components**: Custom + shadcn/ui base

---

## 🎯 User Journeys

### Merchant Flow

1. Connect wallet → Profile page
2. Click "Create Invoice"
3. Enter amount, memo, expiry
4. Generate invoice link & QR code
5. Share with customer
6. Track status in Profile

### Customer Flow

1. Receive payment link
2. Open link → Payment page
3. See invoice details
4. Connect wallet
5. Click "Pay Now"
6. Confirm two transactions
7. See success confirmation

### Public Visitor Flow

1. Open AleoZKPay.com → Explorer
2. See platform statistics
3. Browse recent invoices
4. Search for specific invoice hash
5. View invoice status (public data only)
