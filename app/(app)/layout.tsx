import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { isSubscriptionActive } from '@/lib/subscription'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import { redirect } from 'next/navigation'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()

  // Try to get the user — if this fails or returns null, let the client pages
  // handle auth themselves (they all check session client-side)
  let user: any = null
  let profile: any = null

  try {
    const { data: { user: u } } = await supabase.auth.getUser()
    user = u

    if (user) {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      profile = data

      // Backfill trial_started_at for users who don't have it yet
      if (profile && !profile.trial_started_at) {
        await supabase
          .from('user_profiles')
          .update({ trial_started_at: new Date().toISOString(), subscription_status: 'trialing' })
          .eq('user_id', user.id)
        profile = { ...profile, trial_started_at: new Date().toISOString(), subscription_status: 'trialing' }
      }

      // Subscription gate — only enforce when we confidently have a profile
      // and the trial/subscription columns exist (profile.subscription_status !== undefined)
      const headersList = headers()
      const pathname = headersList.get('x-pathname') || ''
      const isUpgradePage = pathname.includes('/upgrade')

      const hasSubscriptionData = profile?.subscription_status !== undefined
      if (!isUpgradePage && hasSubscriptionData && !isSubscriptionActive(profile)) {
        redirect('/upgrade')
      }
    }
  } catch {
    // Server-side auth failed — let client pages handle it gracefully
  }

  return (
    <div className="flex h-screen bg-surface-secondary overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar user={user} profile={profile} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
