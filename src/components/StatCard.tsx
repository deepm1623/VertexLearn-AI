import type { LucideIcon } from 'lucide-react'

type StatCardProps = { label: string; value: string; detail: string; icon: LucideIcon; tone: string }

export function StatCard({ label, value, detail, icon: Icon, tone }: StatCardProps) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
    <div className="mb-5 flex items-start justify-between"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}><Icon size={19} /></div><span className="text-xs font-medium text-emerald-600">+12%</span></div>
    <p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold tracking-tight text-ink">{value}</p><p className="mt-1 text-xs text-slate-400">{detail}</p>
  </div>
}
