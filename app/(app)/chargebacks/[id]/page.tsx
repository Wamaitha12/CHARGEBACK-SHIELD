'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDateTime, STATUS_CONFIG } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import ChargebackDetailClient from '@/components/chargebacks/ChargebackDetailClient'

export default function ChargebackDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [chargeback, setChargeback] = useState<any>(null)
  const [timeline, setTimeline] = useState<any[]>([])
  const [evidence, setEvidence] = useState<any[]>([])
  const [currency, setCurrency] = useState('USD')
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }))

      if (!user) {
        router.push('/auth/login')
        return
      }

      setUserId(user.id)

      const { data: chargebackData } = await supabase
        .from('chargebacks')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (!chargebackData) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setChargeback(chargebackData)

      const [{ data: timelineData }, { data: evidenceData }, { data: profileData }] =
        await Promise.all([
          supabase
            .from('timeline_events')
            .select('*')
            .eq('chargeback_id', id)
            .order('created_at', { ascending: true }),
          supabase
            .from('evidence_files')
            .select('*')
            .eq('chargeback_id', id)
            .order('created_at', { ascending: false }),
          supabase.from('user_profiles').select('currency').eq('user_id', user.id).single(),
        ])

      setTimeline(timelineData || [])
      setEvidence(evidenceData || [])
      setCurrency(profileData?.currency || 'USD')
      setLoading(false)
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-4xl animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/chargebacks" className="btn-ghost btn-sm p-2">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1">
            <div className="h-6 w-48 bg-surface-secondary rounded animate-pulse mb-2" />
            <div className="h-4 w-32 bg-surface-secondary rounded animate-pulse" />
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="max-w-4xl animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/chargebacks" className="btn-ghost btn-sm p-2">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
        <div className="card p-12 text-center">
          <p className="text-lg font-semibold text-ink mb-2">Chargeback not found</p>
          <p className="text-sm text-ink-secondary mb-6">
            This dispute may have been deleted or you don't have access to it.
          </p>
          <Link href="/chargebacks" className="btn-primary">
            Back to Active Disputes
          </Link>
        </div>
      </div>
    )
  }

  const s = STATUS_CONFIG[chargeback.status as keyof typeof STATUS_CONFIG]

  return (
    <div className="max-w-4xl animate-fade-in">
      {/* Back nav */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/chargebacks" className="btn-ghost btn-sm p-2">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-ink">{chargeback.customer_name}</h1>
            <span className={`badge ${s.bg} ${s.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              {s.label}
            </span>
          </div>
          <p className="text-sm text-ink-secondary">{chargeback.customer_email}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-ink tabular-nums">
            {formatCurrency(chargeback.amount, currency)}
          </div>
          <div className="text-xs text-ink-tertiary">
            {formatDateTime(chargeback.transaction_date)}
          </div>
        </div>
      </div>

      <ChargebackDetailClient
        chargeback={chargeback}
        timeline={timeline}
        evidence={evidence}
        currency={currency}
        userId={userId}
      />
    </div>
  )
}
