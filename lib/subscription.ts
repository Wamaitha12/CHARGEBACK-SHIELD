export const TRIAL_DAYS = 3

export interface ProfileSubscription {
  subscription_status: string | null
  trial_started_at: string | null
  current_period_end: string | null
}

/**
 * Returns true if the user has an active trial or paid subscription.
 */
export function isSubscriptionActive(profile: ProfileSubscription): boolean {
  if (!profile) return false

  if (profile.subscription_status === 'active') return true

  if (
    profile.subscription_status === 'trialing' ||
    profile.subscription_status == null
  ) {
    if (!profile.trial_started_at) {
      // No trial_started_at means they just signed up — treat as in trial
      return true
    }
    const trialEnd = getTrialEndDate(profile.trial_started_at)
    return new Date() < trialEnd
  }

  return false
}

export function getTrialEndDate(trialStartedAt: string): Date {
  const d = new Date(trialStartedAt)
  d.setDate(d.getDate() + TRIAL_DAYS)
  return d
}

/**
 * Returns how many full days remain in the trial (0 if expired).
 */
export function getTrialDaysLeft(trialStartedAt: string | null): number {
  if (!trialStartedAt) return TRIAL_DAYS
  const msLeft = getTrialEndDate(trialStartedAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)))
}

/**
 * Returns a human-readable status label.
 */
export function getStatusLabel(profile: ProfileSubscription): string {
  if (profile.subscription_status === 'active') return 'Active'
  if (profile.subscription_status === 'past_due') return 'Past due'
  if (profile.subscription_status === 'canceled') return 'Canceled'
  const daysLeft = getTrialDaysLeft(profile.trial_started_at)
  if (daysLeft > 0) return `Trial — ${daysLeft} day${daysLeft === 1 ? '' : 's'} left`
  return 'Trial expired'
}
