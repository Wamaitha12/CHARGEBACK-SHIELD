'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        window.location.href = '/dashboard'
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Check your Supabase environment variables.'
      setError(message)
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink mb-2">Welcome back</h1>
        <p className="text-ink-secondary text-sm">Sign in to your Chargeback Shield account</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        {error && (
          <div className="bg-danger-50 border border-danger-100 text-danger-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="label">Email address</label>
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
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="label mb-0">Password</label>
            <a href="#" className="text-xs text-brand-600 hover:text-brand-700 font-medium">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pr-10"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-tertiary hover:text-ink-secondary"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-2.5"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      <p className="text-sm text-ink-secondary text-center mt-6">
        Don't have an account?{' '}
        <Link href="/auth/signup" className="text-brand-600 font-medium hover:text-brand-700">
          Create one free
        </Link>
      </p>

      {/* Demo access */}
      <div className="mt-8 pt-6 border-t border-surface-border">
        <p className="text-xs text-ink-tertiary text-center mb-3">Want to explore first?</p>
        <button
          onClick={() => {
            setEmail('demo@chargebackshield.com')
            setPassword('demo1234')
          }}
          className="btn-secondary w-full justify-center text-xs"
        >
          Use demo credentials
        </button>
      </div>
    </div>
  )
}
