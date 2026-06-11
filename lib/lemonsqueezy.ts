const LEMON_API = 'https://api.lemonsqueezy.com/v1'

function lsHeaders() {
  return {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
    'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
  }
}

/**
 * Create a Lemon Squeezy checkout URL for a given variant, pre-filled with the
 * customer's email and a custom user_id for webhook attribution.
 */
export async function createCheckout({
  email,
  userId,
  successUrl,
  cancelUrl,
}: {
  email: string
  userId: string
  successUrl: string
  cancelUrl: string
}): Promise<string> {
  const storeId   = process.env.LEMONSQUEEZY_STORE_ID!
  const variantId = process.env.LEMONSQUEEZY_VARIANT_ID!

  const body = {
    data: {
      type: 'checkouts',
      attributes: {
        checkout_data: {
          email,
          custom: { user_id: userId },
        },
        product_options: {
          redirect_url: successUrl,
        },
        checkout_options: {
          // Send them back to the cancel URL if they close checkout
          embed: false,
        },
      },
      relationships: {
        store:   { data: { type: 'stores',   id: String(storeId)   } },
        variant: { data: { type: 'variants', id: String(variantId) } },
      },
    },
  }

  const res = await fetch(`${LEMON_API}/checkouts`, {
    method: 'POST',
    headers: lsHeaders(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Lemon Squeezy checkout error: ${err}`)
  }

  const json = await res.json()
  return json.data.attributes.url as string
}

/**
 * Fetch a subscription by ID and return its customer portal URL.
 */
export async function getCustomerPortalUrl(subscriptionId: string): Promise<string | null> {
  const res = await fetch(`${LEMON_API}/subscriptions/${subscriptionId}`, {
    headers: lsHeaders(),
  })

  if (!res.ok) return null

  const json = await res.json()
  return json.data?.attributes?.urls?.customer_portal ?? null
}
