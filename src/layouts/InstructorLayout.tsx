import { BarChart3, BellRing, BookOpen, ClipboardList, FilePlus2, LayoutDashboard, Layers3, Menu, Moon, Puzzle, Sun, X } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Brand } from '../components/Brand'
import { useLearning } from '../context/LearningContext'

const links = [
  ['dashboard', '/instructor/dashboard', LayoutDashboard],
  ['myCourses', '/instructor/courses', BookOpen],
  ['courseContent', '/instructor/content', Layers3],
  ['createCourse', '/instructor/courses/new', FilePlus2],
  ['assignments', '/instructor/assignments', ClipboardList],
  ['announcements', '/instructor/announcements', BellRing],
  ['quizzes', '/instructor/quizzes', Puzzle],
  ['analytics', '/instructor/analytics', BarChart3],
] as const

export function InstructorLayout() {
  const [open, setOpen] = useState(false)
  const { darkMode, toggleDarkMode, t, language, setLanguage } = useLearning()
  return <div className="min-h-screen bg-slate-50 lg:flex">{open && <button aria-label="Close instructor navigation overlay" onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-ink/30 lg:hidden" />}<aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white px-5 py-6 transition-transform lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}><div className="mb-10 flex items-center justify-between px-2"><Brand /><button aria-label="Close menu" onClick={() => setOpen(false)} className="text-slate-400 lg:hidden"><X size={20} /></button></div><p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Instructor workspace</p><nav className="space-y-1.5">{links.map(([key, to, Icon]) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-indigo-50 text-brand' : 'text-slate-500 hover:bg-slate-50'}`}><Icon size={18} />{t(key)}</NavLink>)}</nav><div className="mt-auto rounded-2xl bg-slate-900 p-4 text-white"><p className="text-sm font-semibold">Demo instructor</p><p className="mt-1 text-xs leading-5 text-slate-300">Everything here is stored in React state only.</p></div></aside><div className="min-w-0 flex-1"><header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8"><div className="flex items-center gap-3"><button aria-label="Open instructor menu" onClick={() => setOpen(true)} className="text-slate-500 lg:hidden"><Menu size={22} /></button><h1 className="text-xl font-bold text-ink">Instructor workspace</h1></div>  <div className="flex items-center gap-2"><button aria-label={darkMode ? t('switchLight') : t('switchDark')} onClick={toggleDarkMode} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button><label className="hidden items-center gap-1 rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-500 sm:flex"><select aria-label={t('language')} value={language} onChange={event => setLanguage(event.target.value as 'en' | 'gu')} className="bg-transparent outline-none"><option value="en">EN</option><option value="gu">ગુ</option></select></label><NavLink to="/dashboard" className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-brand hover:text-brand">Student view</NavLink><div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">MC</div></div></header><main><Outlet /></main></div></div>
}
