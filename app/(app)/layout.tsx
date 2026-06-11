import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { isSubscriptionActive } from '@/lib/subscription'
import AppShell from '@/components/layout/AppShell'
import { redirect } from 'next/navigation'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()

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

      // Subscription gate
      const headersList = headers()
      const pathname = headersList.get('x-pathname') || ''
      const isUpgradePage = pathname.includes('/upgrade')
      const hasSubscriptionData = profile?.subscription_status !== undefined
      if (!isUpgradePage && hasSubscriptionData && !isSubscriptionActive(profile)) {
        redirect('/upgrade')
      }
    }
  } catch {
    // Server-side auth failed - let client pages handle it
  }

  return (
    <AppShell user={user} profile={profile}>
      {children}
    </AppShell>
  )
}
