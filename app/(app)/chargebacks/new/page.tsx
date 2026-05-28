'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { REASON_LABELS } from '@/lib/utils'
import { DisputeReason } from '@/types'

export default function NewChargebackPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    amount: '',
    transaction_date: new Date().toISOString().split('T')[0],
    reason: 'item_not_received' as DisputeReason,
    reason_custom: '',
    status: 'pending',
    notes: '',
  })

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }))

    // In dev bypass mode, we still need a real user to insert — show a helpful error
    if (!user) {
      setError('You must be signed in to add a chargeback. Please log in first.')
      setLoading(false)
      return
    }

    const { data, error: insertError } = await supabase
      .from('chargebacks')
      .insert({
        user_id: user.id,
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        amount: parseFloat(form.amount),
        currency: 'USD',
        transaction_date: form.transaction_date,
        reason: form.reason,
        reason_custom: form.reason_custom || null,
        status: form.status,
        notes: form.notes || null,
      })
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    // Add initial timeline event
    await supabase.from('timeline_events').insert({
      chargeback_id: data.id,
      user_id: user.id,
      event_type: 'created',
      description: 'Chargeback created',
    })

    window.location.href = `/chargebacks/${data.id}`
  }

  return (
    <div className="max-w-2xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/chargebacks" className="btn-ghost btn-sm p-2">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-ink">Add Chargeback</h1>
          <p className="text-sm text-ink-secondary">Record a new dispute to start tracking it</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-danger-50 border border-danger-100 text-danger-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Customer section */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-ink text-sm uppercase tracking-wider text-ink-tertiary">
            Customer Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Customer Name *</label>
              <input
                type="text"
                className="input"
                placeholder="Jane Smith"
                value={form.customer_name}
                onChange={(e) => set('customer_name', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Customer Email *</label>
              <input
                type="email"
                className="input"
                placeholder="jane@example.com"
                value={form.customer_email}
                onChange={(e) => set('customer_email', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Transaction section */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-ink-tertiary">
            Transaction Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Amount *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary text-sm">$</span>
                <input
                  type="number"
                  className="input pl-7"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={form.amount}
                  onChange={(e) => set('amount', e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Transaction Date *</label>
              <input
                type="date"
                className="input"
                value={form.transaction_date}
                onChange={(e) => set('transaction_date', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Dispute Reason *</label>
              <select
                className="input"
                value={form.reason}
                onChange={(e) => set('reason', e.target.value)}
                required
              >
                {Object.entries(REASON_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Initial Status</label>
              <select
                className="input"
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>

          {form.reason === 'other' && (
            <div>
              <label className="label">Custom Reason</label>
              <input
                type="text"
                className="input"
                placeholder="Describe the dispute reason..."
                value={form.reason_custom}
                onChange={(e) => set('reason_custom', e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="card p-6">
          <label className="label">Notes</label>
          <textarea
            className="input resize-none"
            rows={4}
            placeholder="Add any relevant notes about this chargeback, context about the customer, or details that may help with the dispute..."
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Link href="/chargebacks" className="btn-secondary">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Create Chargeback'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
