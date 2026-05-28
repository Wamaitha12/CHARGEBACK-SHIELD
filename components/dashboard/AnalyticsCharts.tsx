'use client'

import { useEffect, useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { REASON_LABELS } from '@/lib/utils'
import { DisputeReason } from '@/types'

interface Props {
  monthlyTrend: { month: string; chargebacks: number; won: number; lost: number; amount: number }[]
  reasonChart: { reason: string; count: number }[]
  won: number
  lost: number
  pending: number
  winRate: number
  currency: string
}

// Detect dark mode and return appropriate chart palette
function useChartTheme() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])
  return {
    grid:      dark ? '#334155' : '#f1f5f9',
    axis:      dark ? '#64748b' : '#94a3b8',
    tooltip:   dark ? '#1e293b' : '#ffffff',
    tooltipBorder: dark ? '#334155' : '#e2e8f0',
    tooltipText:   dark ? '#f1f5f9' : '#0f172a',
    tooltipSub:    dark ? '#94a3b8' : '#475569',
  }
}

const REASON_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#06b6d4', '#ec4899', '#10b981']

function CustomTooltip({ active, payload, label }: any) {
  const t = useChartTheme()
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: t.tooltip, border: `1px solid ${t.tooltipBorder}` }}
         className="rounded-xl shadow-dropdown p-3 text-sm min-w-[140px]">
      {label && <div style={{ color: t.tooltipText }} className="font-semibold mb-2">{label}</div>}
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
            <span style={{ color: t.tooltipSub }} className="capitalize">{p.name}</span>
          </div>
          <span style={{ color: t.tooltipText }} className="font-semibold tabular-nums">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsCharts({ monthlyTrend, reasonChart, won, lost, pending, winRate, currency }: Props) {
  const t = useChartTheme()

  const pieData = [
    { name: 'Won',    value: won,     color: '#22c55e' },
    { name: 'Lost',   value: lost,    color: '#f43f5e' },
    { name: 'Active', value: pending, color: '#3b82f6' },
  ].filter(d => d.value > 0)

  const total = won + lost + pending

  const reasonData = reasonChart.map((r, i) => ({
    reason: REASON_LABELS[r.reason as DisputeReason] || r.reason,
    count: r.count,
    color: REASON_COLORS[i % REASON_COLORS.length],
    pct: total > 0 ? Math.round((r.count / total) * 100) : 0,
  }))

  const maxCount = Math.max(...reasonData.map(r => r.count), 1)

  return (
    <div className="space-y-6">

      {/* Monthly trend — full width */}
      <div className="card p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-semibold text-ink">Monthly Chargeback Trend</h3>
            <p className="text-xs text-ink-tertiary mt-0.5">Disputes opened per month over the last 12 months</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-ink-secondary">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded bg-brand-500 inline-block" />
              Total
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded bg-success-500 inline-block" />
              Won
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded bg-danger-400 inline-block" />
              Lost
            </span>
          </div>
        </div>
        {monthlyTrend.length === 0 ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyTrend} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gWon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gLost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={t.grid} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: t.axis }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: t.axis }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: t.grid, strokeWidth: 1 }} />
              <Area type="monotone" dataKey="chargebacks" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gTotal)" name="Total" dot={false} activeDot={{ r: 4 }} />
              <Area type="monotone" dataKey="won"         stroke="#22c55e" strokeWidth={2}   fill="url(#gWon)"   name="Won"   dot={false} activeDot={{ r: 4 }} />
              <Area type="monotone" dataKey="lost"        stroke="#f43f5e" strokeWidth={2}   fill="url(#gLost)"  name="Lost"  dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Win rate donut */}
        <div className="card p-6">
          <div className="mb-5">
            <h3 className="font-semibold text-ink">Dispute Outcomes</h3>
            <p className="text-xs text-ink-tertiary mt-0.5">Breakdown of all {total} disputes</p>
          </div>
          {pieData.length === 0 ? <EmptyChart /> : (
            <div className="flex items-center gap-6">
              {/* Donut with centered % */}
              <div className="relative flex-shrink-0" style={{ width: 160, height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%" cy="50%"
                      innerRadius={52} outerRadius={72}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {pieData.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className={`text-2xl font-bold tabular-nums ${winRate >= 50 ? 'text-success-600' : 'text-danger-600'}`}>
                    {winRate}%
                  </span>
                  <span className="text-xs text-ink-tertiary">win rate</span>
                </div>
              </div>

              {/* Legend / stats */}
              <div className="flex-1 space-y-3">
                {pieData.map((d) => {
                  const pct = total > 0 ? Math.round((d.value / total) * 100) : 0
                  return (
                    <div key={d.name}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                          <span className="text-sm text-ink-secondary">{d.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-ink tabular-nums">{d.value}</span>
                          <span className="text-xs text-ink-tertiary w-8 text-right">{pct}%</span>
                        </div>
                      </div>
                      <div className="h-1 rounded-full bg-surface-tertiary overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500"
                             style={{ width: `${pct}%`, background: d.color }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Top dispute reasons */}
        <div className="card p-6">
          <div className="mb-5">
            <h3 className="font-semibold text-ink">Top Dispute Reasons</h3>
            <p className="text-xs text-ink-tertiary mt-0.5">Most common chargeback categories</p>
          </div>
          {reasonData.length === 0 ? <EmptyChart /> : (
            <div className="space-y-3.5">
              {reasonData.map((r, i) => (
                <div key={r.reason}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-ink-secondary truncate pr-4 max-w-[200px]" title={r.reason}>
                      {r.reason}
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-semibold text-ink tabular-nums">{r.count}</span>
                      <span className="text-xs text-ink-tertiary w-7 text-right">{r.pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-surface-tertiary overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(r.count / maxCount) * 100}%`,
                        background: r.color,
                        opacity: 0.85,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

function EmptyChart() {
  return (
    <div className="h-48 flex flex-col items-center justify-center gap-2">
      <div className="w-10 h-10 rounded-full bg-surface-tertiary flex items-center justify-center">
        <span className="text-ink-tertiary text-lg">📊</span>
      </div>
      <p className="text-sm text-ink-tertiary">Add chargebacks to see data here</p>
    </div>
  )
}
