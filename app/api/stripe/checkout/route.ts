import { NextRequest, NextResponse } from 'next/server'
import { createCheckout } from '@/lib/dodopayments'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }))

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Get business name for the checkout if available
  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase
    .from('user_profiles')
    .select('business_name')
    .eq('user_id', user.id)
    .single()

  try {
    const url = await createCheckout({
      email: user.email!,
      name: profile?.business_name || undefined,
      successUrl: `${appUrl}/dashboard?billing=success`,
    })
    return NextResponse.json({ url })
  } catch (err: any) {
    console.error('Dodo Payments checkout error:', err.message)
    return NextResponse.json({ error: 'Failed to create checkout. Please try again.' }, { status: 500 })
  }
}
