import { Link } from 'react-router-dom'

export function NotFound() {
  return <div className="flex min-h-screen items-center justify-center p-6 text-center"><div><p className="text-sm font-bold text-brand">404</p><h1 className="mt-2 text-3xl font-bold text-ink">Page not found</h1><p className="mt-2 text-slate-500">The page you’re looking for doesn’t exist.</p><Link to="/dashboard" className="mt-6 inline-block rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white">Go to dashboard</Link></div></div>
}
