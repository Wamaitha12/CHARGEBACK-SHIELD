# 🛡️ Chargeback Shield

**Protect your business from chargeback losses.**

Track disputes, organize evidence, and improve win rates — all in one clean, premium dashboard. Built for Shopify stores, digital product sellers, SaaS businesses, and e-commerce operators.

---

## 📁 Folder Structure

```
chargeback-shield/
├── app/
│   ├── page.tsx                        # Landing page
│   ├── layout.tsx                      # Root layout + fonts
│   ├── globals.css                     # Design tokens + Tailwind
│   ├── auth/
│   │   ├── layout.tsx                  # Auth layout (split panel)
│   │   ├── login/page.tsx              # Login form
│   │   └── signup/page.tsx             # Signup + email confirmation
│   └── (app)/                          # Protected routes
│       ├── layout.tsx                  # App shell (sidebar + topbar)
│       ├── dashboard/page.tsx          # Dashboard overview
│       ├── chargebacks/
│       │   ├── page.tsx                # Chargebacks list + filters
│       │   ├── new/page.tsx            # Create new chargeback
│       │   └── [id]/page.tsx           # Chargeback detail view
│       ├── analytics/page.tsx          # Charts + KPIs
│       └── settings/page.tsx           # Account settings
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx                 # Navigation sidebar
│   │   └── TopBar.tsx                  # Search + user header
│   ├── chargebacks/
│   │   ├── ChargebackFilters.tsx       # Search + status filter
│   │   └── ChargebackDetailClient.tsx  # Evidence + Timeline UI
│   └── dashboard/
│       └── AnalyticsCharts.tsx         # Recharts visualizations
├── lib/
│   ├── utils.ts                        # Formatters, constants, cn()
│   └── supabase/
│       ├── client.ts                   # Browser Supabase client
│       └── server.ts                   # Server Supabase client
├── types/
│   └── index.ts                        # TypeScript types
└── supabase/
    └── schema.sql                      # Full database schema + RLS
```

---

## 🚀 Quick Setup (15 minutes)

### Step 1: Clone & Install

```bash
git clone <your-repo>
cd chargeback-shield
npm install
```

### Step 2: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → New project
2. Note your **Project URL** and **Anon Key** (Settings → API)

### Step 3: Set Up the Database

1. Go to **Supabase Dashboard → SQL Editor**
2. Copy the entire contents of `supabase/schema.sql`
3. Paste and click **Run**

This creates all tables, indexes, Row Level Security policies, and the storage bucket.

### Step 4: Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 5: Configure Supabase Auth

1. Go to **Supabase → Authentication → URL Configuration**
2. Set **Site URL**: `http://localhost:3000` (dev) or your Vercel URL (prod)
3. Add to **Redirect URLs**: `http://localhost:3000/auth/callback`

### Step 6: Run Locally

```bash
npm run dev
# Open http://localhost:3000
```

---

## 🌐 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Project → Settings → Environment Variables
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) and it auto-deploys on push.

**Important for production:** Update your Supabase Site URL to your Vercel domain.

---

## 🗃️ Database Schema

### Tables

| Table | Purpose |
|-------|---------|
| `user_profiles` | Business name, currency, notification prefs |
| `chargebacks` | Core dispute records with status + reason |
| `timeline_events` | Per-chargeback audit log / history |
| `evidence_files` | Metadata for uploaded evidence files |

### Key Design Decisions

- **Row Level Security (RLS)** on all tables — users can only access their own data
- **Storage bucket** `evidence` with per-user path isolation (`userId/chargebackId/filename`)
- **Signed URLs** for file downloads (expire after 60 seconds for security)
- `updated_at` auto-triggers on chargebacks and user_profiles

---

## 🔧 Component Breakdown

### Pages
| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `app/page.tsx` | Marketing landing page |
| `/auth/login` | `auth/login/page.tsx` | Email/password login |
| `/auth/signup` | `auth/signup/page.tsx` | Account creation |
| `/dashboard` | `(app)/dashboard/page.tsx` | KPI cards + recent chargebacks |
| `/chargebacks` | `(app)/chargebacks/page.tsx` | Filterable list view |
| `/chargebacks/new` | `.../new/page.tsx` | Create chargeback form |
| `/chargebacks/[id]` | `.../[id]/page.tsx` | Detail: edit, evidence, timeline |
| `/analytics` | `(app)/analytics/page.tsx` | Charts and trend data |
| `/settings` | `(app)/settings/page.tsx` | Account preferences |

### Key Client Components
- **`ChargebackDetailClient`** — Tabbed UI (Details / Evidence / Timeline) with real-time Supabase mutations
- **`AnalyticsCharts`** — Recharts area, bar, and pie charts
- **`ChargebackFilters`** — URL-param driven search + status filter

---

## 💰 Make This Look Like a $50k SaaS

Below is a complete design system upgrade guide to take Chargeback Shield from "functional MVP" to "premium product that commands $50k+ ARR."

---

### 1. Typography System

The current setup uses **DM Sans** (clean, modern) paired with **DM Mono** for numbers. To push further:

```css
/* Option A: Editorial authority */
--font-display: 'Syne', sans-serif;       /* Headlines — geometric, authoritative */
--font-body: 'DM Sans', sans-serif;       /* Body — readable, trustworthy */
--font-mono: 'Berkeley Mono', monospace;  /* Numbers — premium feel */

/* Option B: Finance-grade */
--font-display: 'Cabinet Grotesk', sans-serif;
--font-body: 'Instrument Sans', sans-serif;
```

**Rules:**
- Headlines: `font-weight: 800`, tight tracking (`letter-spacing: -0.03em`)
- KPI numbers: tabular-nums, `font-variant-numeric: tabular-nums`
- Labels: ALL-CAPS small text (`0.65rem`, `tracking-wider`, `font-weight: 600`)
- Body: `16px/1.6` minimum line height — never cramped

---

### 2. Color System

**Current palette is solid. Elevate it with:**

```css
/* Trust-building blues (primary) */
--brand-600: #2563eb;  /* Actions, links */
--brand-700: #1d4ed8;  /* Hover states */

/* Financial greens (success) */
--success-600: #16a34a;  /* Revenue recovered, wins */

/* Alert reds (losses) */
--danger-600: #dc2626;   /* Money lost, disputes */

/* Premium neutrals */
--surface-DEFAULT: #ffffff;
--surface-secondary: #f8fafc;    /* Page backgrounds */
--surface-tertiary: #f1f5f9;     /* Input backgrounds */
--ink-DEFAULT: #0f172a;          /* Near-black, not pure black */
--ink-secondary: #475569;        /* Secondary text */
--ink-tertiary: #94a3b8;         /* Placeholder, metadata */
```

**Avoid:** Purple (feels generic AI), pure black (#000), gray-on-gray (low contrast).

---

### 3. Spacing & Layout

**Current cards look good. To go premium:**

- **Consistent 24px padding** on all cards (not 16px)
- **8px grid** for all spacing decisions
- **56px sidebar items** minimum height — more breathing room
- **Dashboard grid:** Max-width `1280px` with `px-8` gutters
- **Section headers** — always paired with a subtitle/description
- **Generous empty states** — centered, illustrated, never just "No data"

---

### 4. Card Design System

```
Normal card:     border + 1px shadow (barely visible)
Hover card:      shadow elevates slightly, -1px Y translate
Active/selected: brand-50 background + brand-200 border
Metric card:     No border — use white on gray bg contrast
Featured card:   brand-600 bg with white text (pricing highlight)
```

**Never use** heavy drop shadows on multiple cards simultaneously — it creates visual noise.

---

### 5. Status Badges

Current implementation is correct. Upgrade with:
- **Animated dot** — pulse animation for `pending` status only
- **Consistent sizing** — always `height: 24px`
- **Full pill shape** — `border-radius: 100px` not `8px`

```tsx
// Add a pulsing dot for pending
{status === 'pending' && (
  <span className="relative flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning-400 opacity-75" />
    <span className="relative inline-flex rounded-full h-2 w-2 bg-warning-500" />
  </span>
)}
```

---

### 6. KPI Cards — Stripe-Level

To match Stripe's dashboard feel:
- **Top label in ALLCAPS** — small, faded, uppercase tracking
- **Large tabular number** — bold, 28-32px
- **Trend indicator** — `↑ 12% from last month` in green/red
- **Icon in top-right** — subtle, secondary background, rounded square

```tsx
<div className="card p-5">
  <div className="flex justify-between items-start mb-4">
    <span className="text-[11px] font-semibold tracking-widest text-ink-tertiary uppercase">
      Win Rate
    </span>
    <div className="w-9 h-9 bg-success-50 rounded-xl flex items-center justify-center">
      <Trophy className="w-5 h-5 text-success-600" />
    </div>
  </div>
  <div className="text-3xl font-bold tabular-nums text-success-700 mb-1">68%</div>
  <div className="flex items-center gap-1 text-xs text-success-600">
    <TrendingUp className="w-3.5 h-3.5" />
    +12% from last month
  </div>
</div>
```

---

### 7. Table Design

Current table is functional. Premium upgrades:
- **Sticky header** with `position: sticky; top: 0; z-index: 10`
- **Row hover** — `bg-brand-50/40` (not gray)
- **Column alignment** — amounts always right-aligned with `tabular-nums`
- **Empty state** per-filter context ("No pending chargebacks" not "No results")
- **Subtle row numbers** or checkboxes for bulk actions
- **Click-anywhere row** navigation — `<tr>` as a Link

---

### 8. Charts & Data Viz

The Recharts implementation is solid. Elevate with:
- **Custom tooltip** — white card, border, rounded corners (already done ✓)
- **Animated on load** — Recharts has `isAnimationActive` — use it
- **Area fill** — gradient fill instead of solid (already done ✓)
- **Axis styling** — remove tick lines, keep grid faint (#f1f5f9)
- **Color consistency** — brand blue for primary data, green for wins, red for losses

**Add a "progress to monthly goal" bar:**
```
Revenue protected this month: $4,200 / $6,000 goal
████████████████░░░░ 70%
```

---

### 9. Micro-Interactions

These 5 micro-interactions make the UI feel alive:

```css
/* 1. Button press feedback */
.btn:active { transform: scale(0.98); }

/* 2. Card hover lift */
.card-hover:hover { transform: translateY(-2px); box-shadow: ...; }

/* 3. Input focus glow */
.input:focus { box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); }

/* 4. Status badge pulse (pending only) */
/* See above — Tailwind animate-ping */

/* 5. Page transition */
.page-enter { animation: slideUp 0.2s ease-out; }
```

---

### 10. Empty States — Make Them Delightful

Weak: `"No chargebacks found."`

Strong:
```tsx
<div className="py-20 text-center">
  <div className="relative w-16 h-16 mx-auto mb-5">
    <div className="absolute inset-0 bg-success-100 rounded-2xl rotate-6" />
    <div className="absolute inset-0 bg-success-50 rounded-2xl flex items-center justify-center">
      <ShieldCheck className="w-8 h-8 text-success-500" />
    </div>
  </div>
  <h3 className="text-lg font-bold text-ink mb-2">Your books are clean!</h3>
  <p className="text-sm text-ink-secondary max-w-xs mx-auto mb-6">
    No chargebacks match your current filters. That might actually be great news.
  </p>
  <button className="btn-secondary">Clear filters</button>
</div>
```

---

### 11. Navigation Upgrades

- **Active indicator** — left-side 3px border on active nav item (more premium than bg highlight)
- **Breadcrumbs** — on detail pages: `Chargebacks / Sarah Johnson`
- **Keyboard shortcut hints** — `⌘K` for search in top bar
- **Command palette** — power-user search (future feature signal)

---

### 12. Loading States

Never show blank pages. Use skeleton loading:

```tsx
function CardSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="shimmer h-3 w-20 rounded" />
      <div className="shimmer h-8 w-28 rounded" />
      <div className="shimmer h-3 w-16 rounded" />
    </div>
  )
}
```

The `shimmer` CSS animation is included in `globals.css`.

---

### 13. "Investor-Ready" Dashboard Page

Structure the dashboard like this for maximum authority:

```
┌─────────────────────────────────────────────────────────┐
│  Good morning, [Business Name]          [+ Add Dispute] │
│  Here's your chargeback activity for June 2024          │
├──────────┬──────────┬──────────┬────────────────────────┤
│ Total    │ Lost     │ Recovered│ Win Rate               │
│ 127      │ $8,420   │ $12,340  │ 68% ↑12%              │
├──────────┴──────────┴──────────┴────────────────────────┤
│ ⚠ 3 disputes need attention before July 15              │
├─────────────────────────────┬───────────────────────────┤
│ Recent Chargebacks          │ Quick Stats               │
│ [table]                     │ Most common: Unauthorized │
│                             │ Avg amount: $184          │
│                             │ Best month: March (82%)   │
└─────────────────────────────┴───────────────────────────┘
```

---

### 14. What to Remove for Premium Feel

❌ **Remove:**
- Generic "Dashboard" H1 on every page (use contextual greetings)
- Blue on blue CTAs (choose one primary blue, use it sparingly)
- Icons without labels in navigation (always show text on desktop)
- Placeholder text like "Coming soon" — either build it or hide it
- Generic success toasts with no context ("Saved!" → "Changes to Sarah Johnson's dispute saved")
- Heavy drop shadows on multiple cards simultaneously
- Comic Sans / system fonts anywhere

✅ **Add:**
- Contextual page subtitles on every screen
- "Last updated" timestamps on dynamic data
- Keyboard shortcuts (arrow keys in tables, Esc to close modals)
- Subtle page transitions between routes
- "Copied!" micro-feedback on clickable values
- Consistent icon weight (all `stroke-width: 1.5` via lucide)

---

### 15. Color Psychology for Finance/Trust

| Color | Use Case | Avoid |
|-------|----------|-------|
| **Deep Blue** `#1d4ed8` | Primary actions, links, CTAs | Headers, backgrounds |
| **Clean Green** `#16a34a` | Revenue recovered, won disputes | Decorative use |
| **Warm Red** `#dc2626` | Lost disputes, money at risk | Alerts that aren't urgent |
| **Amber** `#d97706` | Pending, needs attention | Success states |
| **Near-black** `#0f172a` | Primary text | Pure `#000000` |
| **Cool gray** `#f8fafc` | Page backgrounds | White (#fff) for backgrounds |

**Rule:** Use color to communicate meaning, not for decoration. Every color choice should be answerable with "this color means X."

---

## 🔮 Roadmap to $50k ARR

After MVP, these features unlock growth:

1. **CSV Import** — Import existing chargeback history from spreadsheets
2. **Response Template Library** — Pre-written evidence letters per dispute type
3. **Deadline Tracker** — Countdown timers with escalating urgency (30→15→5 days)
4. **Team Access** — Invite team members with role-based permissions
5. **Zapier/Make Integration** — Connect to Shopify, Stripe, PayPal for auto-logging
6. **PDF Evidence Package** — One-click export of all evidence for submission
7. **Win Rate Benchmarks** — "You're in the top 20% of stores in your category"
8. **Bulk Actions** — Select multiple chargebacks, bulk update status
9. **Mobile App** — React Native or PWA for on-the-go dispute management

---

## 📄 License

MIT — use freely, modify, ship.
