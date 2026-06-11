'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CURRENCIES } from '@/lib/utils'
import { getTrialDaysLeft, getStatusLabel, isSubscriptionActive } from '@/lib/subscription'
import {
  Loader2, Save, Bell, Building2, Globe, Shield,
  ShoppingBag, CheckCircle2, AlertCircle, Link2, Link2Off,
  CreditCard, Zap,
} from 'lucide-react'

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [shopDomain, setShopDomain] = useState('')
  const [shopConnected, setShopConnected] = useState(false)
  const [shopInput, setShopInput] = useState('')
  const [billingProfile, setBillingProfile] = useState<any>(null)
  const [managingBilling, setManagingBilling] = useState(false)
  const [form, setForm] = useState({
    business_name: '',
    currency: 'USD',
    email_notifications: true,
    dispute_reminders: true,
    monthly_reports: false,
  })

  const supabase = createClient()

  // Read shopify=connected / shopify=error from URL after OAuth redirect
  const shopifyStatus = searchParams.get('shopify')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      if (data) {
        setForm({
          business_name: data.business_name || '',
          currency: data.currency || 'USD',
          email_notifications: data.email_notifications ?? true,
          dispute_reminders: data.dispute_reminders ?? true,
          monthly_reports: data.monthly_reports ?? false,
        })
        if (data.shopify_domain) {
          setShopDomain(data.shopify_domain)
          setShopConnected(true)
          setShopInput(data.shopify_domain)
        }
        setBillingProfile(data)
      }
      setLoading(false)
    }
    load()
  }, [])

  const set = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('user_profiles').upsert({
      user_id: user.id,
      ...form,
      updated_at: new Date().toISOString(),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleConnectShopify = () => {
    const domain = shopInput.trim().replace(/^https?:\/\//, '').replace(/\/$/, '')
    if (!domain) return
    // Ensure it ends with .myshopify.com
    const shop = domain.includes('.myshopify.com') ? domain : `${domain}.myshopify.com`
    window.location.href = `/api/shopify/connect?shop=${encodeURIComponent(shop)}`
  }

  const handleDisconnect = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('user_profiles').update({
      shopify_domain: null,
      shopify_access_token: null,
    } as any).eq('user_id', user.id)
    setShopDomain('')
    setShopConnected(false)
    setShopInput('')
  }

  const handleManageBilling = async () => {
    setManagingBilling(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      // fall through
    }
    setManagingBilling(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-ink-tertiary" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Settings</h1>
        <p className="text-ink-secondary text-sm mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Business */}
      <section className="card p-6 space-y-5">
        <div className="flex items-center gap-3 pb-1 border-b border-surface-border">
          <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-brand-600" />
          </div>
          <div>
            <h2 className="font-semibold text-ink text-sm">Business Information</h2>
            <p className="text-xs text-ink-tertiary">Used throughout the dashboard</p>
          </div>
        </div>
        <div>
          <label className="label">Business Name</label>
          <input
            type="text"
            className="input"
            placeholder="My Online Store"
            value={form.business_name}
            onChange={(e) => set('business_name', e.target.value)}
          />
        </div>
      </section>

      {/* Shopify Integration */}
      <section className="card p-6 space-y-5">
        <div className="flex items-center gap-3 pb-1 border-b border-surface-border">
          <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-brand-600" />
          </div>
          <div>
            <h2 className="font-semibold text-ink text-sm">Shopify Integration</h2>
            <p className="text-xs text-ink-tertiary">Auto-import disputes directly from your store</p>
          </div>
          {shopConnected && (
            <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-success-50 text-success-700 border border-success-200">
              <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
              Connected
            </span>
          )}
        </div>

        {/* OAuth success/error banners from redirect */}
        {shopifyStatus === 'connected' && (
          <div className="flex items-start gap-2 rounded-lg border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-800">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-success-600" />
            Shopify connected! Disputes will now auto-import whenever a new chargeback is filed.
          </div>
        )}
        {shopifyStatus === 'error' && (
          <div className="flex items-start gap-2 rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-800">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-danger-600" />
            Connection failed. Make sure your store domain is correct and try again.
          </div>
        )}

        {shopConnected ? (
          /* ── Already connected state ── */
          <div className="rounded-xl border border-success-200 bg-success-50 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#008060' }}>
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-ink">{shopDomain}</div>
                <div className="text-xs text-ink-secondary">Disputes auto-import is active</div>
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              className="inline-flex items-center gap-1.5 text-xs text-danger-600 hover:text-danger-700 font-medium"
            >
              <Link2Off className="w-3.5 h-3.5" />
              Disconnect store
            </button>
          </div>
        ) : (
          /* ── Not connected state ── */
          <div className="space-y-4">
            <div>
              <label className="label">Your Shopify store domain</label>
              <input
                type="text"
                className="input"
                placeholder="yourstore.myshopify.com"
                value={shopInput}
                onChange={(e) => setShopInput(e.target.value.toLowerCase().trim())}
                onKeyDown={(e) => e.key === 'Enter' && handleConnectShopify()}
              />
              <p className="text-xs text-ink-tertiary mt-1.5">
                Enter your <code className="bg-surface-secondary px-1 rounded">.myshopify.com</code> domain
              </p>
            </div>

            <button
              onClick={handleConnectShopify}
              disabled={!shopInput}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: shopInput ? '#008060' : undefined, backgroundColor: shopInput ? '#008060' : '#94a3b8' }}
            >
              <svg width="18" height="18" viewBox="0 0 109 124" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M74.7 14.8s-.3 0-.8.2c-.1 0-.2-.1-.3-.1-4.7-.1-8.2 3.6-9.4 9.4-.1.4-.1.8-.1 1.2-2.6.8-5.5 1.7-8.5 2.6-2.4-6.4-6.6-9.8-11.4-9.8h-.5C42.3 17 40.8 16 39.4 16c-10.5 0-15.6 13.2-17.2 19.9l-7.3 2.3c-2.3.7-2.3.7-2.6 2.9L4 99.2l55.4 9.8 30-6.5L74.7 14.8zm-14 12.9c-2.1.6-4.3 1.3-6.6 2-.5-3.1-1.4-5.8-2.8-7.9 3.5.7 6 3.7 9.4 5.9zm-12.3-5.4c1.9 2 3.1 4.9 3.6 9.1-2.9.9-6.1 1.9-9.3 2.9 1.8-6.8 5.2-11.7 5.7-12zm-6.4-.9c.4 0 .7.1 1 .2-.9.4-1.8 1-2.6 1.9-5.2 5.6-9.2 14.5-10.7 25.3l-8.1 2.5C23.3 39.8 28.7 21.4 42 21.4z" fill="white"/>
                <path d="M88.2 35.9c-.5 0-10 .2-10 .2s-7.9-7.7-8.7-8.5c-.1-.1-.2-.1-.3-.2L59.4 109l30-6.5L102 36.8c-.8-.5-13.3-.9-13.8-.9z" fill="white" opacity="0.6"/>
              </svg>
              Connect with Shopify
            </button>

            <p className="text-xs text-center text-ink-tertiary">
              You'll be redirected to Shopify to approve the connection — no tokens or copying needed.
            </p>
          </div>
        )}
      </section>

      {/* Currency */}
      <section className="card p-6 space-y-5">
        <div className="flex items-center gap-3 pb-1 border-b border-surface-border">
          <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
            <Globe className="w-4 h-4 text-brand-600" />
          </div>
          <div>
            <h2 className="font-semibold text-ink text-sm">Regional Settings</h2>
            <p className="text-xs text-ink-tertiary">Affects how amounts are displayed</p>
          </div>
        </div>
        <div>
          <label className="label">Default Currency</label>
          <select
            className="input"
            value={form.currency}
            onChange={(e) => set('currency', e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.label} ({c.symbol})
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Notifications */}
      <section className="card p-6 space-y-5">
        <div className="flex items-center gap-3 pb-1 border-b border-surface-border">
          <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
            <Bell className="w-4 h-4 text-brand-600" />
          </div>
          <div>
            <h2 className="font-semibold text-ink text-sm">Notifications</h2>
            <p className="text-xs text-ink-tertiary">Configure your alert preferences</p>
          </div>
        </div>

        <ToggleSetting
          label="Email Notifications"
          description="Receive email updates for new chargebacks"
          checked={form.email_notifications}
          onChange={(v) => set('email_notifications', v)}
        />
        <ToggleSetting
          label="Dispute Reminders"
          description="Get reminded of upcoming dispute deadlines"
          checked={form.dispute_reminders}
          onChange={(v) => set('dispute_reminders', v)}
        />
        <ToggleSetting
          label="Monthly Reports"
          description="Receive a monthly summary of your chargeback activity"
          checked={form.monthly_reports}
          onChange={(v) => set('monthly_reports', v)}
        />

        <div className="flex items-start gap-2 p-3 bg-surface-secondary rounded-lg text-xs text-ink-secondary">
          <Shield className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
          Email notifications are UI preferences in this MVP. Full email delivery is available on Pro.
        </div>
      </section>

      {/* Billing */}
      <section className="card p-6 space-y-5">
        <div className="flex items-center gap-3 pb-1 border-b border-surface-border">
          <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-brand-600" />
          </div>
          <div>
            <h2 className="font-semibold text-ink text-sm">Billing & Subscription</h2>
            <p className="text-xs text-ink-tertiary">Manage your plan and payment details</p>
          </div>
        </div>

        {billingProfile && (() => {
          const active = isSubscriptionActive(billingProfile)
          const statusLabel = getStatusLabel(billingProfile)
          const daysLeft = getTrialDaysLeft(billingProfile.trial_started_at)
          const isActive = billingProfile.subscription_status === 'active'

          return (
            <div className="space-y-4">
              {/* Status badge */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-ink">Current plan</div>
                  <div className="text-xs text-ink-tertiary mt-0.5">
                    {isActive ? 'Pro — $29/month' : 'Free trial'}
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  isActive
                    ? 'bg-success-50 text-success-700 border-success-200'
                    : active
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-danger-50 text-danger-700 border-danger-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? 'bg-success-500' : active ? 'bg-amber-500' : 'bg-danger-500'
                  }`} />
                  {statusLabel}
                </span>
              </div>

              {/* Trial progress bar */}
              {!isActive && active && (
                <div>
                  <div className="flex justify-between text-xs text-ink-tertiary mb-1.5">
                    <span>Trial progress</span>
                    <span>{daysLeft} day{daysLeft === 1 ? '' : 's'} remaining</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-border overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all"
                      style={{ width: `${Math.max(5, (daysLeft / 3) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action buttons */}
              {isActive ? (
                <button
                  onClick={handleManageBilling}
                  disabled={managingBilling}
                  className="btn-secondary inline-flex items-center gap-2 text-sm"
                >
                  {managingBilling
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <CreditCard className="w-4 h-4" />
                  }
                  {managingBilling ? 'Loading...' : 'Manage billing'}
                </button>
              ) : (
                <a
                  href="/upgrade"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: '#008060' }}
                >
                  <Zap className="w-4 h-4" />
                  {active ? 'Upgrade now' : 'Subscribe to restore access'}
                </a>
              )}
            </div>
          )
        })()}
      </section>

      {/* Save */}
      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="btn-primary px-8">
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
          ) : saved ? (
            <><CheckCircle2 className="w-4 h-4 text-green-100" />Saved!</>
          ) : (
            <><Save className="w-4 h-4" />Save Settings</>
          )}
        </button>
      </div>
    </div>
  )
}

function ToggleSetting({
  label, description, checked, onChange,
}: {
  label: string; description: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-sm font-medium text-ink">{label}</div>
        <div className="text-xs text-ink-tertiary mt-0.5">{description}</div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 flex-shrink-0 ${
          checked ? 'bg-brand-600' : 'bg-surface-border'
        }`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  )
}
