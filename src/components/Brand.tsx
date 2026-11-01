import { Sparkles } from 'lucide-react'

type BrandProps = { compact?: boolean }

export function Brand({ compact = false }: BrandProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
        <Sparkles size={18} strokeWidth={2.5} />
      </div>
      {!compact && <span className="text-lg font-bold tracking-tight text-ink">VertexLearn<span className="text-brand"> AI</span></span>}
    </div>
  )
}
