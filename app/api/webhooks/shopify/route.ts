import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

// ─── Shopify → our reason codes ───────────────────────────────
const REASON_MAP: Record<string, string> = {
  fraudulent:              'unauthorized_transaction',
  unrecognized:            'unauthorized_transaction',
  debit_not_authorized:    'unauthorized_transaction',
  not_received:            'item_not_received',
  product_not_received:    'item_not_received',
  product_unacceptable:    'item_not_as_described',
  duplicate:               'duplicate_charge',
  subscription_cancelled:  'subscription_cancelled',
  credit_not_processed:    'credit_not_processed',
  bank_not_process:        'credit_not_processed',
  general:                 'general_dispute',
  customer_initiated:      'general_dispute',
  incorrect_account_details: 'general_dispute',
  insufficient_funds:      'general_dispute',
  other:                   'other',
}

// ─── Shopify status → our status ──────────────────────────────
const STATUS_MAP: Record<string, string> = {
  needs_response:  'pending',
  under_review:    'under_review',
  charge_refunded: 'lost',
  accepted:        'lost',
  won:             'won',
  lost:            'lost',
}

// ─── Verify Shopify HMAC signature ────────────────────────────
function verifyShopifyWebhook(rawBody: string, hmacHeader: string | null): boolean {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET
  if (!secret || !hmacHeader) return false
  const computed = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('base64')
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hmacHeader))
}

export async function POST(request: NextRequest) {
  // 1. Read raw body (must be done before any parsing)
  const rawBody = await request.text()
  const hmacHeader = request.headers.get('x-shopify-hmac-sha256')
  const shopDomain = request.headers.get('x-shopify-shop-domain')
  const topic     = request.headers.get('x-shopify-topic')

  // 2. Verify authenticity
  if (!verifyShopifyWebhook(rawBody, hmacHeader)) {
    console.warn('[shopify webhook] Invalid HMAC — rejected')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 3. Only handle dispute creation
  if (topic !== 'disputes/create') {
    return NextResponse.json({ received: true })
  }

  // 4. Parse body
  let dispute: any
  try {
    dispute = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // 5. Look up user by shopify_domain using service role (bypasses RLS)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('user_id, currency')
    .eq('shopify_domain', shopDomain)
    .single()

  if (profileError || !profile) {
    // No user connected this store — log and return 200 so Shopify doesn't retry
    console.warn(`[shopify webhook] No user found for domain: ${shopDomain}`)
    return NextResponse.json({ received: true })
  }

  // 6. Map Shopify dispute → chargeback
  const reason    = REASON_MAP[dispute.reason] ?? 'other'
  const status    = STATUS_MAP[dispute.status] ?? 'pending'
  const amount    = parseFloat(dispute.amount ?? '0')
  const currency  = dispute.currency ?? profile.currency ?? 'USD'
  const txDate    = dispute.initiated_at
    ? new Date(dispute.initiated_at).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0]

  const chargeback = {
    user_id:          profile.user_id,
    customer_name:    `Order #${dispute.order_id}`,
    customer_email:   `order-${dispute.order_id}@${shopDomain}`,
    amount,
    currency,
    transaction_date: txDate,
    reason,
    status,
    notes: [
      `Auto-imported from Shopify.`,
      `Dispute ID: ${dispute.id}`,
      `Order ID: ${dispute.order_id}`,
      dispute.evidence_due_by
        ? `Evidence due: ${new Date(dispute.evidence_due_by).toLocaleDateString()}`
        : null,
      `Shopify reason: ${dispute.reason}`,
    ].filter(Boolean).join('\n'),
  }

  // 7. Insert chargeback
  const { data: newCb, error: insertError } = await supabase
    .from('chargebacks')
    .insert(chargeback)
    .select('id')
    .single()

  if (insertError) {
    console.error('[shopify webhook] Insert failed:', insertError)
    return NextResponse.json({ error: 'Insert failed' }, { status: 500 })
  }

  // 8. Add timeline event
  await supabase.from('timeline_events').insert({
    chargeback_id: newCb.id,
    user_id:       profile.user_id,
    event_type:    'created',
    description:   `Chargeback auto-imported from Shopify. Order #${dispute.order_id} · Reason: ${dispute.reason}`,
  })

  console.log(`[shopify webhook] Created chargeback ${newCb.id} for ${shopDomain}`)
  return NextResponse.json({ received: true, chargeback_id: newCb.id })
}
