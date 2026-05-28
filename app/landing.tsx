'use client'

import Link from 'next/link'
import {
  ShieldCheck, TrendingUp, FileText, Clock, BarChart3,
  CheckCircle2, ArrowRight, Zap, Star, Trophy, Search,
  ArrowUpRight, Package, DollarSign, Timer, CreditCard,
  AlertTriangle, X, ShoppingBag,
} from 'lucide-react'

// ─── Data ────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Revenue Protection Center',
    description: 'See your risk score, recovered revenue, active disputes, and business health metrics in one place.',
    iconBg: 'bg-blue-50', iconColor: 'text-blue-600', tag: 'Core feature',
  },
  {
    icon: FileText,
    title: 'Evidence Management',
    description: 'Attach receipts, order confirmations, tracking info, and screenshots to each case so nothing is lost.',
    iconBg: 'bg-orange-50', iconColor: 'text-orange-500', tag: null,
  },
  {
    icon: Clock,
    title: 'Dispute Timeline Tracking',
    description: 'Follow every case from opened → evidence submitted → final outcome. Never miss a response deadline.',
    iconBg: 'bg-violet-50', iconColor: 'text-violet-600', tag: null,
  },
  {
    icon: TrendingUp,
    title: 'Revenue Insights & Reports',
    description: 'See patterns, dispute reasons, and exactly where your business is losing money month over month.',
    iconBg: 'bg-green-50', iconColor: 'text-green-600', tag: null,
  },
]

const HIDDEN_COSTS = [
  { icon: Package,     label: 'Lost product cost',             desc: 'You lose the item and the sale' },
  { icon: ArrowUpRight, label: 'Lost shipping cost',           desc: 'Fulfillment costs aren\'t refunded' },
  { icon: CreditCard,  label: 'Processing fees',               desc: 'Banks charge dispute fees on top' },
  { icon: Timer,       label: 'Hours collecting evidence',     desc: 'Manual work per case adds up fast' },
  { icon: AlertTriangle, label: 'Missed response deadlines',   desc: 'Auto-loss if you don\'t respond in time' },
  { icon: DollarSign,  label: 'Payment processor risk',        desc: 'High rates trigger fees or account holds' },
]

const PRICING = [
  {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    description: 'For merchants just getting started',
    features: [
      'Up to 5 disputes/month',
      'Basic dispute tracking',
      'Evidence uploads',
      '3 response templates',
      'Email support',
    ],
    cta: 'Start Free',
    highlighted: false,
    badge: null,
  },
  {
    name: 'Growth',
    price: '$29',
    period: 'per month',
    description: 'For stores handling disputes regularly',
    features: [
      'Unlimited disputes',
      'Revenue insights',
      'Full analytics dashboard',
      'Full template library',
      'Shopify auto-import',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Scale',
    price: '$79',
    period: 'per month',
    description: 'For high-volume operations',
    features: [
      'Everything in Growth',
      'Team members (3 seats)',
      'Advanced reporting',
      'PDF export',
      'Custom reason codes',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
    badge: null,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For large merchants and agencies',
    features: [
      'Everything in Scale',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
      'Unlimited team seats',
      'Onboarding support',
    ],
    cta: 'Contact Sales',
    highlighted: false,
    badge: null,
  },
]

const TESTIMONIALS = [
  {
    quote: 'Chargebacks used to be scattered across emails and spreadsheets. Now everything is organized in one place and I actually know what\'s happening.',
    author: 'Sarah K.',
    role: 'Founder, Luxe Skin Co.',
    stars: 5,
    initials: 'SK',
    color: 'bg-pink-100 text-pink-700',
    metric: '80% win rate',
  },
  {
    quote: 'We stopped losing track of deadlines the moment we switched. The revenue risk score alone changed how our team prioritizes cases.',
    author: 'Marcus T.',
    role: 'Head of Ops, TechGear Store',
    stars: 5,
    initials: 'MT',
    color: 'bg-blue-100 text-blue-700',
    metric: '$14,200 recovered',
  },
  {
    quote: 'I had no idea how much we were losing until I saw the revenue insights. Within 30 days we\'d recovered more than the annual plan costs.',
    author: 'Amara N.',
    role: 'E-commerce Director, StyleHub',
    stars: 5,
    initials: 'AN',
    color: 'bg-violet-100 text-violet-700',
    metric: '3× faster responses',
  },
]

// ─── Page ────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Announcement bar */}
      <div className="bg-brand-600 text-white text-center py-2.5 px-4 text-sm font-medium">
        Every unresolved chargeback is silent revenue loss.{' '}
        <Link href="/auth/signup" className="underline underline-offset-2 font-semibold hover:text-brand-100 transition-colors">
          Start protecting your store free →
        </Link>
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-ink text-lg tracking-tight">Chargeback Shield</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-secondary">
            <a href="#how-it-works" className="hover:text-ink transition-colors">How it works</a>
            <a href="#features"     className="hover:text-ink transition-colors">Features</a>
            <a href="#pricing"      className="hover:text-ink transition-colors">Pricing</a>
            <Link href="/calculator" className="hover:text-ink transition-colors">Calculator</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login"  className="btn-ghost text-sm font-medium px-4 py-2 rounded-lg hidden sm:block">Sign in</Link>
            <Link href="/auth/signup" className="btn-primary text-sm">
              Start Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-20 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 via-white to-white pointer-events-none" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none opacity-50"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 65%)', transform: 'translate(25%, -25%)' }} />

        <div className="max-w-6xl mx-auto relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-7">
              <ShoppingBag className="w-3.5 h-3.5" />
              Built for Shopify merchants &amp; online businesses
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-ink leading-[1.08] tracking-tight mb-6">
              Stop Chargebacks From{' '}
              <span className="relative inline-block text-brand-600">
                Quietly Draining
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 380 8" fill="none">
                  <path d="M2 5.5C65 2.5 130 1 190 2.5C250 4 315 5.5 378 3" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" opacity="0.4"/>
                </svg>
              </span>{' '}
              Your Store Revenue
            </h1>

            <p className="text-xl text-ink-secondary leading-relaxed mb-8 max-w-2xl">
              Lost products, shipping costs, processing fees, and missed deadlines add up fast.
              Chargeback Shield gives you visibility into every dispute before small losses become expensive problems.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <Link href="/auth/signup" className="btn-primary btn-lg">
                Start Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/dashboard" className="btn-secondary btn-lg">
                View Demo
              </Link>
            </div>

            <p className="text-sm text-ink-tertiary">
              No credit card required · Setup in minutes · Built for Shopify merchants
            </p>
            <p className="text-sm text-ink-tertiary mt-1.5">
              Not sure of your exposure?{' '}
              <Link href="/calculator" className="text-brand-600 font-medium hover:underline underline-offset-2">
                Calculate your yearly chargeback loss →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── Dashboard Preview ─────────────────────────────────── */}
      <section className="pb-16 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-7">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-widest bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              Revenue Protection Center
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden">
            {/* Browser chrome */}
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 max-w-xs mx-auto bg-white rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-400 text-center font-mono">
                app.chargebackshield.com
              </div>
            </div>

            {/* App shell */}
            <div className="flex bg-slate-50" style={{ minHeight: 400 }}>
              {/* Mini sidebar */}
              <div className="hidden md:flex flex-col w-44 bg-white border-r border-slate-100 p-4 gap-1 flex-shrink-0">
                <div className="flex items-center gap-2 px-2 py-2 mb-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-bold text-slate-800">Shield</span>
                </div>
                {[
                  { label: 'Revenue Protection', active: true },
                  { label: 'Active Disputes',    active: false },
                  { label: 'Revenue Insights',   active: false },
                  { label: 'Templates',          active: false },
                ].map(item => (
                  <div key={item.label} className={`px-3 py-2 rounded-lg text-xs font-medium ${item.active ? 'bg-blue-50 text-blue-700' : 'text-slate-500'}`}>
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="flex-1 p-5 space-y-4 min-w-0">
                {/* KPI cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Active Disputes',    val: '127', sub: '+12 this month',      accent: 'border-l-slate-400',   valColor: 'text-slate-800' },
                    { label: 'Win Rate',           val: '80%', sub: '↑ 6% vs last month',  accent: 'border-l-blue-400',    valColor: 'text-blue-600'  },
                    { label: 'Revenue Protected',  val: '$18,340', sub: 'from won disputes', accent: 'border-l-green-400',  valColor: 'text-green-700' },
                    { label: 'Revenue at Risk',    val: '$2,840', sub: '7 pending response', accent: 'border-l-amber-400',  valColor: 'text-amber-700' },
                  ].map(card => (
                    <div key={card.label} className={`bg-white rounded-xl border border-slate-100 border-l-4 ${card.accent} p-3.5`}>
                      <div className="text-xs text-slate-400 mb-1">{card.label}</div>
                      <div className={`text-xl font-bold tabular-nums ${card.valColor}`}>{card.val}</div>
                      <div className="text-xs text-slate-400 mt-1">{card.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Recent disputes */}
                <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <span className="text-sm font-semibold text-slate-800">Recent Active Disputes</span>
                    <span className="text-xs text-blue-600 font-medium flex items-center gap-1">View all <ArrowUpRight className="w-3 h-3" /></span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {[
                      { name: 'Sarah Johnson', amount: '$249', reason: 'Item Not Received', Icon: Trophy, status: 'Won',          pill: 'bg-green-50 text-green-700 border border-green-200' },
                      { name: 'James Liu',     amount: '$89',  reason: 'Unauthorized',      Icon: Search, status: 'Under Review', pill: 'bg-blue-50 text-blue-700 border border-blue-200' },
                      { name: 'Emma Davis',    amount: '$450', reason: 'Not as Described',  Icon: Clock,  status: 'Pending',       pill: 'bg-amber-50 text-amber-700 border border-amber-200' },
                    ].map(row => (
                      <div key={row.name} className="flex items-center gap-3 px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-blue-700">{row.name[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-slate-800 truncate">{row.name}</div>
                          <div className="text-xs text-slate-400 truncate">{row.reason}</div>
                        </div>
                        <div className="text-sm font-bold text-slate-800 tabular-nums flex-shrink-0">{row.amount}</div>
                        <span className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${row.pill}`}>
                          <row.Icon className="w-3 h-3" />{row.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Hidden Cost of Chargebacks ────────────────────────── */}
      <section className="py-20 px-6 bg-slate-950 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-full mb-5">
              <AlertTriangle className="w-3.5 h-3.5" />
              The real damage
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">The Hidden Cost Of Chargebacks</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Each dispute isn't just a lost sale. The actual cost is 2–3× the transaction value once you add everything up.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {HIDDEN_COSTS.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-4 bg-white/5 hover:bg-white/8 border border-white/10 rounded-2xl p-5 transition-colors">
                <div className="w-10 h-10 bg-amber-400/10 border border-amber-400/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white mb-1">{label}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center rounded-2xl bg-white/5 border border-white/10 px-8 py-6 max-w-2xl mx-auto">
            <p className="text-slate-300 leading-relaxed text-base">
              When disputes pile up without a system, they quietly erode your margins.
              Chargeback Shield gives you the visibility to act before small losses compound.
            </p>
            <Link href="/calculator" className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors">
              Calculate your yearly chargeback exposure →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Before / After ───────────────────────────────────── */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-widest bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-full mb-4">
              The difference
            </div>
            <h2 className="text-4xl font-bold text-ink mb-3">From Chaos To Revenue Visibility</h2>
            <p className="text-ink-secondary text-lg">Most merchants are still managing disputes the hard way.</p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-5">

            {/* ── Before ── */}
            <div className="relative rounded-3xl overflow-hidden border border-red-200 bg-white shadow-sm">
              {/* Top colour band */}
              <div className="h-2 w-full bg-gradient-to-r from-red-400 to-rose-500" />

              <div className="p-8">
                {/* Label */}
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
                    <X className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Before Chargeback Shield</p>
                    <p className="text-lg font-bold text-slate-800 leading-tight mt-0.5">Chaos & Guesswork</p>
                  </div>
                </div>

                {/* Rows */}
                <ul className="space-y-2">
                  {[
                    { pain: 'Disputes tracked in spreadsheets',       sub: 'One misclick and data is lost' },
                    { pain: 'Evidence scattered across email threads', sub: 'Hours spent searching every case' },
                    { pain: 'Missed response deadlines',               sub: 'Auto-loss with no warning' },
                    { pain: 'No idea of total revenue impact',         sub: 'Losses invisible until it\'s too late' },
                    { pain: 'Evidence hunting per case',               sub: 'Starts from scratch every time' },
                    { pain: 'No win/loss pattern visibility',          sub: 'Can\'t improve what you can\'t see' },
                  ].map(({ pain, sub }) => (
                    <li key={pain} className="flex items-start gap-3 rounded-xl bg-red-50/60 border border-red-100 px-4 py-3">
                      <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <X className="w-3 h-3 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700 leading-snug">{pain}</p>
                        <p className="text-xs text-red-500 mt-0.5">{sub}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── After ── */}
            <div className="relative rounded-3xl overflow-hidden border border-emerald-200 bg-white shadow-sm">
              {/* Top colour band */}
              <div className="h-2 w-full bg-gradient-to-r from-emerald-400 to-green-500" />

              <div className="p-8">
                {/* Label */}
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">After Chargeback Shield</p>
                    <p className="text-lg font-bold text-slate-800 leading-tight mt-0.5">Clarity & Control</p>
                  </div>
                </div>

                {/* Rows */}
                <ul className="space-y-2">
                  {[
                    { win: 'All disputes in one dashboard',          sub: 'Every case tracked and visible' },
                    { win: 'Evidence attached per dispute case',     sub: 'Zero hunting, everything organised' },
                    { win: 'Deadline tracking & timeline view',      sub: 'Never miss a response window' },
                    { win: 'Revenue recovered & risk score visible', sub: 'Know exactly what you\'ve protected' },
                    { win: 'Response templates ready to use',        sub: 'Copy, customise, and submit fast' },
                    { win: 'Win rate & revenue trend insights',      sub: 'Improve strategy with real data' },
                  ].map(({ win, sub }) => (
                    <li key={win} className="flex items-start gap-3 rounded-xl bg-emerald-50/60 border border-emerald-100 px-4 py-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700 leading-snug">{win}</p>
                        <p className="text-xs text-emerald-600 mt-0.5">{sub}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Bottom CTA nudge */}
          <div className="mt-10 text-center">
            <Link href="/auth/signup" className="inline-flex items-center gap-2 btn-primary btn-lg">
              Start protecting revenue free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-ink-tertiary mt-3">No credit card required · Setup in minutes</p>
          </div>
        </div>
      </section>

      {/* ── Shopify Integration ───────────────────────────────── */}
      <section className="py-24 px-6 bg-surface-secondary">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-widest bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-full mb-6">
                <ShoppingBag className="w-3.5 h-3.5" />
                Shopify integration
              </div>
              <h2 className="text-4xl font-bold text-ink mb-5">Connect Your Shopify Store In Minutes</h2>
              <p className="text-ink-secondary text-lg mb-6 leading-relaxed">
                Automatically import disputes directly from Shopify so your team stays organized without manual entry.
                Every new dispute appears in your dashboard the moment it's opened.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Auto-import from Shopify webhooks',
                  'Order details pulled automatically',
                  'Zero manual data entry required',
                  'Instant dispute notifications',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-ink-secondary">
                    <CheckCircle2 className="w-4 h-4 text-success-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="btn-primary">
                Connect Shopify Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Flow diagram */}
            <div className="space-y-3">
              {[
                { icon: ShoppingBag, label: 'Shopify Store',       sub: 'Dispute is opened by a customer',         color: 'bg-orange-50 border-orange-200', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
                { icon: Zap,         label: 'Disputes Imported',   sub: 'Auto-synced to your dashboard via webhook', color: 'bg-brand-50 border-brand-200',  iconBg: 'bg-brand-100',  iconColor: 'text-brand-600'  },
                { icon: FileText,    label: 'Evidence Organized',  sub: 'Case file created, attach your evidence',   color: 'bg-violet-50 border-violet-200', iconBg: 'bg-violet-100', iconColor: 'text-violet-600' },
                { icon: ShieldCheck, label: 'Revenue Protected',   sub: 'Submit response, track outcome, win',       color: 'bg-success-50 border-success-200', iconBg: 'bg-success-100', iconColor: 'text-success-600' },
              ].map((step, i, arr) => (
                <div key={step.label}>
                  <div className={`flex items-center gap-4 rounded-2xl border p-4 ${step.color}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${step.iconBg}`}>
                      <step.icon className={`w-5 h-5 ${step.iconColor}`} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ink">{step.label}</div>
                      <div className="text-xs text-ink-tertiary mt-0.5">{step.sub}</div>
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex justify-center my-1">
                      <div className="w-px h-4 bg-surface-border" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-widest bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-full mb-4">
              Simple process
            </div>
            <h2 className="text-4xl font-bold text-ink mb-3">How It Works</h2>
            <p className="text-ink-secondary text-lg">Up and running in minutes, not days.</p>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-12 bottom-12 w-px bg-surface-border hidden md:block" />
            <div className="space-y-6">
              {[
                { step: '01', title: 'Add Disputes',     desc: 'Log disputes manually or connect Shopify to auto-import every new case the moment it\'s opened.', color: 'bg-blue-600' },
                { step: '02', title: 'Organize Evidence', desc: 'Attach receipts, order confirmations, tracking details, and screenshots to each dispute case file.', color: 'bg-violet-600' },
                { step: '03', title: 'Protect Revenue',   desc: 'Track outcomes, monitor your win rate, and see exactly how much revenue you\'ve protected over time.', color: 'bg-green-600' },
              ].map(item => (
                <div key={item.step} className="flex gap-6 items-start">
                  <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <span className="text-white font-bold text-lg">{item.step}</span>
                  </div>
                  <div className="flex-1 bg-surface border border-surface-border rounded-2xl p-6 hover:border-brand-200 hover:shadow-card transition-all duration-200">
                    <h3 className="text-lg font-semibold text-ink mb-2">{item.title}</h3>
                    <p className="text-ink-secondary leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 bg-surface-secondary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59,130,246,0.05) 0%, transparent 70%)' }} />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-widest bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-full mb-4">
              <Zap className="w-3.5 h-3.5" />
              Revenue protection platform
            </div>
            <h2 className="text-4xl font-bold text-ink mb-4">Everything You Need To Stay In Control</h2>
            <p className="text-lg text-ink-secondary">One platform to stop revenue loss from disputes — built for the way real merchants operate.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {FEATURES.map(feature => (
              <div key={feature.title} className="group relative bg-surface rounded-2xl border border-surface-border p-7 hover:border-brand-200 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 flex gap-5">
                {feature.tag && (
                  <span className="absolute top-4 right-4 text-xs font-semibold text-brand-600 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded-full">{feature.tag}</span>
                )}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${feature.iconBg} group-hover:scale-110 transition-transform duration-200`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-ink mb-2 text-base">{feature.title}</h3>
                  <p className="text-sm text-ink-secondary leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section id="testimonials" className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-widest bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-full mb-4">
              <Star className="w-3.5 h-3.5 fill-brand-400 text-brand-400" />
              Customer stories
            </div>
            <h2 className="text-4xl font-bold text-ink mb-3">Trusted by merchants serious about protecting revenue</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.author} className="group relative bg-surface rounded-2xl border border-surface-border p-7 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col">
                <div className="absolute top-5 right-6 text-5xl font-serif text-brand-100 leading-none select-none">"</div>
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning-400 text-warning-400" />
                  ))}
                </div>
                <p className="text-ink text-sm leading-relaxed flex-1 mb-4">{t.quote}</p>
                <div className="inline-flex items-center gap-1.5 self-start bg-success-50 border border-success-200 text-success-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-5">
                  <TrendingUp className="w-3 h-3" />{t.metric}
                </div>
                <div className="flex items-center gap-3 pt-5 border-t border-surface-border">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${t.color}`}>{t.initials}</div>
                  <div>
                    <div className="text-sm font-semibold text-ink">{t.author}</div>
                    <div className="text-xs text-ink-tertiary">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust bar */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-10 text-sm text-ink-tertiary border-t border-surface-border pt-10">
            {[
              { val: '2,400+', label: 'merchants protected' },
              { val: '80%',    label: 'avg win rate' },
              { val: '$2.4M',  label: 'revenue protected monthly' },
              { val: '< 5 min', label: 'average setup time' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="font-bold text-ink text-base">{s.val}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 bg-surface-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-widest bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-full mb-4">
              Pricing
            </div>
            <h2 className="text-4xl font-bold text-ink mb-4">Start free, scale as you grow</h2>
            <p className="text-lg text-ink-secondary">No hidden fees. No long-term contracts. Cancel any time.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
            {PRICING.map(plan => (
              <div key={plan.name} className={`rounded-2xl border p-7 relative flex flex-col ${
                plan.highlighted
                  ? 'bg-brand-600 border-brand-600 text-white shadow-2xl shadow-brand-200/40 scale-[1.02]'
                  : 'bg-surface border-surface-border shadow-card'
              }`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-warning-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}
                <div className={`text-xs font-semibold mb-2 uppercase tracking-wider ${plan.highlighted ? 'text-brand-200' : 'text-ink-tertiary'}`}>{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-3xl font-bold ${plan.highlighted ? 'text-white' : 'text-ink'}`}>{plan.price}</span>
                  {plan.price !== 'Custom' && <span className={`text-sm ${plan.highlighted ? 'text-brand-200' : 'text-ink-tertiary'}`}>/{plan.period}</span>}
                </div>
                <p className={`text-sm mb-6 ${plan.highlighted ? 'text-brand-200' : 'text-ink-secondary'}`}>{plan.description}</p>
                <Link href={plan.name === 'Enterprise' ? '/contact' : '/auth/signup'}
                  className={`btn w-full justify-center mb-7 ${
                    plan.highlighted
                      ? 'bg-white text-brand-600 hover:bg-brand-50 font-semibold'
                      : plan.name === 'Enterprise'
                      ? 'btn-secondary'
                      : 'btn-primary'
                  }`}>
                  {plan.cta}
                </Link>
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? 'text-brand-200' : 'text-success-500'}`} />
                      <span className={plan.highlighted ? 'text-brand-100' : 'text-ink-secondary'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-950">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Stop Letting Chargebacks Quietly Drain Revenue
          </h2>
          <p className="text-xl text-slate-400 mb-10">
            Get visibility, organization, and control over every dispute — starting today.
          </p>
          <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors shadow-lg text-base">
            Start Free — No Card Required
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-slate-500 text-sm mt-4">Set up your account in minutes. Shopify integration included.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-ink" />
              </div>
              <span className="text-white font-semibold">Chargeback Shield</span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-slate-400">
              <Link href="/calculator" className="hover:text-white transition-colors">Loss Calculator</Link>
              <Link href="/privacy"    className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms"      className="hover:text-white transition-colors">Terms</Link>
              <Link href="/contact"    className="hover:text-white transition-colors">Contact</Link>
            </div>
            <p className="text-slate-500 text-sm">© 2025 Chargeback Shield. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
