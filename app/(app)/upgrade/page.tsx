'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getTrialDaysLeft, isSubscriptionActive } from '@/lib/subscription'
import {
  ShieldCheck, CheckCircle2, Loader2, AlertCircle,
  Zap, BarChart3, ShoppingBag, Clock, FileText,
} from 'lucide-react'

const FEATURES = [
  { icon: ShieldCheck, text: 'Unlimited dispute tracking & evidence builder' },
  { icon: BarChart3,   text: 'Full analytics — win rates, trends, revenue recovered' },
  { icon: ShoppingBag, text: 'Shopify auto-import for new chargebacks' },
  { icon: Zap,         text: 'Response templates & deadline reminders' },
  { icon: FileText,    text: 'PDF export & monthly summary reports' },
]

export default function UpgradePage() {
  const searchParams = useSearchParams()
  const [loading, setLoading]         = useState(true)
  const [subscribing, setSubscribing] = useState(false)
  const [error, setError]             = useState('')
  const [daysLeft, setDaysLeft]       = useState(0)
  const [trialExpired, setTrialExpired] = useState(false)

  const billingStatus = searchParams.get('billing')

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('trial_started_at, subscription_status, current_period_end')
        .eq('user_id', user.id)
        .single()

      if (profile) {
        const days = getTrialDaysLeft(profile.trial_started_at)
        setDaysLeft(days)
        setTrialExpired(!isSubscriptionActive(profile))
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSubscribe = async () => {
    setSubscribing(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
        setSubscribing(false)
      }
    } catch {
      setError('Network error. Please try again.')
      setSubscribing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-ink-tertiary" />
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto animate-fade-in py-4">

      {/* Trial status banner */}
      {trialExpired ? (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-danger-200 bg-danger-50 px-5 py-4 text-danger-800">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-danger-500" />
          <div>
            <div className="font-semibold text-sm">Your free trial has ended</div>
            <div className="text-sm mt-0.5 text-danger-700">Subscribe to regain access to all your dispute data and tools.</div>
          </div>
        </div>
      ) : (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800">
          <Clock className="w-5 h-5 flex-shrink-0 text-amber-500" />
          <div className="text-sm">
            <span className="font-semibold">{daysLeft} day{daysLeft === 1 ? '' : 's'} left</span> on your free trial.
            Subscribe now to keep uninterrupted access.
          </div>
        </div>
      )}

      {/* Checkout canceled notice */}
      {billingStatus === 'canceled' && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-surface-border bg-surface-secondary px-4 py-3 text-sm text-ink-secondary">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Checkout was canceled — no charge was made.
        </div>
      )}

      {/* Pricing card */}
      <div className="card p-8 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-2"
            style={{ background: '#008060' }}
          >
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-ink">Chargeback Shield Pro</h1>
          <p className="text-ink-secondary text-sm">Everything you need to win disputes and protect your revenue</p>
        </div>

        {/* Price */}
        <div className="text-center py-4 border-y border-surface-border">
          <div className="flex items-end justify-center gap-1">
            <span className="text-4xl font-bold text-ink">$29</span>
            <span className="text-ink-secondary text-base mb-1">/month</span>
          </div>
          <p className="text-xs text-ink-tertiary mt-1">Cancel anytime. No contracts.</p>
        </div>

        {/* Features */}
        <ul className="space-y-3">
          {FEATURES.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm text-ink">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-brand-600" />
              {text}
            </li>
          ))}
        </ul>

        {/* Error */}
        {error && (
          <div className="text-sm text-danger-600 bg-danger-50 border border-danger-200 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleSubscribe}
          disabled={subscribing}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: '#008060' }}
        >
          {subscribing ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Redirecting to checkout...</>
          ) : (
            <>Subscribe — $29/month</>
          )}
        </button>

        <p className="text-center text-xs text-ink-tertiary">
          Secured by Stripe. Your payment info is never stored on our servers.
        </p>
      </div>
    </div>
  )
}
