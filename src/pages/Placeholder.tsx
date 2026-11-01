import { ArrowLeft, Construction } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export function Placeholder() {
  const title = useLocation().pathname.slice(1).replace('-', ' ')
  return <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-6"><div className="max-w-md text-center"><div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-brand"><Construction size={26} /></div><h2 className="text-2xl font-bold capitalize text-ink">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-500">This learning space is coming soon. For now, head back to your dashboard to continue learning.</p><Link to="/dashboard" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand"><ArrowLeft size={16} />Back to dashboard</Link></div></div>
}
