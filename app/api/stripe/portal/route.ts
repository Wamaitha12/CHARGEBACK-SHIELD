import { NextRequest, NextResponse } from 'next/server'
import { getCustomerPortalUrl } from '@/lib/dodopayments'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }))

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase
    .from('user_profiles')
    .select('stripe_subscription_id')
    .eq('user_id', user.id)
    .single()

  const subscriptionId = profile?.stripe_subscription_id
  if (!subscriptionId) {
    return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
  }

  const portalUrl = await getCustomerPortalUrl(subscriptionId)
  if (!portalUrl) {
    return NextResponse.json({ error: 'Could not load billing portal' }, { status: 500 })
  }

  return NextResponse.json({ url: portalUrl })
}
