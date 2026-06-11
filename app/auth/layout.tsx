import { ShieldCheck } from 'lucide-react'
import Link from 'next/link'

// Shopify brand colours — matches the app-wide brand palette
const SHOPIFY_GREEN      = '#008060'
const SHOPIFY_GREEN_DARK = '#004C3F'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-secondary flex">
      {/* Left panel - branding */}
      <div
        className="hidden lg:flex lg:w-[480px] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${SHOPIFY_GREEN} 0%, ${SHOPIFY_GREEN_DARK} 100%)` }}
      >
        {/* Subtle radial glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
              transform: 'translate(30%, -30%)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
              transform: 'translate(-30%, 30%)',
            }}
          />
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.18)' }}>
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">Chargeback Shield</span>
        </Link>

        {/* Testimonial */}
        <div className="relative z-10">
          <div className="text-5xl font-serif text-white/30 leading-none mb-2">"</div>
          <blockquote className="text-white/90 text-xl font-medium leading-relaxed mb-6">
            We recovered $14,200 in our first quarter. The dispute tracker means we never miss a deadline.
          </blockquote>
          <div>
            <div className="text-white font-medium text-sm">Marcus T.</div>
            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>Head of Operations, TechGear Store</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 relative z-10">
          {[
            { val: '73%',  label: 'Win rate improvement' },
            { val: '$2.4M', label: 'Revenue protected' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.12)' }}>
              <div className="text-2xl font-bold text-white">{s.val}</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form (no logo) */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
