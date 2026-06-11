const DODO_API = process.env.DODO_PAYMENTS_ENVIRONMENT === 'test_mode'
  ? 'https://test.dodopayments.com'
  : 'https://live.dodopayments.com'

function dodoHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
  }
}

/**
 * Create a hosted checkout session for a subscription product.
 * Returns the URL to redirect the customer to.
 */
export async function createCheckout({
  email,
  name,
  successUrl,
}: {
  email: string
  name?: string
  successUrl: string
}): Promise<string> {
  const productId = process.env.DODO_PAYMENTS_PRODUCT_ID!

  const body = {
    product_cart: [{ product_id: productId, quantity: 1 }],
    customer: { email, name: name || email },
    return_url: successUrl,
  }

  const res = await fetch(`${DODO_API}/checkouts`, {
    method: 'POST',
    headers: dodoHeaders(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Dodo Payments checkout error: ${err}`)
  }

  const json = await res.json()
  return json.checkout_url as string
}

/**
 * Fetch a subscription by ID. Returns the full subscription object.
 */
export async function getSubscription(subscriptionId: string) {
  const res = await fetch(`${DODO_API}/subscriptions/${subscriptionId}`, {
    headers: dodoHeaders(),
  })
  if (!res.ok) return null
  return res.json()
}

/**
 * Get the customer portal URL for managing a subscription.
 * Dodo Payments returns a customer_portal_url on the subscription object.
 */
export async function getCustomerPortalUrl(subscriptionId: string): Promise<string | null> {
  const sub = await getSubscription(subscriptionId)
  return sub?.customer_portal_url ?? null
}
