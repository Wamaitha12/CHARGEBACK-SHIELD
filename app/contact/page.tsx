'use client'

import Link from 'next/link'
import { ShieldCheck, Mail, MessageSquare, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const FAQS = [
  {
    question: 'How quickly do you respond to support requests?',
    answer: 'Starter plan users receive responses within 2 business days. Pro plan users receive priority support within 24 hours. Enterprise customers have a dedicated account manager.',
  },
  {
    question: 'Can I upgrade or downgrade my plan at any time?',
    answer: 'Yes. You can change your plan at any time from your account settings. Upgrades take effect immediately; downgrades take effect at the end of your current billing cycle.',
  },
  {
    question: 'Do you offer a free trial for the Pro plan?',
    answer: 'Yes — we offer a 14-day free trial on the Pro plan, no credit card required. You\'ll have full access to all Pro features during the trial.',
  },
  {
    question: 'Is my dispute data secure?',
    answer: 'Absolutely. All data is encrypted in transit and at rest using industry-standard encryption. We follow enterprise security best practices and conduct regular audits.',
  },
  {
    question: 'Can I export my data if I decide to leave?',
    answer: 'Yes. You can export all your chargeback data and uploaded evidence files at any time from your account settings. We believe your data is yours.',
  },
]

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production this would POST to an API route
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-slate-900 text-lg tracking-tight">Chargeback Shield</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-ghost text-sm font-medium px-4 py-2 rounded-lg">
              Sign in
            </Link>
            <Link href="/auth/signup" className="btn-primary text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-6 bg-gradient-to-br from-brand-50/60 via-white to-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-3">Get in touch</p>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">We're here to help</h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Have a question, issue, or want to learn more about Enterprise? Reach out and we'll get back to you shortly.
          </p>
        </div>
      </section>

      {/* Contact options */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-brand-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Email us</h3>
              <p className="text-sm text-slate-600 mb-3">For general enquiries and billing</p>
              <a href="mailto:hello@chargebackshield.com" className="text-sm text-brand-600 hover:underline font-medium">
                hello@chargebackshield.com
              </a>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-brand-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Support</h3>
              <p className="text-sm text-slate-600 mb-3">Technical help and account issues</p>
              <a href="mailto:support@chargebackshield.com" className="text-sm text-brand-600 hover:underline font-medium">
                support@chargebackshield.com
              </a>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-brand-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Response time</h3>
              <p className="text-sm text-slate-600 mb-3">When you can expect to hear back</p>
              <p className="text-sm text-slate-900 font-medium">Within 1–2 business days</p>
            </div>
          </div>

          {/* Form + FAQ */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact form */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>

              {submitted ? (
                <div className="card p-8 text-center">
                  <div className="w-14 h-14 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Message sent!</h3>
                  <p className="text-slate-600 text-sm">
                    Thanks for reaching out. We'll get back to you within 1–2 business days.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setFormState({ name: '', email: '', subject: '', message: '' }) }}
                    className="btn-secondary mt-6 text-sm"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label" htmlFor="name">Name</label>
                      <input
                        id="name"
                        type="text"
                        className="input"
                        placeholder="Your name"
                        value={formState.name}
                        onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="email">Email</label>
                      <input
                        id="email"
                        type="email"
                        className="input"
                        placeholder="you@example.com"
                        value={formState.email}
                        onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="subject">Subject</label>
                    <select
                      id="subject"
                      className="input"
                      value={formState.subject}
                      onChange={e => setFormState(s => ({ ...s, subject: e.target.value }))}
                      required
                    >
                      <option value="">Select a topic…</option>
                      <option value="general">General question</option>
                      <option value="billing">Billing & subscription</option>
                      <option value="technical">Technical support</option>
                      <option value="enterprise">Enterprise enquiry</option>
                      <option value="feedback">Product feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="label" htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      className="input resize-none"
                      rows={5}
                      placeholder="Tell us what's on your mind…"
                      value={formState.message}
                      onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full justify-center">
                    Send message
                  </button>
                </form>
              )}
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Common questions</h2>
              <div className="space-y-3">
                {FAQS.map((faq, i) => (
                  <div key={i} className="card overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-sm font-medium text-slate-900 pr-4">{faq.question}</span>
                      {openFaq === i
                        ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      }
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 text-sm text-slate-600 border-t border-slate-200 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-slate-900" />
              </div>
              <span className="text-white font-semibold">Chargeback Shield</span>
            </div>
            <div className="flex gap-8 text-sm text-slate-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-white transition-colors text-white">Contact</Link>
            </div>
            <p className="text-slate-500 text-sm">© 2025 Chargeback Shield. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
