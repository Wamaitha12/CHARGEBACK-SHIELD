import { createClient } from '@supabase/supabase-js'

// Service-role client — bypasses RLS. Only use server-side (never expose to browser).
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
