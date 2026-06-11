import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
  const shop = request.nextUrl.searchParams.get('shop')

  if (!shop) {
    return NextResponse.json({ error: 'Missing shop parameter' }, { status: 400 })
  }

  const apiKey    = process.env.SHOPIFY_API_KEY
  const appUrl    = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
  const redirectUri = `${appUrl}/api/shopify/callback`

  if (!apiKey) {
    return NextResponse.json({ error: 'SHOPIFY_API_KEY not configured' }, { status: 500 })
  }

  // Generate a random state to prevent CSRF
  const state = crypto.randomBytes(16).toString('hex')

  const scopes = 'read_shopify_payments_disputes,write_webhooks,read_orders'

  const authUrl =
    `https://${shop}/admin/oauth/authorize` +
    `?client_id=${apiKey}` +
    `&scope=${scopes}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${state}`

  // Store state in a short-lived cookie so we can verify it on callback
  const response = NextResponse.redirect(authUrl)
  response.cookies.set('shopify_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/',
  })

  return response
}
