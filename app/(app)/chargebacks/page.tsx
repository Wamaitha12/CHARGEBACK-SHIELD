'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate, STATUS_CONFIG, REASON_LABELS } from '@/lib/utils'
import Link from 'next/link'
import {
  Plus, Filter, Download, Clock, Search, Trophy, XCircle,
  ArrowUpRight, Loader2,
} from 'lucide-react'
import ChargebackFilters from '@/components/chargebacks/ChargebackFilters'
import { ChargebackStatus } from '@/types'

const PAGE_SIZE = 20

export default function ChargebacksPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const statusParam = searchParams.get('status') || ''
  const searchQuery = searchParams.get('search') || ''
  const pageParam = parseInt(searchParams.get('page') || '1')

  const [chargebacks, setChargebacks] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [currency, setCurrency] = useState('USD')
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }))

    if (!user) {
      router.push('/auth/login')
      return
    }

    const offset = (pageParam - 1) * PAGE_SIZE

    let query = supabase
      .from('chargebacks')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1)

    if (statusParam) {
      const statuses = statusParam.split(',') as ChargebackStatus[]
      query = query.in('status', statuses)
    }

    if (searchQuery) {
      query = query.or(
        `customer_name.ilike.%${searchQuery}%,customer_email.ilike.%${searchQuery}%`
      )
    }

    const { data, count } = await query

    // Fetch currency preference
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('currency')
      .eq('user_id', user.id)
      .single()

    setChargebacks(data || [])
    setTotal(count || 0)
    setCurrency(profile?.currency || 'USD')
    setLoading(false)
  }, [statusParam, searchQuery, pageParam])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const offset = (pageParam - 1) * PAGE_SIZE

  const searchParamsObj = {
    status: statusParam || undefined,
    search: searchQuery || undefined,
    page: pageParam > 1 ? String(pageParam) : undefined,
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Active Disputes</h1>
          <p className="text-ink-secondary text-sm mt-0.5">
            {loading ? 'Loading...' : `${total} dispute${total !== 1 ? 's' : ''} tracked`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary btn-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
          <Link href="/chargebacks/new" className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Chargeback
          </Link>
        </div>
      </div>

      {/* Status summary pills */}
      <StatusSummary chargebacks={chargebacks} currency={currency} loading={loading} />

      {/* Filters */}
      <ChargebackFilters searchParams={searchParamsObj} />

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            <p className="text-sm text-ink-secondary">Loading disputes...</p>
          </div>
        ) : chargebacks.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 bg-surface-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
              <Filter className="w-6 h-6 text-ink-tertiary" />
            </div>
            <h3 className="font-medium text-ink mb-2">No chargebacks found</h3>
            <p className="text-sm text-ink-secondary mb-6">
              Try adjusting your filters or add a new chargeback.
            </p>
            <Link href="/chargebacks/new" className="btn-primary">
              <Plus className="w-4 h-4" />
              Add Chargeback
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th className="hidden md:table-cell">Reason</th>
                    <th className="hidden sm:table-cell">Transaction Date</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {chargebacks.map((c) => {
                    const s = STATUS_CONFIG[c.status as ChargebackStatus]
                    return (
                      <tr key={c.id}>
                        <td>
                          <div className="font-medium text-ink">{c.customer_name}</div>
                          <div className="text-xs text-ink-tertiary">{c.customer_email}</div>
                        </td>
                        <td>
                          <span className="font-semibold tabular-nums">
                            {formatCurrency(c.amount, currency)}
                          </span>
                        </td>
                        <td className="hidden md:table-cell">
                          <span className="text-ink-secondary text-sm">
                            {REASON_LABELS[c.reason as keyof typeof REASON_LABELS] || c.reason}
                          </span>
                        </td>
                        <td className="hidden sm:table-cell">
                          <span className="text-sm text-ink-secondary">
                            {formatDate(c.transaction_date)}
                          </span>
                        </td>
                        <td>
                          <StatusBadge status={c.status as ChargebackStatus} />
                        </td>
                        <td className="text-right">
                          <Link
                            href={`/chargebacks/${c.id}`}
                            className="btn-ghost btn-sm text-xs text-brand-600 hover:text-brand-700"
                          >
                            View →
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-surface-border">
                <span className="text-sm text-ink-secondary">
                  Showing {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of {total}
                </span>
                <div className="flex gap-2">
                  {pageParam > 1 && (
                    <Link
                      href={`/chargebacks?page=${pageParam - 1}`}
                      className="btn-secondary btn-sm"
                    >
                      ← Previous
                    </Link>
                  )}
                  {pageParam < totalPages && (
                    <Link
                      href={`/chargebacks?page=${pageParam + 1}`}
                      className="btn-primary btn-sm"
                    >
                      Next →
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

/* ─── Status Summary ─────────────────────────────────────────────────────── */

const STATUS_CARD_CONFIG = {
  pending: {
    label: 'Pending',
    icon: Clock,
    iconBg: 'bg-warning-100',
    iconColor: 'text-warning-600',
    cardBorder: 'border-l-warning-400',
    countColor: 'text-warning-700',
    amountLabel: 'At risk',
    amountColor: 'text-warning-600',
  },
  under_review: {
    label: 'Under Review',
    icon: Search,
    iconBg: 'bg-brand-100',
    iconColor: 'text-brand-600',
    cardBorder: 'border-l-brand-400',
    countColor: 'text-brand-700',
    amountLabel: 'In dispute',
    amountColor: 'text-brand-600',
  },
  won: {
    label: 'Won',
    icon: Trophy,
    iconBg: 'bg-success-100',
    iconColor: 'text-success-700',
    cardBorder: 'border-l-success-400',
    countColor: 'text-success-700',
    amountLabel: 'Recovered',
    amountColor: 'text-success-700',
  },
  lost: {
    label: 'Lost',
    icon: XCircle,
    iconBg: 'bg-danger-100',
    iconColor: 'text-danger-600',
    cardBorder: 'border-l-danger-400',
    countColor: 'text-danger-700',
    amountLabel: 'Lost',
    amountColor: 'text-danger-600',
  },
}

function StatusSummary({
  chargebacks,
  currency,
  loading,
}: {
  chargebacks: any[]
  currency: string
  loading: boolean
}) {
  const statuses: ChargebackStatus[] = ['pending', 'under_review', 'won', 'lost']

  const stats = statuses.reduce((acc, s) => {
    const filtered = chargebacks.filter((c) => c.status === s)
    acc[s] = {
      count: filtered.length,
      amount: filtered.reduce((sum: number, c: any) => sum + Number(c.amount), 0),
    }
    return acc
  }, {} as Record<ChargebackStatus, { count: number; amount: number }>)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statuses.map((s) => {
        const cfg = STATUS_CARD_CONFIG[s]
        const Icon = cfg.icon
        const { count, amount } = stats[s]
        return (
          <Link
            key={s}
            href={`/chargebacks?status=${s}`}
            className={`group bg-surface rounded-xl border border-surface-border border-l-4 ${cfg.cardBorder} p-4 shadow-card hover:shadow-card-hover hover:-translate-y-px transition-all duration-150`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${cfg.iconBg}`}>
                <Icon className={`w-4 h-4 ${cfg.iconColor}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-ink-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className={`text-2xl font-bold tabular-nums mb-0.5 ${cfg.countColor}`}>
              {loading ? '–' : count}
            </div>
            <div className="text-sm font-medium text-ink mb-2">{cfg.label}</div>
            {!loading && amount > 0 && (
              <div className={`text-xs font-medium ${cfg.amountColor}`}>
                {cfg.amountLabel} · {formatCurrency(amount, currency)}
              </div>
            )}
          </Link>
        )
      })}
    </div>
  )
}

/* ─── Status Badge ───────────────────────────────────────────────────────── */

const STATUS_BADGE_CONFIG = {
  pending: {
    label: 'Pending',
    icon: Clock,
    classes: 'bg-warning-50 text-warning-700 border border-warning-200',
    iconColor: 'text-warning-500',
  },
  under_review: {
    label: 'Under Review',
    icon: Search,
    classes: 'bg-brand-50 text-brand-700 border border-brand-200',
    iconColor: 'text-brand-500',
  },
  won: {
    label: 'Won',
    icon: Trophy,
    classes: 'bg-success-50 text-success-700 border border-success-200',
    iconColor: 'text-success-600',
  },
  lost: {
    label: 'Lost',
    icon: XCircle,
    classes: 'bg-danger-50 text-danger-700 border border-danger-200',
    iconColor: 'text-danger-500',
  },
}

function StatusBadge({ status }: { status: ChargebackStatus }) {
  const cfg = STATUS_BADGE_CONFIG[status]
  const Icon = cfg.icon
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.classes}`}
    >
      <Icon className={`w-3 h-3 ${cfg.iconColor}`} />
      {cfg.label}
    </span>
  )
}
