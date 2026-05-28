import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ChargebackStatus, DisputeReason } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const STATUS_CONFIG: Record<
  ChargebackStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  pending: {
    label: 'Pending',
    color: 'text-warning-600',
    bg: 'bg-warning-50',
    dot: 'bg-warning-500',
  },
  under_review: {
    label: 'Under Review',
    color: 'text-brand-600',
    bg: 'bg-brand-50',
    dot: 'bg-brand-500',
  },
  won: {
    label: 'Won',
    color: 'text-success-700',
    bg: 'bg-success-50',
    dot: 'bg-success-500',
  },
  lost: {
    label: 'Lost',
    color: 'text-danger-600',
    bg: 'bg-danger-50',
    dot: 'bg-danger-500',
  },
}

export const REASON_LABELS: Record<DisputeReason, string> = {
  item_not_received: 'Item Not Received',
  item_not_as_described: 'Item Not as Described',
  unauthorized_transaction: 'Unauthorized Transaction',
  duplicate_charge: 'Duplicate Charge',
  subscription_cancelled: 'Subscription Cancelled',
  credit_not_processed: 'Credit Not Processed',
  general_dispute: 'General Dispute',
  other: 'Other',
}

export const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'KES', symbol: 'KSh', label: 'Kenyan Shilling' },
]
