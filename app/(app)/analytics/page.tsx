'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import AnalyticsCharts from '@/components/dashboard/AnalyticsCharts'
import { Chargeback } from '@/types'
import { Trophy, TrendingUp, TrendingDown, Activity, BarChart3, Loader2 } from 'lucide-react'

export default function AnalyticsPage() {
  const router = useRouter()
  const [all, setAll] = useState<Chargeback[]>([])
  const [currency, setCurrency] = useState('USD')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }))

      if (!user) {
        router.push('/auth/login')
        return
      }

      const [{ data: chargebacks }, { data: profile }] = await Promise.all([
        supabase.from('chargebacks').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
        supabase.from('user_profiles').select('currency').eq('user_id', user.id).single(),
      ])

      setAll((chargebacks as Chargeback[]) || [])
      setCurrency(profile?.currency || 'USD')
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    )
  }

  // Monthly trend
  const monthlyData: Record<string, { month: string; chargebacks: number; won: number; lost: number; amount: number }> = {}
  all.forEach((c) => {
    const d     = new Date(c.created_at)
    const key   = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    if (!monthlyData[key]) monthlyData[key] = { month: label, chargebacks: 0, won: 0, lost: 0, amount: 0 }
    monthlyData[key].chargebacks++
    monthlyData[key].amount += Number(c.amount)
    if (c.status === 'won')  monthlyData[key].won++
    if (c.status === 'lost') monthlyData[key].lost++
  })
  const monthlyTrend = Object.values(monthlyData).slice(-12)

  // Reason breakdown
  const reasonData: Record<string, number> = {}
  all.forEach((c) => { reasonData[c.reason] = (reasonData[c.reason] || 0) + 1 })
  const reasonChart = Object.entries(reasonData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([reason, count]) => ({ reason, count }))

  // Stats
  const won      = all.filter(c => c.status === 'won').length
  const lost     = all.filter(c => c.status === 'lost').length
  const pending  = all.filter(c => c.status === 'pending' || c.status === 'under_review').length
  const resolved = won + lost
  const winRate  = resolved > 0 ? Math.round((won / resolved) * 100) : 0

  const totalProtected = all.filter(c => c.status === 'won').reduce((s, c) => s + Number(c.amount), 0)
  const totalLost      = all.filter(c => c.status === 'lost').reduce((s, c) => s + Number(c.amount), 0)
  const avgAmount      = all.length > 0 ? all.reduce((s, c) => s + Number(c.amount), 0) / all.length : 0

  const winRateGood = winRate >= 50

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-brand-600" />
            <h1 className="text-2xl font-bold text-ink">Revenue Insights</h1>
          </div>
          <p className="text-ink-secondary text-sm">
            Business health metrics across {all.length} dispute{all.length !== 1 ? 's' : ''} — spot patterns, protect revenue.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Win Rate */}
        <div className={`card p-5 border-t-4 ${winRateGood ? 'border-t-success-500' : 'border-t-danger-500'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider">Win Rate</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${winRateGood ? 'bg-success-50' : 'bg-danger-50'}`}>
              <Trophy className={`w-4 h-4 ${winRateGood ? 'text-success-600' : 'text-danger-500'}`} />
            </div>
          </div>
          <div className={`text-3xl font-bold tabular-nums mb-2 ${winRateGood ? 'text-success-700' : 'text-danger-600'}`}>
            {winRate}%
          </div>
          <div className="w-full h-1.5 bg-surface-tertiary rounded-full mb-2 overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${winRateGood ? 'bg-success-500' : 'bg-danger-500'}`} style={{ width: `${winRate}%` }} />
          </div>
          <div className="text-xs text-ink-tertiary">{won} won · {lost} lost</div>
        </div>

        {/* Revenue Protected */}
        <div className="card p-5 border-t-4 border-t-success-500">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider">Protected</span>
            <div className="w-8 h-8 bg-success-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-success-600" />
            </div>
          </div>
          <div className="text-3xl font-bold tabular-nums text-success-700 mb-2 leading-none">
            {formatCurrency(totalProtected, currency)}
          </div>
          <div className="w-full h-1.5 bg-surface-tertiary rounded-full mb-2">
            <div className="h-full rounded-full bg-success-500" style={{ width: resolved > 0 ? `${(won / resolved) * 100}%` : '0%' }} />
          </div>
          <div className="text-xs text-ink-tertiary">From {won} won dispute{won !== 1 ? 's' : ''}</div>
        </div>

        {/* Revenue Lost */}
        <div className="card p-5 border-t-4 border-t-danger-500">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider">Lost</span>
            <div className="w-8 h-8 bg-danger-50 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-danger-500" />
            </div>
          </div>
          <div className="text-3xl font-bold tabular-nums text-danger-600 mb-2 leading-none">
            {formatCurrency(totalLost, currency)}
          </div>
          <div className="w-full h-1.5 bg-surface-tertiary rounded-full mb-2">
            <div className="h-full rounded-full bg-danger-500" style={{ width: resolved > 0 ? `${(lost / resolved) * 100}%` : '0%' }} />
          </div>
          <div className="text-xs text-ink-tertiary">From {lost} lost dispute{lost !== 1 ? 's' : ''}</div>
        </div>

        {/* Avg Value */}
        <div className="card p-5 border-t-4 border-t-brand-500">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider">Avg. Value</span>
            <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-brand-600" />
            </div>
          </div>
          <div className="text-3xl font-bold tabular-nums text-ink mb-2 leading-none">
            {formatCurrency(avgAmount, currency)}
          </div>
          <div className="w-full h-1.5 bg-surface-tertiary rounded-full mb-2">
            <div className="h-full rounded-full bg-brand-500" style={{ width: all.length > 0 ? '100%' : '0%' }} />
          </div>
          <div className="text-xs text-ink-tertiary">{pending} still active</div>
        </div>

      </div>

      {/* Charts */}
      <AnalyticsCharts
        monthlyTrend={monthlyTrend}
        reasonChart={reasonChart}
        won={won}
        lost={lost}
        pending={pending}
        winRate={winRate}
        currency={currency}
      />

    </div>
  )
}
