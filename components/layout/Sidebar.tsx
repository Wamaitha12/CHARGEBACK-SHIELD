'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ShieldCheck,
  LayoutDashboard,
  FileWarning,
  BarChart3,
  Settings,
  LogOut,
  Zap,
  FileText,
  Lock,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard',   icon: LayoutDashboard, label: 'Revenue Protection' },
  { href: '/chargebacks', icon: FileWarning,      label: 'Active Disputes'   },
  { href: '/analytics',   icon: BarChart3,        label: 'Revenue Insights'  },
  { href: '/templates',   icon: FileText,         label: 'Templates'         },
  { href: '/settings',    icon: Settings,         label: 'Settings'          },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="w-60 flex-shrink-0 bg-surface border-r border-surface-border flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2.5 px-4 border-b border-surface-border">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-ink tracking-tight">Chargeback Shield</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${active ? 'active' : 'text-ink-secondary'}`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Trust badges */}
      <div className="px-4 pb-3 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-ink-tertiary">
          <Lock className="w-3 h-3 text-success-500" />
          <span>Encrypted document storage</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-ink-tertiary">
          <ShieldCheck className="w-3 h-3 text-success-500" />
          <span>Business data protected</span>
        </div>
      </div>

      {/* Upgrade CTA */}
      <div className="p-3 border-t border-surface-border">
        <div className="bg-brand-50 dark:bg-brand-950/40 rounded-xl p-4 mb-3 border border-brand-100 dark:border-brand-900/60">
          <div className="flex items-center gap-1.5 mb-2">
            <Zap className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span className="text-xs font-semibold text-brand-700 dark:text-brand-400">Upgrade to Pro</span>
          </div>
          <p className="text-xs text-brand-600/80 dark:text-brand-400/70 mb-3 leading-relaxed">
            Unlimited disputes, revenue insights & Shopify auto-import.
          </p>
          <Link href="/#pricing" className="w-full btn-primary btn-sm justify-center py-1.5">
            Upgrade · from $29/mo
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="sidebar-item text-ink-secondary w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
