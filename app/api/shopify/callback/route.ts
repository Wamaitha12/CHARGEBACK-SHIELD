import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

function verifyHmac(query: URLSearchParams, secret: string): boolean {
  const hmac = query.get('hmac') || ''
  const params: Record<string, string> = {}
  query.forEach((value, key) => {
    if (key !== 'hmac') params[key] = value
  })
  const message = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&')
  const digest = crypto.createHmac('sha256', secret).update(message).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmac))
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const shop      = searchParams.get('shop') || ''
  const code      = searchParams.get('code') || ''
  const state     = searchParams.get('state') || ''
  const hmac      = searchParams.get('hmac') || ''

  const apiKey    = process.env.SHOPIFY_API_KEY!
  const apiSecret = process.env.SHOPIFY_API_SECRET!
  const appUrl    = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin

  // Verify state cookie matches to prevent CSRF
  const storedState = request.cookies.get('shopify_oauth_state')?.value
  if (!storedState || storedState !== state) {
    return NextResponse.redirect(`${appUrl}/settings?shopify=error&reason=state_mismatch`)
  }

  // Verify Shopify HMAC signature
  if (!verifyHmac(searchParams, apiSecret)) {
    return NextResponse.redirect(`${appUrl}/settings?shopify=error&reason=invalid_hmac`)
  }

  // Exchange code for permanent access token
  const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: apiKey, client_secret: apiSecret, code }),
  })

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${appUrl}/settings?shopify=error&reason=token_exchange_failed`)
  }

  const { access_token: accessToken } = await tokenRes.json()

  // Get the authenticated user from Supabase session
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }))

  if (!user) {
    return NextResponse.redirect(`${appUrl}/auth/login`)
  }

  // Save shopify domain + access token to user profile
  const adminSupabase = createAdminClient()
  await adminSupabase.from('user_profiles').upsert({
    user_id: user.id,
    shopify_domain: shop,
    shopify_access_token: accessToken,
    updated_at: new Date().toISOString(),
  })

  // Register the disputes/create webhook automatically
  const webhookUrl = `${appUrl}/api/webhooks/shopify`

  // Check if already registered
  const listRes = await fetch(
    `https://${shop}/admin/api/2024-01/webhooks.json?topic=disputes/create`,
    { headers: { 'X-Shopify-Access-Token': accessToken } }
  )
  const { webhooks: existing } = await listRes.json()
  const alreadyExists = existing?.some((w: any) => w.address === webhookUrl)

  if (!alreadyExists) {
    await fetch(`https://${shop}/admin/api/2024-01/webhooks.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        webhook: { topic: 'disputes/create', address: webhookUrl, format: 'json' },
      }),
    })
  }

  // Clear the state cookie and redirect back to settings with success
  const response = NextResponse.redirect(`${appUrl}/settings?shopify=connected`)
  response.cookies.delete('shopify_oauth_state')
  return response
}
