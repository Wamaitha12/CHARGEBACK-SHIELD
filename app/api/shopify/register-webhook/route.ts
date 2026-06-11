import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  // Verify the user is authenticated
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }))
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { shopDomain, accessToken } = await request.json()

  if (!shopDomain || !accessToken) {
    return NextResponse.json({ error: 'shopDomain and accessToken are required' }, { status: 400 })
  }

  const cleanDomain = shopDomain.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin') || ''
  const webhookUrl = `${appUrl}/api/webhooks/shopify`

  // First, check if this webhook already exists
  try {
    const listRes = await fetch(
      `https://${cleanDomain}/admin/api/2024-01/webhooks.json?topic=disputes/create`,
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!listRes.ok) {
      const err = await listRes.json()
      return NextResponse.json(
        { error: err?.errors || 'Failed to connect to Shopify. Check your access token.' },
        { status: 400 }
      )
    }

    const { webhooks: existing } = await listRes.json()
    const alreadyRegistered = existing?.some((w: any) => w.address === webhookUrl)

    if (alreadyRegistered) {
      return NextResponse.json({ success: true, alreadyExisted: true })
    }

    // Register the disputes/create webhook
    const createRes = await fetch(
      `https://${cleanDomain}/admin/api/2024-01/webhooks.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webhook: {
            topic: 'disputes/create',
            address: webhookUrl,
            format: 'json',
          },
        }),
      }
    )

    if (!createRes.ok) {
      const err = await createRes.json()
      return NextResponse.json(
        { error: err?.errors || 'Failed to register webhook.' },
        { status: 400 }
      )
    }

    const { webhook } = await createRes.json()

    // Also save the access token to user_profiles for future use (e.g. fetching customer info)
    await supabase
      .from('user_profiles')
      .update({ shopify_access_token: accessToken } as any)
      .eq('user_id', user.id)

    return NextResponse.json({
      success: true,
      webhookId: webhook.id,
      webhookSecret: webhook.api_client_secret,
    })
  } catch (err) {
    console.error('[shopify register]', err)
    return NextResponse.json({ error: 'Network error contacting Shopify.' }, { status: 500 })
  }
}
