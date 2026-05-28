import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — Chargeback Shield',
  description: 'Read the Terms of Service for using Chargeback Shield.',
}

export default function TermsPage() {
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
            <h1 className="text-4xl font-bold text-ink mb-4">Terms of Service</h1>
            <p className="text-ink-secondary">Last updated: January 1, 2025</p>
          </div>

          <div className="space-y-10 text-ink-secondary leading-relaxed">

            <section>
              <h2 className="text-xl font-semibold text-ink mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Chargeback Shield ("Service"), you agree to be bound by these Terms of Service
                ("Terms"). If you do not agree to these Terms, do not use the Service. These Terms apply to all
                visitors, users, and others who access or use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink mb-3">2. Description of Service</h2>
              <p>
                Chargeback Shield is a chargeback and dispute management platform that helps businesses track disputes,
                organize evidence, and monitor win rates. We provide tools for evidence management, dispute timeline
                tracking, analytics, and revenue recovery reporting. The Service is provided on a subscription basis
                with tiered plans as described on our pricing page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink mb-3">3. Account Registration</h2>
              <p className="mb-4">
                To use the Service, you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-sm">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your account information as necessary</li>
                <li>Keep your password secure and confidential</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Be responsible for all activities that occur under your account</li>
              </ul>
              <p className="mt-4 text-sm">
                You must be at least 18 years old and have the authority to enter into these Terms on behalf of
                yourself or your organization.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink mb-3">4. Acceptable Use</h2>
              <p className="mb-4">You agree not to use the Service to:</p>
              <ul className="list-disc list-inside space-y-1.5 text-sm">
                <li>Violate any applicable law or regulation</li>
                <li>Upload false, misleading, or fraudulent dispute information or evidence</li>
                <li>Infringe the intellectual property rights of any party</li>
                <li>Transmit malware, viruses, or other harmful code</li>
                <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                <li>Engage in any activity that disrupts or interferes with the Service</li>
                <li>Reverse engineer, decompile, or attempt to extract source code from the Service</li>
                <li>Use the Service in any way that could damage our reputation or business</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink mb-3">5. Subscription and Payment</h2>
              <p className="mb-4">
                Certain features of the Service require a paid subscription. By subscribing, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-sm">
                <li>Pay all fees associated with your selected plan</li>
                <li>Provide valid payment information and keep it up to date</li>
                <li>Authorize us to charge your payment method on a recurring basis</li>
              </ul>
              <p className="mt-4 text-sm">
                All fees are non-refundable except as required by law or as explicitly stated in our refund policy.
                We reserve the right to change pricing with 30 days' notice. Continued use after a price change
                constitutes acceptance of the new pricing.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink mb-3">6. Free Trial</h2>
              <p>
                We may offer a free trial of paid features. At the end of the trial period, your account will
                automatically convert to the applicable paid plan unless you cancel before the trial ends. We reserve
                the right to modify or cancel free trial offers at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink mb-3">7. Intellectual Property</h2>
              <p className="mb-4">
                The Service and its original content, features, and functionality are owned by Chargeback Shield and
                are protected by intellectual property laws. You may not copy, modify, distribute, or create derivative
                works based on the Service without our express written permission.
              </p>
              <p>
                You retain ownership of all data and content you upload to the Service. By uploading content, you grant
                us a limited license to store, process, and display it solely to provide the Service to you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink mb-3">8. Disclaimers</h2>
              <p className="mb-4">
                Chargeback Shield is provided "as is" and "as available" without warranties of any kind, either express
                or implied. We do not warrant that:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-sm">
                <li>The Service will be uninterrupted, error-free, or completely secure</li>
                <li>Results obtained from using the Service will be accurate or reliable</li>
                <li>Using the Service will guarantee winning any particular chargeback dispute</li>
              </ul>
              <p className="mt-4 text-sm">
                Chargeback Shield is a management tool, not a legal service. We do not provide legal advice, and nothing
                in the Service constitutes legal counsel.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink mb-3">9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Chargeback Shield shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages, including lost profits, lost revenue, or loss
                of data arising from your use of the Service. Our total liability to you for any claim shall not exceed
                the amount you paid us in the 12 months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink mb-3">10. Termination</h2>
              <p>
                You may cancel your account at any time from your account settings. We reserve the right to suspend or
                terminate your access to the Service at our discretion, with or without notice, for conduct that we
                believe violates these Terms or is harmful to other users, us, or third parties. Upon termination, your
                right to use the Service will cease immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink mb-3">11. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with applicable laws, without regard to
                conflict of law provisions. Any disputes arising under these Terms shall be resolved through binding
                arbitration, except that either party may seek injunctive relief in a court of competent jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink mb-3">12. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify you of material changes via
                email or in-app notification at least 14 days before the changes take effect. Your continued use of the
                Service after changes take effect constitutes acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink mb-3">13. Contact</h2>
              <p>
                Questions about these Terms? Please contact us:
              </p>
              <div className="mt-4 p-4 bg-surface-secondary rounded-xl border border-surface-border text-sm space-y-1">
                <p><strong className="text-ink">Chargeback Shield</strong></p>
                <p>Email: <a href="mailto:legal@chargebackshield.com" className="text-brand-600 hover:underline">legal@chargebackshield.com</a></p>
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
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors text-white">Terms</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <p className="text-slate-500 text-sm">© 2025 Chargeback Shield. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
