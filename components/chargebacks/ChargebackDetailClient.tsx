'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  FileText, Upload, Clock, MessageSquare, Save, Trash2,
  Loader2, CheckCircle2, XCircle, Plus, File, X, Download
} from 'lucide-react'
import { formatDateTime, STATUS_CONFIG, REASON_LABELS } from '@/lib/utils'
import { Chargeback, TimelineEvent, EvidenceFile, ChargebackStatus, TimelineEventType } from '@/types'

interface Props {
  chargeback: Chargeback
  timeline: TimelineEvent[]
  evidence: EvidenceFile[]
  currency: string
  userId: string
}

const TIMELINE_ICONS: Record<TimelineEventType, React.ElementType> = {
  created: Plus,
  evidence_added: Upload,
  submitted: FileText,
  bank_response: MessageSquare,
  won: CheckCircle2,
  lost: XCircle,
  status_changed: Clock,
  note_added: MessageSquare,
}

const TIMELINE_COLORS: Record<TimelineEventType, string> = {
  created: 'bg-brand-100 text-brand-600',
  evidence_added: 'bg-warning-100 text-warning-600',
  submitted: 'bg-brand-100 text-brand-600',
  bank_response: 'bg-surface-tertiary text-ink-secondary',
  won: 'bg-success-100 text-success-600',
  lost: 'bg-danger-100 text-danger-600',
  status_changed: 'bg-surface-tertiary text-ink-secondary',
  note_added: 'bg-surface-tertiary text-ink-secondary',
}

export default function ChargebackDetailClient({
  chargeback: initial,
  timeline: initialTimeline,
  evidence: initialEvidence,
  currency,
  userId,
}: Props) {
  const router = useRouter()
  const [chargeback, setChargeback] = useState(initial)
  const [timeline, setTimeline] = useState(initialTimeline)
  const [evidence, setEvidence] = useState(initialEvidence)
  const [activeTab, setActiveTab] = useState<'details' | 'evidence' | 'timeline'>('details')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [addingNote, setAddingNote] = useState(false)
  const [newTimelineEvent, setNewTimelineEvent] = useState<TimelineEventType>('status_changed')
  const [newTimelineDesc, setNewTimelineDesc] = useState('')
  const [addingEvent, setAddingEvent] = useState(false)
  const [notes, setNotes] = useState(chargeback.notes || '')
  const [status, setStatus] = useState<ChargebackStatus>(chargeback.status)

  const supabase = createClient()

  const saveDetails = async () => {
    setSaving(true)
    const prevStatus = chargeback.status

    const { data } = await supabase
      .from('chargebacks')
      .update({ status, notes })
      .eq('id', chargeback.id)
      .select()
      .single()

    if (data) {
      setChargeback(data)

      if (prevStatus !== status) {
        const s = STATUS_CONFIG[status]
        const { data: event } = await supabase
          .from('timeline_events')
          .insert({
            chargeback_id: chargeback.id,
            user_id: userId,
            event_type: status === 'won' ? 'won' : status === 'lost' ? 'lost' : 'status_changed',
            description: `Status changed to ${s.label}`,
          })
          .select()
          .single()

        if (event) setTimeline((prev) => [...prev, event])
      }
    }

    setSaving(false)
    router.refresh()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)

    const path = `${userId}/${chargeback.id}/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('evidence')
      .upload(path, file)

    if (!uploadError) {
      const { data: fileRecord } = await supabase
        .from('evidence_files')
        .insert({
          chargeback_id: chargeback.id,
          user_id: userId,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_path: path,
        })
        .select()
        .single()

      if (fileRecord) setEvidence((prev) => [fileRecord, ...prev])

      // Add timeline event
      const { data: event } = await supabase
        .from('timeline_events')
        .insert({
          chargeback_id: chargeback.id,
          user_id: userId,
          event_type: 'evidence_added',
          description: `Evidence uploaded: ${file.name}`,
        })
        .select()
        .single()

      if (event) setTimeline((prev) => [...prev, event])
    }

    setUploading(false)
    e.target.value = ''
  }

  const handleDeleteEvidence = async (ev: EvidenceFile) => {
    await supabase.storage.from('evidence').remove([ev.storage_path])
    await supabase.from('evidence_files').delete().eq('id', ev.id)
    setEvidence((prev) => prev.filter((e) => e.id !== ev.id))
  }

  const handleGetEvidenceUrl = async (ev: EvidenceFile) => {
    const { data } = await supabase.storage
      .from('evidence')
      .createSignedUrl(ev.storage_path, 60)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  const addNote = async () => {
    if (!newNote.trim()) return
    setAddingNote(true)

    const { data: event } = await supabase
      .from('timeline_events')
      .insert({
        chargeback_id: chargeback.id,
        user_id: userId,
        event_type: 'note_added',
        description: newNote.trim(),
      })
      .select()
      .single()

    if (event) setTimeline((prev) => [...prev, event])
    setNewNote('')
    setAddingNote(false)
  }

  const addTimelineEvent = async () => {
    if (!newTimelineDesc.trim()) return
    setAddingEvent(true)

    const { data: event } = await supabase
      .from('timeline_events')
      .insert({
        chargeback_id: chargeback.id,
        user_id: userId,
        event_type: newTimelineEvent,
        description: newTimelineDesc.trim(),
      })
      .select()
      .single()

    if (event) setTimeline((prev) => [...prev, event])
    setNewTimelineDesc('')
    setAddingEvent(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const TABS = [
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'evidence', label: `Evidence (${evidence.length})`, icon: Upload },
    { id: 'timeline', label: `Timeline (${timeline.length})`, icon: Clock },
  ] as const

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-surface-secondary rounded-xl p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-ink shadow-sm'
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Details Tab */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6 space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-ink-tertiary">
              Dispute Details
            </h3>
            <div>
              <label className="label">Status</label>
              <select
                className="input"
                value={status}
                onChange={(e) => setStatus(e.target.value as ChargebackStatus)}
              >
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div>
              <label className="label">Reason</label>
              <div className="input bg-surface-secondary cursor-default text-ink-secondary">
                {REASON_LABELS[chargeback.reason] || chargeback.reason}
              </div>
            </div>
            {chargeback.reason_custom && (
              <div>
                <label className="label">Custom Reason</label>
                <div className="input bg-surface-secondary cursor-default text-ink-secondary">
                  {chargeback.reason_custom}
                </div>
              </div>
            )}
          </div>

          <div className="card p-6 space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-ink-tertiary">
              Notes
            </h3>
            <textarea
              className="input resize-none text-sm"
              rows={6}
              placeholder="Add notes about this dispute..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button onClick={saveDetails} disabled={saving} className="btn-primary">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Evidence Tab */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          {/* Upload area */}
          <div className="card p-6">
            <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-surface-border rounded-xl p-8 cursor-pointer hover:border-brand-300 hover:bg-brand-50/30 transition-all group">
              <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                {uploading ? (
                  <Loader2 className="w-6 h-6 text-brand-600 animate-spin" />
                ) : (
                  <Upload className="w-6 h-6 text-brand-600" />
                )}
              </div>
              <div className="text-center">
                <div className="font-medium text-sm text-ink mb-1">
                  {uploading ? 'Uploading...' : 'Upload evidence'}
                </div>
                <div className="text-xs text-ink-tertiary">
                  Receipts, screenshots, shipping proofs, PDFs — any file up to 50MB
                </div>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept="image/*,.pdf,.doc,.docx,.txt"
                disabled={uploading}
              />
            </label>
          </div>

          {/* File list */}
          {evidence.length === 0 ? (
            <div className="card py-12 text-center">
              <File className="w-10 h-10 text-ink-tertiary mx-auto mb-3" />
              <p className="text-sm text-ink-secondary">No evidence uploaded yet</p>
              <p className="text-xs text-ink-tertiary mt-1">Upload files above to strengthen your dispute</p>
            </div>
          ) : (
            <div className="card divide-y divide-surface-border">
              {evidence.map((ev) => (
                <div key={ev.id} className="flex items-center gap-4 p-4 hover:bg-surface-secondary/40 transition-colors">
                  <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <File className="w-5 h-5 text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-ink truncate">{ev.file_name}</div>
                    <div className="text-xs text-ink-tertiary">
                      {formatFileSize(ev.file_size)} · {formatDateTime(ev.created_at)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleGetEvidenceUrl(ev)}
                      className="btn-ghost btn-sm"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvidence(ev)}
                      className="btn-ghost btn-sm text-danger-500 hover:bg-danger-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          {/* Add event */}
          <div className="card p-5">
            <h3 className="font-semibold text-sm text-ink mb-4">Add Timeline Event</h3>
            <div className="flex gap-3">
              <select
                className="input w-40 flex-shrink-0"
                value={newTimelineEvent}
                onChange={(e) => setNewTimelineEvent(e.target.value as TimelineEventType)}
              >
                <option value="status_changed">Status Change</option>
                <option value="evidence_added">Evidence Added</option>
                <option value="submitted">Submitted</option>
                <option value="bank_response">Bank Response</option>
                <option value="note_added">Note</option>
              </select>
              <input
                type="text"
                className="input flex-1"
                placeholder="Describe what happened..."
                value={newTimelineDesc}
                onChange={(e) => setNewTimelineDesc(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTimelineEvent()}
              />
              <button
                onClick={addTimelineEvent}
                disabled={addingEvent || !newTimelineDesc.trim()}
                className="btn-primary flex-shrink-0"
              >
                {addingEvent ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="card p-6">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-5 top-2 bottom-2 w-px bg-surface-border" />

              <div className="space-y-6">
                {timeline.map((event) => {
                  const Icon = TIMELINE_ICONS[event.event_type] || Clock
                  const colorClass = TIMELINE_COLORS[event.event_type] || 'bg-surface-tertiary text-ink-secondary'

                  return (
                    <div key={event.id} className="flex gap-4 items-start relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 pt-1.5">
                        <div className="font-medium text-sm text-ink">{event.description}</div>
                        <div className="text-xs text-ink-tertiary mt-0.5">
                          {formatDateTime(event.created_at)}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
