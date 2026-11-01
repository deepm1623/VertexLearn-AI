import { BookOpen, ClipboardCheck, Compass, LayoutDashboard, Award, Bot, X, BriefcaseBusiness, type LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Brand } from './Brand'
import { useLearning } from '../context/LearningContext'
import type { TranslationKey } from '../i18n'

const links: { key: TranslationKey; to: string; icon: LucideIcon }[] = [
  { key: 'dashboard', to: '/dashboard', icon: LayoutDashboard },
  { key: 'myCourses', to: '/courses', icon: BookOpen },
  { key: 'exploreCourses', to: '/courses', icon: Compass },
  { key: 'aiTutor', to: '/ai-tutor', icon: Bot },
  { key: 'assignments', to: '/assignments', icon: ClipboardCheck },
  { key: 'certificates', to: '/certificates', icon: Award },
]

type SidebarProps = { open: boolean; onClose: () => void }

export function Sidebar({ open, onClose }: SidebarProps) {
  const { t } = useLearning()
  return (
    <>
      {open && <button aria-label="Close navigation overlay" className="fixed inset-0 z-30 bg-ink/30 lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white px-5 py-6 transition-transform lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-10 flex items-center justify-between px-2">
          <Brand />
          <button aria-label="Close menu" className="text-slate-400 lg:hidden" onClick={onClose}><X size={20} /></button>
        </div>
        <nav className="space-y-1.5">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">{t('workspace')}</p>
          {links.map(({ key, to, icon: Icon }) => (
            <NavLink key={key} to={to} onClick={onClose} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-brand' : 'text-slate-500 hover:bg-slate-50 hover:text-ink'}`}>
              <Icon size={18} />
              {t(key)}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-indigo-50 p-4">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-brand"><SparkleIcon /></div>
          <p className="text-sm font-semibold text-ink">{t('learnSmarter')}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Your AI-powered learning companion is always ready.</p>
          <NavLink to="/instructor/dashboard" onClick={onClose} className="mt-3 flex items-center gap-2 text-xs font-semibold text-brand"><BriefcaseBusiness size={14} />{t('instructorDemo')}</NavLink>
        </div>
      </aside>
    </>
  )
}

function SparkleIcon() {
  return <Bot size={17} />
}
