import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Chargeback Shield',
  description: 'Learn how Chargeback Shield collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-ink text-lg tracking-tight">Chargeback Shield</span>
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

      {/* Content */}
      <main className="pt-28 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-3">Legal</p>
            <h1 className="text-4xl font-bold text-ink mb-4">Privacy Policy</h1>
            <p className="text-ink-secondary">Last updated: January 1, 2025</p>
          </div>

          <div className="prose-content space-y-10 text-ink-secondary leading-relaxed">

            <section>
              <h2 className="text-xl font-semibold text-ink mb-3">1. Introduction</h2>
              <p>
                Chargeback Shield ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you use our platform and
                services. Please read this policy carefully. By using Chargeback Shield, you agree to the practices
                described here.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink mb-3">2. Information We Collect</h2>
              <p className="mb-4">We collect information you provide directly, as well as data generated through your use of our service.</p>
              <h3 className="text-base font-semibold text-ink mb-2">Information you provide</h3>
              <ul className="list-disc list-inside space-y-1.5 mb-4 text-sm">
                <li>Account registration details (name, email address, password)</li>
                <li>Business information (company name, website)</li>
                <li>Chargeback and dispute data you enter into the platform</li>
                <li>Evidence files and documents you upload</li>
                <li>Payment and billing information (processed securely via our payment provider)</li>
                <li>Communications with our support team</li>
              </ul>
              <h3 className="text-base font-semibold text-ink mb-2">Information collected automatically</h3>
              <ul className="list-disc list-inside space-y-1.5 text-sm">
                <li>Log data (IP address, browser type, pages visited, timestamps)</li>
                <li>Device information (operating system, screen resolution)</li>
                <li>Usage data (features used, actions taken within the app)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink mb-3">3. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-1.5 text-sm">
                <li>Provide, operate, and improve the Chargeback Shield platform</li>
                <li>Process transactions and send related information (receipts, invoices)</li>
                <li>Send service-related communications (security alerts, updates)</li>
                <li>Respond to comments, questions, and customer support requests</li>
                <li>Monitor and analyze usage patterns to enhance user experience</li>
                <li>Detect, prevent, and address technical issues or fraudulent activity</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink mb-3">4. Sharing Your Information</h2>
              <p className="mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share information in
                the following limited circumstances:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-sm">
                <li><strong className="text-ink">Service providers:</strong> Trusted third parties that help us operate our platform (e.g., cloud hosting, payment processing, email delivery)</li>
                <li><strong className="text-ink">Legal requirements:</strong> When required by law, court order, or governmental authority</li>
                <li><strong className="text-ink">Business transfers:</strong> In connection with a merger, acquisition, or sale of assets, with appropriate notice</li>
                <li><strong className="text-ink">Your consent:</strong> With your explicit permission for any other purpose</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink mb-3">5. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your data, including encryption in transit
                (TLS/HTTPS) and at rest, access controls, and regular security audits. Your uploaded evidence files and
                dispute data are stored with enterprise-grade security. While we take these precautions seriously, no
                method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink mb-3">6. Data Retention</h2>
              <p>
                We retain your personal information for as long as your account is active or as needed to provide you
                services. If you delete your account, we will delete or anonymize your personal data within 30 days,
                except where we are required to retain it for legal or legitimate business purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink mb-3">7. Your Rights</h2>
              <p className="mb-4">Depending on your location, you may have the right to:</p>
              <ul className="list-disc list-inside space-y-1.5 text-sm">
                <li>Access the personal information we hold about you</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Request deletion of your personal information</li>
                <li>Object to or restrict certain processing of your data</li>
                <li>Request a portable copy of your data</li>
                <li>Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="mt-4 text-sm">
                To exercise any of these rights, please contact us at{' '}
                <a href="mailto:privacy@chargebackshield.com" className="text-brand-600 hover:underline">
                  privacy@chargebackshield.com
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink mb-3">8. Cookies</h2>
              <p>
                We use cookies and similar technologies to maintain your session, remember your preferences, and
                understand how you use our platform. You can control cookies through your browser settings, though
                disabling certain cookies may affect functionality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink mb-3">9. Children's Privacy</h2>
              <p>
                Chargeback Shield is not directed to individuals under 16. We do not knowingly collect personal
                information from children. If you become aware that a child has provided us with personal information,
                please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink mb-3">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of significant changes via
                email or a prominent notice in the app. Your continued use of the service after changes take effect
                constitutes acceptance of the revised policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink mb-3">11. Contact Us</h2>
              <p>
                If you have questions or concerns about this Privacy Policy, please reach out:
              </p>
              <div className="mt-4 p-4 bg-surface-secondary rounded-xl border border-surface-border text-sm space-y-1">
                <p><strong className="text-ink">Chargeback Shield</strong></p>
                <p>Email: <a href="mailto:privacy@chargebackshield.com" className="text-brand-600 hover:underline">privacy@chargebackshield.com</a></p>
                <p>Or visit our <Link href="/contact" className="text-brand-600 hover:underline">Contact page</Link></p>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-ink py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-ink" />
              </div>
              <span className="text-white font-semibold">Chargeback Shield</span>
            </div>
            <div className="flex gap-8 text-sm text-slate-400">
              <Link href="/privacy" className="hover:text-white transition-colors text-white">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <p className="text-slate-500 text-sm">© 2025 Chargeback Shield. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
