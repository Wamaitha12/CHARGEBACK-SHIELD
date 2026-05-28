import Link from 'next/link'
import {
  CheckCircle2, X, Zap, ShieldCheck, BarChart3,
  FileText, Users, Download, Lock,
} from 'lucide-react'

const FREE_FEATURES = [
  { label: 'Up to 5 disputes/month',      included: true  },
  { label: 'Basic dispute tracking',      included: true  },
  { label: 'Evidence uploads',            included: true  },
  { label: '3 response templates',        included: true  },
  { label: 'Email support',               included: true  },
  { label: 'Unlimited disputes',          included: false },
  { label: 'Revenue insights',            included: false },
  { label: 'Full template library',       included: false },
  { label: 'Advanced analytics',          included: false },
  { label: 'Shopify auto-import',         included: false },
  { label: 'Team members',               included: false },
  { label: 'Priority support',            included: false },
]

const PRO_FEATURES = [
  { label: 'Unlimited disputes',          included: true },
  { label: 'Revenue insights',            included: true },
  { label: 'Full analytics dashboard',    included: true },
  { label: 'Full template library',       included: true },
  { label: 'Shopify auto-import',         included: true },
  { label: 'Priority support',            included: true },
  { label: 'Team members (3 seats)',      included: false },
  { label: 'Advanced reporting',          included: false },
  { label: 'PDF export',                  included: false },
  { label: 'Custom reason codes',         included: false },
  { label: 'Dedicated account manager',   included: false },
  { label: 'SLA guarantee',               included: false },
]

const highlights = [
  { icon: ShieldCheck, label: 'Revenue Protected', desc: 'Full visibility into every dispute' },
  { icon: BarChart3,   label: 'Revenue Insights',  desc: 'Trends, patterns, and loss analysis' },
  { icon: FileText,    label: 'Template Library',  desc: '10+ pre-built response templates' },
  { icon: Users,       label: 'Team Access',       desc: 'Collaborate with your ops team' },
  { icon: Download,    label: 'PDF Export',        desc: 'Export dispute reports instantly' },
  { icon: Lock,        label: 'Secure Storage',    desc: 'Enterprise-grade encryption' },
]

export default function UpgradePage() {
  return (
    <div className="max-w-4xl animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Plans & Pricing</h1>
        <p className="text-ink-secondary text-sm mt-0.5">Choose the plan that fits your business</p>
      </div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Free */}
        <div className="card p-7 flex flex-col">
          <div className="mb-6">
            <div className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-2">Current Plan</div>
            <div className="text-3xl font-bold text-ink mb-1">Starter</div>
            <div className="text-ink-secondary text-sm">For merchants just getting started</div>
          </div>

          <div className="space-y-2.5 flex-1 mb-7">
            {FREE_FEATURES.map(f => (
              <div key={f.label} className="flex items-center gap-2.5">
                {f.included
                  ? <CheckCircle2 className="w-4 h-4 text-success-500 flex-shrink-0" />
                  : <X className="w-4 h-4 text-ink-placeholder flex-shrink-0" />
                }
                <span className={`text-sm ${f.included ? 'text-ink' : 'text-ink-tertiary line-through'}`}>
                  {f.label}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-surface-secondary border border-surface-border px-4 py-3 text-sm text-ink-secondary text-center">
            You're on the Free plan
          </div>
        </div>

        {/* Pro */}
        <div className="relative rounded-2xl bg-brand-600 border border-brand-600 p-7 flex flex-col shadow-xl shadow-brand-200/40">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-warning-500 text-white text-xs font-bold px-4 py-1 rounded-full">
            Most Popular
          </div>

          <div className="mb-6">
            <div className="text-xs font-semibold text-brand-200 uppercase tracking-wider mb-2">Growth Plan</div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-bold text-white">$29</span>
              <span className="text-brand-300 text-sm">/month</span>
            </div>
            <div className="text-brand-200 text-sm">For stores handling disputes regularly</div>
          </div>

          <div className="space-y-2.5 flex-1 mb-7">
            {PRO_FEATURES.map(f => (
              <div key={f.label} className="flex items-center gap-2.5">
                {f.included
                  ? <CheckCircle2 className="w-4 h-4 text-brand-200 flex-shrink-0" />
                  : <X className="w-4 h-4 text-brand-400/60 flex-shrink-0" />
                }
                <span className={`text-sm ${f.included ? 'text-brand-100' : 'text-brand-400/70 line-through'}`}>
                  {f.label}
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/#pricing"
            className="w-full inline-flex items-center justify-center gap-2 bg-white text-brand-600 font-semibold px-6 py-3 rounded-xl hover:bg-brand-50 transition-colors shadow-md"
          >
            <Zap className="w-4 h-4" />
            Upgrade to Pro
          </Link>
          <p className="text-brand-300 text-xs text-center mt-3">14-day free trial · Cancel anytime</p>
        </div>

      </div>

      {/* Pro highlights */}
      <div className="card p-6">
        <h2 className="font-semibold text-ink mb-5">What you unlock with Pro</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {highlights.map(h => (
            <div key={h.label} className="flex items-start gap-3 p-3 rounded-xl bg-surface-secondary border border-surface-border">
              <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <h.icon className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-ink">{h.label}</div>
                <div className="text-xs text-ink-tertiary mt-0.5">{h.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enterprise teaser */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 flex items-center justify-between gap-4">
        <div>
          <div className="font-semibold text-ink mb-0.5">Need more? Enterprise plan available</div>
          <div className="text-sm text-ink-secondary">Custom integrations, dedicated support, SLA guarantee, and team seats for large merchants.</div>
        </div>
        <Link href="/contact" className="btn-secondary flex-shrink-0">
          Contact Sales
        </Link>
      </div>
    </div>
  )
}
