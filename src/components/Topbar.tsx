import { Bell, Globe2, Menu, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useLearning } from '../context/LearningContext'

const titles: Record<string, string> = { '/dashboard': 'Dashboard', '/courses': 'My Courses', '/ai-tutor': 'AI Tutor', '/assignments': 'Assignments', '/certificates': 'Certificates' }

type TopbarProps = { onMenu: () => void }

export function Topbar({ onMenu }: TopbarProps) {
  const pathname = useLocation().pathname
  const [open, setOpen] = useState(false)
  const { notifications, markNotificationRead, markAllNotificationsRead, darkMode, toggleDarkMode, language, setLanguage, t } = useLearning()
  const unreadCount = notifications.filter(notification => !notification.read).length
  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])
  const title = titles[pathname] ?? (pathname.startsWith('/courses/') ? t('courseDetails') : pathname.startsWith('/learn/') ? t('lessonPlayer') : pathname === '/quiz' ? t('quiz') : t('dashboard'))
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
      <div className="flex items-center gap-3">
        <button aria-label="Open menu" className="text-slate-500 lg:hidden" onClick={onMenu}><Menu size={22} /></button>
        <h1 className="text-xl font-bold text-ink">{title}</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button aria-label={darkMode ? t('switchLight') : t('switchDark')} onClick={toggleDarkMode} className="rounded-full p-2 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand">{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
        <label className="flex items-center gap-1 rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-500"><Globe2 size={14} /><select aria-label={t('language')} value={language} onChange={event => setLanguage(event.target.value as 'en' | 'gu')} className="bg-transparent outline-none"><option value="en">EN</option><option value="gu">ગુ</option></select></label>
        <div className="relative"><button aria-label={t('notifications')} aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen(current => !current)} className="relative rounded-full p-2 text-slate-500 hover:bg-slate-50"><Bell size={19} />{unreadCount > 0 && <span aria-label={`${unreadCount} unread`} className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">{unreadCount}</span>}</button>{open && <div role="dialog" aria-label={t('notifications')} className="absolute right-0 top-12 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl"><div className="flex items-center justify-between border-b border-slate-100 px-2 pb-3"><p className="font-semibold text-ink">{t('notifications')}</p>{unreadCount > 0 && <button onClick={markAllNotificationsRead} className="text-xs font-semibold text-brand">{t('markAllRead')}</button>}</div><div className="max-h-96 overflow-auto">{notifications.length ? notifications.map(notification => <button key={notification.id} onClick={() => markNotificationRead(notification.id)} className={`w-full rounded-xl p-3 text-left ${notification.read ? 'bg-white' : 'bg-indigo-50/60'} hover:bg-slate-50`}><div className="flex gap-2"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${notification.read ? 'bg-slate-200' : 'bg-brand'}`} /><div><p className="text-sm font-semibold text-ink">{notification.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{notification.message}</p><p className="mt-1 text-[11px] text-slate-400">{notification.createdAt}</p></div></div></button>) : <p className="p-6 text-center text-sm text-slate-500">{t('noNotifications')}</p>}</div></div>}</div>
        <div className="flex items-center gap-2.5 border-l border-slate-200 pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-brand">JD</div>
          <div className="hidden sm:block"><p className="text-sm font-semibold text-ink">Jamie Davis</p><p className="text-xs text-slate-400">Student</p></div>
        </div>
      </div>
    </header>
  )
}
