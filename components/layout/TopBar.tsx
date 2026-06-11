'use client'

import { Bell, Menu } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import { UserProfile } from '@/types'
import ThemeToggle from '@/components/ThemeToggle'

interface TopBarProps {
  user: User | null
  profile: UserProfile | null
  onMenuClick?: () => void
}

export default function TopBar({ user, profile, onMenuClick }: TopBarProps) {
  const initials = profile?.business_name
    ? profile.business_name.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? 'U'

  const displayName = profile?.business_name || user?.email?.split('@')[0] || 'User'

  return (
    <header className="h-14 sm:h-16 bg-surface border-b border-surface-border flex items-center px-3 sm:px-6 gap-3 flex-shrink-0">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden btn-ghost w-9 h-9 p-0 flex items-center justify-center flex-shrink-0"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Brand name on mobile (when sidebar is hidden) */}
      <span className="lg:hidden font-semibold text-ink text-sm tracking-tight">
        Chargeback Shield
      </span>

      {/* Spacer to push right-side items */}
      <div className="flex-1" />

      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Theme toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <button className="btn-ghost relative w-9 h-9 p-0 flex items-center justify-center">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-surface-border">
          <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/50 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-brand-700 dark:text-brand-300">{initials}</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-ink leading-none mb-0.5 max-w-[120px] truncate">{displayName}</div>
            <div className="text-xs text-ink-tertiary">Free plan</div>
          </div>
        </div>
      </div>
    </header>
  )
}
