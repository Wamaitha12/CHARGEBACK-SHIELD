'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate, STATUS_CONFIG, REASON_LABELS } from '@/lib/utils'
import Link from 'next/link'
import {
  FileWarning, TrendingDown, TrendingUp, Activity, Trophy,
  ArrowRight, Plus, ChevronRight, ShieldCheck, AlertTriangle,
  AlertCircle, Info, CheckCircle2, Zap, Loader2,
} from 'lucide-react'
import { Chargeback, ChargebackStatus } from '@/types'

export default function DashboardPage() {
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
        supabase.from('chargebacks').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('user_profiles').select('currency, business_name').eq('user_id', user.id).single(),
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

  // ── Core metrics ─────────────────────────────────────────────
  const totalLost        = all.filter(c => c.status === 'lost').reduce((s, c) => s + Number(c.amount), 0)
  const totalRecovered   = all.filter(c => c.status === 'won').reduce((s, c) => s + Number(c.amount), 0)
  const activeDisputes   = all.filter(c => c.status === 'pending' || c.status === 'under_review').length
  const wonCount         = all.filter(c => c.status === 'won').length
  const resolvedCount    = all.filter(c => c.status === 'won' || c.status === 'lost').length
  const winRate          = resolvedCount > 0 ? Math.round((wonCount / resolvedCount) * 100) : 0
  const winRateGood      = winRate >= 50
  const activeAtRisk     = all.filter(c => c.status === 'pending' || c.status === 'under_review').reduce((s, c) => s + Number(c.amount), 0)
  const revenueProtected = totalRecovered

  // ── Last 30 days activity ─────────────────────────────────────
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recent30    = all.filter(c => new Date(c.created_at) > thirtyDaysAgo)
  const prev30Start = new Date(thirtyDaysAgo)
  prev30Start.setDate(prev30Start.getDate() - 30)
  const prev30      = all.filter(c => {
    const d = new Date(c.created_at)
    return d > prev30Start && d <= thirtyDaysAgo
  })
  const activityChange = prev30.length > 0
    ? Math.round(((recent30.length - prev30.length) / prev30.length) * 100)
    : recent30.length > 0 ? 100 : 0

  // ── Revenue Risk Score ────────────────────────────────────────
  let riskScore = 100
  if (all.length > 0) {
    const unresolvedPenalty = Math.min(activeDisputes * 8, 40)
    const activityPenalty   = activityChange > 50 ? 30 : activityChange > 20 ? 15 : activityChange > 0 ? 5 : 0
    const winRatePenalty    = resolvedCount > 0 ? Math.round((1 - winRate / 100) * 30) : 0
    riskScore = Math.max(0, 100 - unresolvedPenalty - activityPenalty - winRatePenalty)
  }

  const riskLevel =
    riskScore >= 75 ? { label: 'Low Risk',    color: 'text-success-700', bg: 'bg-success-50', border: 'border-success-200', bar: 'bg-success-500', dot: 'bg-success-500' } :
    riskScore >= 45 ? { label: 'Medium Risk', color: 'text-warning-700', bg: 'bg-warning-50', border: 'border-warning-200', bar: 'bg-warning-500', dot: 'bg-warning-500' } :
                     { label: 'High Risk',   color: 'text-danger-700',  bg: 'bg-danger-50',  border: 'border-danger-200',  bar: 'bg-danger-500',  dot: 'bg-danger-500' }

  // ── Onboarding state ──────────────────────────────────────────
  const hasDisputes    = all.length > 0
  const hasEvidence    = all.some(c => c.notes && c.notes.length > 10)
  const hasInsights    = resolvedCount > 0
  const onboardingDone = hasDisputes && hasEvidence && hasInsights

  // ── Alerts ────────────────────────────────────────────────────
  const alerts: { level: 'danger' | 'warning' | 'info'; message: string; detail: string }[] = []
  if (activeDisputes >= 4)
    alerts.push({ level: 'danger', message: `${activeDisputes} active disputes need your response`, detail: 'Unresponded disputes may be automatically decided against you.' })
  if (activityChange >= 25 && recent30.length >= 2)
    alerts.push({ level: 'warning', message: `Dispute activity increased by ${activityChange}%`, detail: 'Unusual spike in the last 30 days. Review for patterns.' })
  if (winRate < 40 && resolvedCount >= 3)
    alerts.push({ level: 'warning', message: `Win rate is ${winRate}% — below the healthy threshold`, detail: 'Improving evidence quality can significantly raise win rates.' })
  if (riskScore < 45 && all.length > 0)
    alerts.push({ level: 'danger', message: 'Your dispute rate may impact payment processor standing', detail: 'High chargeback rates can lead to increased processing fees or account holds.' })

  const recent = all.slice(0, 8)

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Revenue Protection Center</h1>
          <p className="text-sm text-ink-secondary mt-0.5">
            {all.length > 0
              ? `${all.length} dispute${all.length !== 1 ? 's' : ''} tracked · ${activeDisputes} active`
              : 'Your business health at a glance'}
          </p>
        </div>
        <Link href="/chargebacks/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Dispute
        </Link>
      </div>

      {/* Onboarding */}
      {!onboardingDone && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-brand-600" />
            <span className="text-sm font-semibold text-ink">Get started — 3 steps to full protection</span>
            <span className="ml-auto text-xs text-ink-tertiary">
              {[hasDisputes, hasEvidence, hasInsights].filter(Boolean).length}/3 complete
            </span>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { done: hasDisputes, step: '01', title: 'Add your first dispute', desc: 'Log a case to start tracking', href: '/chargebacks/new' },
              { done: hasEvidence, step: '02', title: 'Upload evidence',        desc: 'Attach proof to your cases',  href: hasDisputes ? '/chargebacks' : undefined },
              { done: hasInsights, step: '03', title: 'Track dispute insights', desc: 'Win a case to see analytics', href: '/analytics' },
            ].map((s) => (
              <div key={s.step} className={`rounded-xl border p-4 relative overflow-hidden ${s.done ? 'bg-success-50 border-success-200' : 'bg-surface-secondary border-surface-border'}`}>
                {s.done && <div className="absolute inset-0 bg-success-50/50" />}
                <div className="relative flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${s.done ? 'bg-success-500 text-white' : 'bg-surface-border text-ink-tertiary'}`}>
                    {s.done ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold ${s.done ? 'text-success-700 line-through' : 'text-ink'}`}>{s.title}</div>
                    <div className="text-xs text-ink-tertiary mt-0.5">{s.desc}</div>
                    {!s.done && s.href && (
                      <Link href={s.href} className="inline-flex items-center gap-1 text-xs text-brand-600 font-medium mt-2 hover:underline">
                        Start <ChevronRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 h-1.5 bg-surface-border rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-700"
              style={{ width: `${([hasDisputes, hasEvidence, hasInsights].filter(Boolean).length / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Alert Center */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((a, i) => {
            const Icon = a.level === 'danger' ? AlertCircle : a.level === 'warning' ? AlertTriangle : Info
            const styles = { danger: 'bg-danger-50 border-danger-200', warning: 'bg-warning-50 border-warning-200', info: 'bg-brand-50 border-brand-200' }[a.level]
            const iconStyles = { danger: 'text-danger-600', warning: 'text-warning-600', info: 'text-brand-600' }[a.level]
            const textStyles = { danger: 'text-danger-800', warning: 'text-warning-800', info: 'text-brand-800' }[a.level]
            const detailStyles = { danger: 'text-danger-600', warning: 'text-warning-700', info: 'text-brand-600' }[a.level]
            return (
              <div key={i} className={`rounded-xl border px-4 py-3 flex items-start gap-3 ${styles}`}>
                <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${iconStyles}`} />
                <div>
                  <p className={`text-sm font-semibold ${textStyles}`}>{a.message}</p>
                  <p className={`text-xs mt-0.5 ${detailStyles}`}>{a.detail}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 border-t-4 border-t-brand-500">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider">Active Disputes</span>
            <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
              <FileWarning className="w-4 h-4 text-brand-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-ink tabular-nums mb-0.5">{all.length}</div>
          <div className="text-xs text-ink-tertiary">{activeDisputes} need attention</div>
        </div>

        <div className="card p-5 border-t-4 border-t-danger-500">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider">Revenue Lost</span>
            <div className="w-8 h-8 bg-danger-50 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-danger-500" />
            </div>
          </div>
          <div className="text-3xl font-bold text-danger-600 tabular-nums mb-0.5 leading-none">
            {formatCurrency(totalLost, currency)}
          </div>
          <div className="text-xs text-ink-tertiary">From lost disputes</div>
        </div>

        <div className="card p-5 border-t-4 border-t-success-500 relative overflow-hidden">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider">Revenue Protected</span>
            <div className="w-8 h-8 bg-success-50 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-success-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-success-700 tabular-nums mb-0.5 leading-none">
            {formatCurrency(revenueProtected, currency)}
          </div>
          <div className="flex items-center gap-1 text-xs">
            {revenueProtected > 0
              ? <><TrendingUp className="w-3 h-3 text-success-600" /><span className="text-success-700 font-medium">Protected · won disputes</span></>
              : <span className="text-ink-tertiary">Win disputes to grow this</span>
            }
          </div>
          {activeAtRisk > 0 && (
            <div className="mt-2 text-xs text-warning-700">{formatCurrency(activeAtRisk, currency)} currently at risk</div>
          )}
        </div>

        <div className={`card p-5 border-t-4 ${winRateGood ? 'border-t-success-500' : 'border-t-danger-500'}`}>
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider">Win Rate</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${winRateGood ? 'bg-success-50' : 'bg-danger-50'}`}>
              <Trophy className={`w-4 h-4 ${winRateGood ? 'text-success-600' : 'text-danger-500'}`} />
            </div>
          </div>
          <div className={`text-3xl font-bold tabular-nums mb-2 leading-none ${winRateGood ? 'text-success-700' : 'text-danger-600'}`}>
            {winRate}%
          </div>
          <div className="w-full h-1.5 bg-surface-tertiary rounded-full mb-1.5 overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${winRateGood ? 'bg-success-500' : 'bg-danger-500'}`} style={{ width: `${winRate}%` }} />
          </div>
          <div className="text-xs text-ink-tertiary">{wonCount} won · {resolvedCount - wonCount} lost</div>
        </div>
      </div>

      {/* Risk Score + Active Banner */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className={`card p-5 border ${riskLevel.border}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider mb-0.5">Business Health Metric</div>
              <div className="text-sm font-semibold text-ink">Revenue Risk Score</div>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${riskLevel.bg} ${riskLevel.color} ${riskLevel.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${riskLevel.dot}`} />
              {riskLevel.label}
            </span>
          </div>
          <div className="flex items-end gap-3 mb-4">
            <span className={`text-5xl font-bold tabular-nums leading-none ${riskLevel.color}`}>{riskScore}</span>
            <span className="text-xl text-ink-tertiary mb-1">/100</span>
          </div>
          <div className="w-full h-2.5 bg-surface-tertiary rounded-full overflow-hidden mb-3">
            <div className={`h-full rounded-full transition-all duration-700 ${riskLevel.bar}`} style={{ width: `${riskScore}%` }} />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Low',    range: '75–100', active: riskScore >= 75,                    color: 'text-success-600', bg: 'bg-success-50 border-success-200' },
              { label: 'Medium', range: '45–74',  active: riskScore >= 45 && riskScore < 75,  color: 'text-warning-600', bg: 'bg-warning-50 border-warning-200' },
              { label: 'High',   range: '0–44',   active: riskScore < 45,                     color: 'text-danger-600',  bg: 'bg-danger-50 border-danger-200'   },
            ].map(r => (
              <div key={r.label} className={`rounded-lg border px-2 py-1.5 text-xs ${r.active ? `${r.bg} font-semibold ${r.color}` : 'border-surface-border text-ink-tertiary'}`}>
                <div className="font-semibold">{r.label}</div>
                <div className="opacity-70">{r.range}</div>
              </div>
            ))}
          </div>
          {activityChange !== 0 && (
            <p className={`text-xs mt-3 flex items-center gap-1 ${activityChange > 0 ? 'text-warning-700' : 'text-success-700'}`}>
              {activityChange > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              Store dispute activity {activityChange > 0 ? 'increased' : 'decreased'} by {Math.abs(activityChange)}% vs last period
            </p>
          )}
        </div>

        {activeDisputes > 0 ? (
          <div className="card p-5 border border-brand-200 bg-brand-50">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 bg-brand-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-brand-600" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-brand-500 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">
                  {activeDisputes} dispute{activeDisputes !== 1 ? 's' : ''} need{activeDisputes === 1 ? 's' : ''} attention
                </p>
                <p className="text-xs text-ink-secondary">Review evidence and respond before deadlines</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              {all.filter(c => c.status === 'pending' || c.status === 'under_review').slice(0, 3).map(c => (
                <Link key={c.id} href={`/chargebacks/${c.id}`}
                  className="flex items-center justify-between rounded-lg bg-white/60 border border-brand-100 px-3 py-2 hover:bg-white/80 transition-colors">
                  <span className="text-xs font-medium text-ink truncate">{c.customer_name}</span>
                  <span className="text-xs text-brand-600 font-semibold ml-2">{formatCurrency(Number(c.amount), currency)}</span>
                </Link>
              ))}
            </div>
            <Link href="/chargebacks?status=pending" className="btn-primary btn-sm w-full justify-center">
              Review all active disputes <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="card p-5 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 bg-success-50 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-success-600" />
            </div>
            <div>
              <p className="font-semibold text-ink">No active disputes</p>
              <p className="text-sm text-ink-secondary mt-1">Your revenue is fully protected right now.</p>
            </div>
            <Link href="/chargebacks/new" className="btn-secondary btn-sm mt-1">
              <Plus className="w-3.5 h-3.5" /> Log a new dispute
            </Link>
          </div>
        )}
      </div>

      {/* Recent Disputes Table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <div>
            <h2 className="font-semibold text-ink">Recent Active Disputes</h2>
            <p className="text-xs text-ink-tertiary mt-0.5">Latest cases across your account</p>
          </div>
          <Link href="/chargebacks" className="btn-ghost btn-sm gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 bg-surface-tertiary rounded-xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6 text-ink-tertiary" />
            </div>
            <h3 className="font-semibold text-ink mb-1">No disputes tracked yet</h3>
            <p className="text-sm text-ink-secondary mb-6 max-w-xs mx-auto">
              Log your first dispute to start protecting revenue and tracking outcomes.
            </p>
            <Link href="/chargebacks/new" className="btn-primary">
              <Plus className="w-4 h-4" /> Add first dispute
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {recent.map((c) => {
              const s   = STATUS_CONFIG[c.status as ChargebackStatus]
              const ini = c.customer_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
              return (
                <Link key={c.id} href={`/chargebacks/${c.id}`}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-surface-secondary transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-surface-tertiary flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-ink-secondary">{ini}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-ink group-hover:text-brand-600 transition-colors truncate">{c.customer_name}</div>
                    <div className="text-xs text-ink-tertiary truncate">{c.customer_email}</div>
                  </div>
                  <div className="hidden md:block w-44 flex-shrink-0">
                    <span className="text-xs text-ink-secondary truncate block">
                      {REASON_LABELS[c.reason as keyof typeof REASON_LABELS] || c.reason}
                    </span>
                  </div>
                  <div className="hidden sm:block text-xs text-ink-tertiary whitespace-nowrap w-24 text-right flex-shrink-0">
                    {formatDate(c.transaction_date)}
                  </div>
                  <div className="font-semibold text-sm text-ink tabular-nums whitespace-nowrap w-20 text-right flex-shrink-0">
                    {formatCurrency(Number(c.amount), currency)}
                  </div>
                  <div className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0
                    ${c.status === 'won'          ? 'bg-success-50 text-success-700 border-success-200' : ''}
                    ${c.status === 'lost'         ? 'bg-danger-50 text-danger-700 border-danger-200'   : ''}
                    ${c.status === 'pending'      ? 'bg-warning-50 text-warning-700 border-warning-200' : ''}
                    ${c.status === 'under_review' ? 'bg-brand-50 text-brand-700 border-brand-200'      : ''}
                  `}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
