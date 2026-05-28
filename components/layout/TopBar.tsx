'use client'

import { Bell, Search } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import { UserProfile } from '@/types'
import ThemeToggle from '@/components/ThemeToggle'

interface TopBarProps {
  user: User | null
  profile: UserProfile | null
}

export default function TopBar({ user, profile }: TopBarProps) {
  const initials = profile?.business_name
    ? profile.business_name.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? 'U'

  const displayName = profile?.business_name || user?.email?.split('@')[0] || 'User'

  return (
    <header className="h-16 bg-surface border-b border-surface-border flex items-center px-6 gap-4 flex-shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
        <input
          type="text"
          placeholder="Search chargebacks, customers..."
          className="input pl-9 pr-4 py-2 bg-surface-secondary focus:bg-surface"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Theme toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <button className="btn-ghost relative w-9 h-9 p-0">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-surface-border">
          <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/50 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-brand-700 dark:text-brand-300">{initials}</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-ink leading-none mb-0.5">{displayName}</div>
            <div className="text-xs text-ink-tertiary">Free plan</div>
          </div>
        </div>
      </div>
    </header>
  )
}
