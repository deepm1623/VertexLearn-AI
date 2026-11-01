import { useState } from 'react'
import { ArrowRight, CheckCircle2, LockKeyhole, Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { useLearning } from '../context/LearningContext'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { t } = useLearning()
  const submit = (event: React.FormEvent) => { event.preventDefault(); setSubmitted(true); if (email && password) navigate('/dashboard') }
  return <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10"><div className="w-full max-w-md">
    <div className="mb-8 flex justify-center"><Brand /></div>
    <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft sm:p-9">
      <div className="mb-8"><h1 className="text-2xl font-bold text-ink">{t('welcomeBack')}</h1><p className="mt-2 text-sm leading-6 text-slate-500">{t('learningJourney')}</p></div>
      <form onSubmit={submit} className="space-y-5">
        <label className="block text-sm font-medium text-slate-700">{t('email')}<div className="relative mt-2"><Mail className="absolute left-3 top-3 text-slate-400" size={18} /><input aria-invalid={submitted && !email} required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-indigo-50" /></div></label>
        <label className="block text-sm font-medium text-slate-700">{t('password')}<div className="relative mt-2"><LockKeyhole className="absolute left-3 top-3 text-slate-400" size={18} /><input aria-invalid={submitted && !password} required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t('enterPassword')} className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-indigo-50" /></div></label>
        {submitted && (!email || !password) && <p role="alert" className="text-sm text-rose-600">{t('requiredLogin')}</p>}
        <button type="submit" className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-white transition hover:bg-indigo-700">{t('enterDashboard')} <ArrowRight size={16} /></button>
      </form>
      <div className="mt-6 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={15} />{t('frontendDemo')}</div>
    </div>
    <p className="mt-6 text-center text-xs text-slate-400"><Link to="/dashboard" className="hover:text-brand">{t('skipDemo')}</Link></p>
  </div></div>
}
