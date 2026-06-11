import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'standardwebhooks'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const rawBody = await request.text()

  // Dodo Payments uses Standard Webhooks spec — 3 headers for verification
  const webhookId        = request.headers.get('webhook-id') || ''
  const webhookTimestamp = request.headers.get('webhook-timestamp') || ''
  const webhookSignature = request.headers.get('webhook-signature') || ''

  const secret = process.env.DODO_PAYMENTS_WEBHOOK_KEY!

  try {
    const wh = new Webhook(secret)
    wh.verify(rawBody, {
      'webhook-id': webhookId,
      'webhook-timestamp': webhookTimestamp,
      'webhook-signature': webhookSignature,
    })
  } catch {
    console.error('Dodo Payments webhook signature verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(rawBody)
  const eventType: string = event.type || ''
  const data = event.data || {}

  const adminSupabase = createAdminClient()

  // Look up user by their email address (set when checkout was created)
  const customerEmail: string = data.customer?.email || ''
  let userId: string | null = null

  if (customerEmail) {
    // Find user in Supabase auth by email
    const { data: { users } } = await adminSupabase.auth.admin.listUsers()
    const match = users.find((u) => u.email === customerEmail)
    userId = match?.id ?? null
  }

  if (!userId) {
    // Can't attribute to a user — acknowledge but don't error
    console.warn(`Dodo webhook: no user found for email "${customerEmail}" (event: ${eventType})`)
    return NextResponse.json({ received: true })
  }

  switch (eventType) {
    case 'subscription.active':
    case 'subscription.renewed': {
      await adminSupabase.from('user_profiles').update({
        subscription_status:    'active',
        stripe_subscription_id: data.subscription_id ?? null,
        stripe_customer_id:     data.customer?.customer_id ?? null,
        current_period_end:     data.next_billing_date ?? data.current_period_end ?? null,
      }).eq('user_id', userId)
      break
    }

    case 'subscription.on_hold': {
      await adminSupabase.from('user_profiles').update({
        subscription_status: 'past_due',
      }).eq('user_id', userId)
      break
    }

    case 'subscription.cancelled':
    case 'subscription.expired':
    case 'subscription.failed': {
      await adminSupabase.from('user_profiles').update({
        subscription_status:    'canceled',
        stripe_subscription_id: null,
        current_period_end:     null,
      }).eq('user_id', userId)
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}
