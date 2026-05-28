'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CURRENCIES } from '@/lib/utils'
import { Loader2, Save, Bell, Building2, Globe, Shield, ShoppingBag, Copy, Check, ExternalLink } from 'lucide-react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    business_name: '',
    currency: 'USD',
    email_notifications: true,
    dispute_reminders: true,
    monthly_reports: false,
    shopify_domain: '',
  })
  const [webhookUrl, setWebhookUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const supabase = createClient()

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
          shopify_domain: data.shopify_domain || '',
        })
      }
      setLoading(false)
    }
    load()
    setWebhookUrl(`${window.location.origin}/api/webhooks/shopify`)
  }, [])

  const set = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
            <p className="text-xs text-ink-tertiary">Auto-import chargebacks when disputes open in your store</p>
          </div>
          {form.shopify_domain && (
            <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-success-50 text-success-700 border border-success-200 dark:bg-success-900/20 dark:border-success-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
              Connected
            </span>
          )}
        </div>

        {/* Store domain */}
        <div>
          <label className="label">Shopify Store Domain</label>
          <input
            type="text"
            className="input"
            placeholder="yourstore.myshopify.com"
            value={form.shopify_domain}
            onChange={(e) => set('shopify_domain', e.target.value.toLowerCase().trim())}
          />
          <p className="text-xs text-ink-tertiary mt-1.5">
            Enter your .myshopify.com domain so we can match incoming webhooks to your account.
          </p>
        </div>

        {/* Webhook URL */}
        <div>
          <label className="label">Your Webhook URL</label>
          <div className="flex gap-2">
            <input
              readOnly
              value={webhookUrl}
              className="input font-mono text-xs bg-surface-secondary"
            />
            <button
              type="button"
              onClick={copyWebhookUrl}
              className="btn-secondary flex-shrink-0 gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-success-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Setup steps */}
        <div className="rounded-xl border border-surface-border bg-surface-secondary p-4 space-y-3">
          <p className="text-xs font-semibold text-ink uppercase tracking-wider">Setup instructions</p>
          <ol className="space-y-2.5 text-xs text-ink-secondary">
            {[
              <>Enter your store domain above and click <strong className="text-ink">Save Settings</strong>.</>,
              <>In your Shopify admin, go to <strong className="text-ink">Settings → Notifications → Webhooks</strong>.</>,
              <>Click <strong className="text-ink">Create webhook</strong>. Set event to <strong className="text-ink">Dispute created</strong>, format to <strong className="text-ink">JSON</strong>, and paste the webhook URL above.</>,
              <>Copy the <strong className="text-ink">webhook signing secret</strong> Shopify shows you and add it to your server as <code className="bg-surface-tertiary px-1 rounded">SHOPIFY_WEBHOOK_SECRET</code>.</>,
              <>From now on, every new dispute in your Shopify store will appear automatically in Chargeback Shield.</>,
            ].map((step, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
          <a
            href="https://help.shopify.com/en/manual/orders/chargebacks"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-brand-600 hover:underline mt-1"
          >
            Shopify chargeback docs
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
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

      {/* Save */}
      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="btn-primary px-8">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <span className="text-green-100">✓</span>
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function ToggleSetting({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
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
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
