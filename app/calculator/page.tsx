'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ShieldCheck, ArrowRight, Calculator, TrendingDown, AlertTriangle, CheckCircle2,
} from 'lucide-react'

export default function CalculatorPage() {
  const [orders, setOrders]         = useState('')
  const [aov, setAov]               = useState('')
  const [disputeRate, setDisputeRate] = useState('')
  const [calculated, setCalculated] = useState(false)

  const ordersNum      = parseFloat(orders)      || 0
  const aovNum         = parseFloat(aov)          || 0
  const disputeRateNum = parseFloat(disputeRate)  || 0

  // Chargeback cost = dispute count × (AOV + fees + time penalty)
  const monthlyRevenue      = ordersNum * aovNum
  const monthlyDisputes     = ordersNum * (disputeRateNum / 100)
  const feePerDispute       = 25  // avg bank fee
  const lostRevenuePerDispute = aovNum
  const monthlyCost         = monthlyDisputes * (lostRevenuePerDispute + feePerDispute)
  const yearlyCost          = monthlyCost * 12
  const yearlyAtRisk        = monthlyRevenue * 12 * (disputeRateNum / 100)
  const percentOfRevenue    = monthlyRevenue > 0 ? ((monthlyCost / monthlyRevenue) * 100).toFixed(1) : '0'

  const riskLevel =
    disputeRateNum >= 2   ? { label: 'Critical', color: 'text-danger-700', bg: 'bg-danger-50', border: 'border-danger-200' } :
    disputeRateNum >= 1   ? { label: 'High', color: 'text-warning-700', bg: 'bg-warning-50', border: 'border-warning-200' } :
    disputeRateNum >= 0.5 ? { label: 'Moderate', color: 'text-brand-700', bg: 'bg-brand-50', border: 'border-brand-200' } :
                            { label: 'Low', color: 'text-success-700', bg: 'bg-success-50', border: 'border-success-200' }

  const canCalculate = ordersNum > 0 && aovNum > 0 && disputeRateNum > 0

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-slate-900 tracking-tight">Chargeback Shield</span>
          </Link>
          <Link href="/auth/signup" className="btn-primary text-sm">
            Start Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" />
            Free Tool
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Chargeback Loss Calculator</h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Find out how much your business could be losing to chargebacks every year — and what you can do about it.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">

          {/* Input form */}
          <div className="card p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-900">Enter your numbers</h2>

            <div>
              <label className="label">Monthly Orders</label>
              <input
                type="number"
                className="input"
                placeholder="e.g. 500"
                value={orders}
                onChange={e => { setOrders(e.target.value); setCalculated(false) }}
                min="0"
              />
              <p className="text-xs text-slate-500 mt-1.5">How many orders do you process per month?</p>
            </div>

            <div>
              <label className="label">Average Order Value (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                <input
                  type="number"
                  className="input pl-7"
                  placeholder="e.g. 75"
                  value={aov}
                  onChange={e => { setAov(e.target.value); setCalculated(false) }}
                  min="0"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1.5">Your typical order size in USD</p>
            </div>

            <div>
              <label className="label">Estimated Dispute Rate (%)</label>
              <div className="relative">
                <input
                  type="number"
                  className="input pr-7"
                  placeholder="e.g. 1.2"
                  value={disputeRate}
                  onChange={e => { setDisputeRate(e.target.value); setCalculated(false) }}
                  min="0"
                  max="100"
                  step="0.1"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">%</span>
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Industry average is ~0.5–1%. Card networks flag accounts over 1%.
              </p>
              {/* Common rates */}
              <div className="flex gap-2 mt-2 flex-wrap">
                {['0.5', '1.0', '1.5', '2.0'].map(v => (
                  <button
                    key={v}
                    onClick={() => { setDisputeRate(v); setCalculated(false) }}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${disputeRate === v ? 'bg-brand-50 border-brand-300 text-brand-700 font-semibold' : 'border-slate-200 text-slate-600 hover:border-brand-200'}`}
                  >
                    {v}%
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setCalculated(true)}
              disabled={!canCalculate}
              className="btn-primary w-full justify-center"
            >
              <Calculator className="w-4 h-4" />
              Calculate My Loss
            </button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {calculated && canCalculate ? (
              <>
                {/* Main result */}
                <div className={`rounded-2xl border p-6 ${riskLevel.bg} ${riskLevel.border}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-sm font-semibold text-slate-900">Estimated Yearly Loss</div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${riskLevel.bg} ${riskLevel.border} ${riskLevel.color}`}>
                      {riskLevel.label} Risk
                    </span>
                  </div>
                  <div className="text-5xl font-bold text-slate-900 mb-1 tabular-nums">{fmt(yearlyCost)}</div>
                  <p className="text-sm text-slate-600">
                    You could lose approximately <strong>{fmt(yearlyCost)}/year</strong> from chargebacks
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    That's {percentOfRevenue}% of your total annual revenue
                  </p>
                </div>

                {/* Breakdown */}
                <div className="card p-5 space-y-3">
                  <div className="text-sm font-semibold text-slate-900 mb-1">Monthly Breakdown</div>
                  {[
                    { label: 'Monthly disputes', val: Math.round(monthlyDisputes).toString(), sub: 'cases/mo' },
                    { label: 'Revenue at risk monthly', val: fmt(monthlyCost), sub: 'direct loss' },
                    { label: 'Bank fees monthly', val: fmt(monthlyDisputes * feePerDispute), sub: `~$${feePerDispute}/dispute` },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0">
                      <span className="text-sm text-slate-600">{row.label}</span>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-slate-900">{row.val}</span>
                        <span className="text-xs text-slate-500 ml-1">{row.sub}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Warning if high */}
                {disputeRateNum >= 1 && (
                  <div className="flex gap-3 rounded-xl border border-warning-200 bg-warning-50 px-4 py-3">
                    <AlertTriangle className="w-4 h-4 text-warning-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-warning-800">
                      A dispute rate above 1% can trigger account reviews from Visa and Mastercard, leading to higher processing fees or account holds.
                    </p>
                  </div>
                )}

                {/* CTA */}
                <div className="card p-6 text-center border-brand-200 bg-brand-50 dark:bg-brand-950/20">
                  <ShieldCheck className="w-10 h-10 text-brand-600 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-900 text-lg mb-1">Protect Your Store</h3>
                  <p className="text-sm text-slate-600 mb-5">
                    Chargeback Shield helps you organize disputes, build stronger cases, and recover more revenue — starting free.
                  </p>
                  <ul className="space-y-1.5 text-sm text-left mb-5">
                    {[
                      'Track every dispute in one place',
                      'Organize evidence for faster responses',
                      'Monitor win rate and revenue trends',
                    ].map(item => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success-600 flex-shrink-0" />
                        <span className="text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/signup" className="btn-primary w-full justify-center text-base py-3">
                    Start Free — No Card Required
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="card p-10 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-white-tertiary rounded-2xl flex items-center justify-center">
                  <TrendingDown className="w-8 h-8 text-slate-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Your results will appear here</h3>
                  <p className="text-sm text-slate-600">Fill in your numbers on the left to see your estimated annual chargeback exposure.</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
