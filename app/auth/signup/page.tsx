'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { business_name: businessName },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Create user profile
      await supabase.from('user_profiles').upsert({
        user_id: data.user.id,
        business_name: businessName,
        currency: 'USD',
        email_notifications: true,
        dispute_reminders: true,
        monthly_reports: false,
      })

      if (data.session) {
        window.location.href = '/dashboard'
      } else {
        setSuccess(true)
        setLoading(false)
      }
    }
  }

  if (success) {
    return (
      <div className="animate-fade-in text-center">
        <div className="w-14 h-14 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-success-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Check your email</h2>
        <p className="text-slate-600 text-sm mb-6">
          We sent a verification link to <strong>{email}</strong>. Click the link to activate your account.
        </p>
        <Link href="/auth/login" className="btn-primary w-full justify-center">
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Create your account</h1>
        <p className="text-slate-600 text-sm">Start protecting your revenue — free for 14 days</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-5">
        {error && (
          <div className="bg-danger-50 border border-danger-100 text-danger-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="business" className="label">Business name</label>
          <input
            id="business"
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="input"
            placeholder="My Online Store"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="label">Work email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="you@company.com"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="label">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pr-10"
              placeholder="Min. 8 characters"
              required
              minLength={8}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {password.length > 0 && (
            <div className="mt-2 flex gap-1">
              {[
                password.length >= 8,
                /[A-Z]/.test(password),
                /[0-9]/.test(password),
              ].map((met, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    met ? 'bg-success-500' : 'bg-white-border'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-2.5"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create free account'
          )}
        </button>

        <p className="text-xs text-slate-500 text-center">
          By signing up you agree to our{' '}
          <Link href="/terms" className="text-brand-600 hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>
        </p>
      </form>

      <p className="text-sm text-slate-600 text-center mt-6">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-brand-600 font-medium hover:text-brand-700">
          Sign in
        </Link>
      </p>
    </div>
  )
}
