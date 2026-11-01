import { BarChart3, Check, CheckCircle2, Search, Settings, ShieldAlert, Trash2, UserCheck, UserX, Users, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { coursePricing, courses as learnerCourses } from '../data/mockData'

type AdminUser = { id: string; name: string; email: string; role: 'Student' | 'Instructor' | 'Admin'; status: 'Active' | 'Suspended' }
type PendingCourse = { id: string; title: string; instructor: string; description: string; status: 'Pending' | 'Approved' | 'Rejected' }

const initialUsers: AdminUser[] = [
  { id: 'user-1', name: 'Jamie Davis', email: 'jamie@example.com', role: 'Student', status: 'Active' },
  { id: 'user-2', name: 'Maya Chen', email: 'maya@example.com', role: 'Instructor', status: 'Active' },
  { id: 'user-3', name: 'Ravi Patel', email: 'ravi@example.com', role: 'Student', status: 'Suspended' },
  { id: 'user-4', name: 'Noor Hassan', email: 'noor@example.com', role: 'Instructor', status: 'Active' },
]

const initialCourses: PendingCourse[] = [
  { id: 'pending-1', title: 'Design Systems at Scale', instructor: 'Maya Chen', description: 'Build consistent, accessible systems that help product teams ship with confidence.', status: 'Pending' },
  { id: 'pending-2', title: 'Python for Data Decisions', instructor: 'Jordan Lee', description: 'Use practical Python workflows to explore data and communicate useful insights.', status: 'Pending' },
]

export function AdminWorkspace() {
  const path = useLocation().pathname
  const [users, setUsers] = useState(initialUsers)
  const [courses, setCourses] = useState(initialCourses)
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('All roles')
  const [platformName, setPlatformName] = useState('VertexLearn AI')
  const [allowSubmissions, setAllowSubmissions] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  const filteredUsers = useMemo(() => users.filter(user => `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase()) && (role === 'All roles' || user.role === role)), [users, query, role])
  const updateRole = (id: string, value: AdminUser['role']) => setUsers(current => current.map(user => user.id === id ? { ...user, role: value } : user))
  const toggleStatus = (id: string) => setUsers(current => current.map(user => user.id === id ? { ...user, status: user.status === 'Active' ? 'Suspended' : 'Active' } : user))
  const deleteUser = (user: AdminUser) => { if (window.confirm(`Delete ${user.name} from this demo?`)) setUsers(current => current.filter(item => item.id !== user.id)) }
  const updateCourse = (id: string, status: PendingCourse['status']) => setCourses(current => current.map(course => course.id === id ? { ...course, status } : course))

  if (path === '/admin/users') return <UsersPage users={filteredUsers} query={query} setQuery={setQuery} role={role} setRole={setRole} updateRole={updateRole} toggleStatus={toggleStatus} deleteUser={deleteUser} />
  if (path === '/admin/courses') return <CoursesPage courses={courses} updateCourse={updateCourse} />
  if (path === '/admin/settings') return <SettingsPage platformName={platformName} setPlatformName={setPlatformName} allowSubmissions={allowSubmissions} setAllowSubmissions={setAllowSubmissions} maintenanceMode={maintenanceMode} setMaintenanceMode={setMaintenanceMode} />
  return <Dashboard users={users} courses={courses} />
}

function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="mb-7"><p className="text-sm font-medium text-brand">{eyebrow}</p><h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">{title}</h2><p className="mt-2 text-sm text-slate-500">{description}</p></div>
}

function Dashboard({ users, courses }: { users: AdminUser[]; courses: PendingCourse[] }) {
  const enrollments = learnerCourses.reduce((total, course) => total + course.completedLessons + 120, 0)
  const revenue = learnerCourses.reduce((total, course) => total + ((coursePricing[course.id] ?? 0) * (course.completedLessons + 120)), 0)
  const completion = Math.round(learnerCourses.reduce((total, course) => total + course.progress, 0) / learnerCourses.length)
  const metrics = [['Total users', users.length.toString(), Users], ['Total courses', learnerCourses.length.toString(), BarChart3], ['Pending approvals', courses.filter(course => course.status === 'Pending').length.toString(), ShieldAlert], ['Total enrollments', enrollments.toString(), UserCheck], ['Course completion', `${completion}%`, CheckCircle2], ['Mock revenue', `$${Math.round(revenue).toLocaleString()}`, BarChart3]] as const
  return <div className="mx-auto max-w-7xl p-5 sm:p-8"><PageHeader eyebrow="Platform overview" title="Admin dashboard" description="Monitor platform health, revenue, and review items that need attention." /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{metrics.map(([label, value, Icon]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><div className="flex items-center justify-between"><p className="text-sm text-slate-500">{label}</p><Icon size={18} className="text-brand" /></div><p className="mt-3 text-2xl font-bold text-ink">{value}</p></div>)}</div><div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]"><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><div className="flex items-center justify-between"><h3 className="font-bold text-ink">Pending course approvals</h3><span className="text-xs font-semibold text-brand">{courses.filter(course => course.status === 'Pending').length} awaiting review</span></div>{courses.filter(course => course.status === 'Pending').map(course => <div key={course.id} className="border-b border-slate-100 py-4 last:border-0"><p className="font-semibold text-ink">{course.title}</p><p className="mt-1 text-xs text-slate-500">By {course.instructor}</p><p className="mt-2 text-sm text-slate-500">{course.description}</p></div>)}{!courses.some(course => course.status === 'Pending') && <Empty text="No courses are waiting for approval." />}</section><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><h3 className="font-bold text-ink">Recent platform activity</h3>{['New instructor application received', '12 learners completed a lesson', 'Course review queue updated'].map((activity, index) => <div key={activity} className="flex gap-3 border-b border-slate-100 py-4 last:border-0"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-500" /><div><p className="text-sm text-slate-600">{activity}</p><p className="mt-1 text-xs text-slate-400">{index + 1}h ago</p></div></div>)}</section></div></div>
}

function UsersPage({ users, query, setQuery, role, setRole, updateRole, toggleStatus, deleteUser }: { users: AdminUser[]; query: string; setQuery: (value: string) => void; role: string; setRole: (value: string) => void; updateRole: (id: string, value: AdminUser['role']) => void; toggleStatus: (id: string) => void; deleteUser: (user: AdminUser) => void }) {
  return <div className="mx-auto max-w-7xl p-5 sm:p-8"><PageHeader eyebrow="Platform access" title="User management" description="Search users, update roles, and simulate account status changes." /><div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-soft sm:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-3 text-slate-400" size={18} /><input aria-label="Search users" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by name or email" className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-brand" /></label><select aria-label="Filter users by role" value={role} onChange={event => setRole(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600"><option>All roles</option><option>Student</option><option>Instructor</option><option>Admin</option></select></div><div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-soft"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wider text-slate-400"><tr><th className="p-4">User</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody>{users.map(user => <tr key={user.id} className="border-b border-slate-100 last:border-0"><td className="p-4"><p className="font-semibold text-ink">{user.name}</p><p className="mt-1 text-xs text-slate-400">{user.email}</p></td><td className="p-4"><select aria-label={`Role for ${user.name}`} value={user.role} onChange={event => updateRole(user.id, event.target.value as AdminUser['role'])} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600"><option>Student</option><option>Instructor</option><option>Admin</option></select></td><td className="p-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{user.status}</span></td><td className="p-4"><div className="flex gap-2"><button onClick={() => toggleStatus(user.id)} className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:border-brand hover:text-brand">{user.status === 'Active' ? <UserX size={14} /> : <UserCheck size={14} />}{user.status === 'Active' ? 'Suspend' : 'Activate'}</button><button aria-label={`Delete ${user.name}`} onClick={() => deleteUser(user)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500"><Trash2 size={16} /></button></div></td></tr>)}</tbody></table>{!users.length && <Empty text="No users match these filters." />}</div></div>
}

function CoursesPage({ courses, updateCourse }: { courses: PendingCourse[]; updateCourse: (id: string, status: PendingCourse['status']) => void }) {
  return <div className="mx-auto max-w-5xl p-5 sm:p-8"><PageHeader eyebrow="Governance" title="Course approvals" description="Review instructor submissions before they appear in the public catalog." /><div className="space-y-4">{courses.filter(course => course.status === 'Pending').map(course => <article key={course.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><div className="flex flex-col justify-between gap-4 sm:flex-row"><div><h3 className="font-bold text-ink">{course.title}</h3><p className="mt-1 text-xs font-medium text-brand">By {course.instructor}</p><p className="mt-3 text-sm leading-6 text-slate-500">{course.description}</p></div><span className="h-fit rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">Pending review</span></div><div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4"><button onClick={() => updateCourse(course.id, 'Approved')} className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"><Check size={16} />Approve</button><button onClick={() => updateCourse(course.id, 'Rejected')} className="flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"><X size={16} />Reject</button></div></article>)}{!courses.some(course => course.status === 'Pending') && <Empty text="All course submissions have been processed." />}</div><div className="mt-8"><h3 className="mb-3 font-bold text-ink">Processed submissions</h3><div className="space-y-2">{courses.filter(course => course.status !== 'Pending').map(course => <div key={course.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-sm"><span className="font-medium text-slate-600">{course.title}</span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${course.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{course.status}</span></div>)}</div></div></div>
}

function SettingsPage({ platformName, setPlatformName, allowSubmissions, setAllowSubmissions, maintenanceMode, setMaintenanceMode }: { platformName: string; setPlatformName: (value: string) => void; allowSubmissions: boolean; setAllowSubmissions: (value: boolean) => void; maintenanceMode: boolean; setMaintenanceMode: (value: boolean) => void }) {
  return <div className="mx-auto max-w-3xl p-5 sm:p-8"><PageHeader eyebrow="Configuration" title="Admin settings" description="These controls update the local frontend demo only." /><div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><label className="block text-sm font-semibold text-slate-700">Platform name<input value={platformName} onChange={event => setPlatformName(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none focus:border-brand" /></label><Toggle label="Allow new course submissions" checked={allowSubmissions} onChange={setAllowSubmissions} /><Toggle label="Maintenance mode" checked={maintenanceMode} onChange={setMaintenanceMode} /><div className="flex items-center gap-2 rounded-xl bg-indigo-50 p-3 text-sm text-brand"><Settings size={17} />{platformName} · {maintenanceMode ? 'Maintenance mode is on' : allowSubmissions ? 'Accepting course submissions' : 'Course submissions paused'}</div></div></div>
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-4 text-sm font-semibold text-slate-700"><span>{label}</span><input aria-label={label} type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} className="h-5 w-5 accent-brand" /></label>
}

function Empty({ text }: { text: string }) {
  return <div className="p-10 text-center text-sm text-slate-500">{text}</div>
}
