import { ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-secondary flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-[480px] bg-brand-600 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
              transform: 'translate(30%, -30%)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
              transform: 'translate(-30%, 30%)',
            }}
          />
        </div>

        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-semibold text-lg">Chargeback Shield</span>
        </Link>

        <div className="relative z-10">
          <blockquote className="text-white/90 text-xl font-medium leading-relaxed mb-6">
            "We recovered $14,200 in our first quarter. The dispute tracker means we never miss a deadline."
          </blockquote>
          <div>
            <div className="text-white font-medium text-sm">Marcus T.</div>
            <div className="text-brand-300 text-sm">Head of Operations, TechGear Store</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 relative z-10">
          {[
            { val: '73%', label: 'Win rate improvement' },
            { val: '$2.4M', label: 'Revenue protected' },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{s.val}</div>
              <div className="text-brand-200 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-ink text-lg">Chargeback Shield</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
