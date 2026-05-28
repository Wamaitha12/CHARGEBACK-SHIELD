export type ChargebackStatus = 'pending' | 'under_review' | 'won' | 'lost'

export type DisputeReason =
  | 'item_not_received'
  | 'item_not_as_described'
  | 'unauthorized_transaction'
  | 'duplicate_charge'
  | 'subscription_cancelled'
  | 'credit_not_processed'
  | 'general_dispute'
  | 'other'

export type TimelineEventType =
  | 'created'
  | 'evidence_added'
  | 'submitted'
  | 'bank_response'
  | 'won'
  | 'lost'
  | 'status_changed'
  | 'note_added'

export interface Chargeback {
  id: string
  user_id: string
  customer_name: string
  customer_email: string
  amount: number
  currency: string
  transaction_date: string
  reason: DisputeReason
  reason_custom?: string
  status: ChargebackStatus
  notes?: string
  created_at: string
  updated_at: string
}

export interface TimelineEvent {
  id: string
  chargeback_id: string
  event_type: TimelineEventType
  description: string
  created_at: string
  user_id: string
}

export interface EvidenceFile {
  id: string
  chargeback_id: string
  user_id: string
  file_name: string
  file_type: string
  file_size: number
  storage_path: string
  created_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  business_name?: string
  currency: string
  email_notifications: boolean
  dispute_reminders: boolean
  monthly_reports: boolean
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  total_chargebacks: number
  total_lost: number
  total_recovered: number
  active_disputes: number
  win_rate: number
}
