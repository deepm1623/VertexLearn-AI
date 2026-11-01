import { CheckCircle2, FileUp, Upload } from 'lucide-react'
import { useState } from 'react'
import { useLearning } from '../context/LearningContext'
import type { Assignment } from '../types'

const assignments: Assignment[] = [
  { id: 'assignment-flow', title: 'Create your first user flow', course: 'Product Design Fundamentals', instructions: 'Map the main path a new user takes to complete one meaningful task.', deadline: '2026-10-24T23:59:00' },
  { id: 'assignment-components', title: 'React components quiz reflection', course: 'Modern React Development', instructions: 'Explain how you would split a dashboard into reusable components.', deadline: '2026-10-28T23:59:00' },
  { id: 'assignment-overdue', title: 'Data visualisation exercise', course: 'Data Storytelling with Python', instructions: 'Describe the chart you would use to communicate one trend in a dataset.', deadline: '2026-10-20T23:59:00' },
]

const formatBytes = (bytes: number) => bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`

export function Assignments() {
  const { submissions, submitAssignment } = useLearning()
  const [files, setFiles] = useState<Record<string, { name: string; size: number; type: string }>>({})
  const [texts, setTexts] = useState<Record<string, string>>({})
  const [messages, setMessages] = useState<Record<string, string>>({})
  const now = new Date('2026-10-22T12:00:00')
  const submit = (assignment: Assignment) => {
    const overdue = new Date(assignment.deadline) < now
    const file = files[assignment.id]
    const text = texts[assignment.id]?.trim()
    if (overdue) { setMessages(current => ({ ...current, [assignment.id]: 'This deadline has passed, so submissions are closed.' })); return }
    if (!file && !text) { setMessages(current => ({ ...current, [assignment.id]: 'Add a file or write a text response before submitting.' })); return }
    submitAssignment(assignment, { file, text })
    setMessages(current => ({ ...current, [assignment.id]: 'Assignment submitted for this demo session.' }))
  }
  return <div className="mx-auto max-w-5xl p-5 sm:p-8"><div className="mb-7"><p className="text-sm font-medium text-brand">Keep practicing</p><h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">Assignments</h2><p className="mt-2 text-sm text-slate-500">Submit a file or text response. Nothing is uploaded or stored remotely.</p></div><div className="space-y-5">{assignments.map(assignment => { const overdue = new Date(assignment.deadline) < now; const submission = submissions[assignment.id]; return <article key={assignment.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-ink">{assignment.title}</h3>{submission?.status === 'Submitted' && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Submitted</span>}{overdue && !submission && <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600">Overdue</span>}{!overdue && !submission && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">Not submitted</span>}</div><p className="mt-1 text-xs font-medium text-brand">{assignment.course}</p><p className="mt-3 text-sm leading-6 text-slate-500">{assignment.instructions}</p></div><p className={`shrink-0 text-sm font-medium ${overdue ? 'text-rose-600' : 'text-slate-500'}`}>Due {new Date(assignment.deadline).toLocaleDateString()}</p></div>{submission?.status !== 'Submitted' && !overdue && <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 lg:grid-cols-2"><div><label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-5 text-sm font-semibold text-slate-600 hover:border-brand hover:text-brand"><FileUp size={18} />{files[assignment.id] ? 'Change file' : 'Select file'}<input type="file" accept=".pdf,.zip,.js,.ts,.tsx,.jsx,.py,.java,.cpp,.txt,.md" className="sr-only" onChange={event => { const file = event.target.files?.[0]; if (file) setFiles(current => ({ ...current, [assignment.id]: { name: file.name, size: file.size, type: file.type } })) }} /></label>{files[assignment.id] && <p className="mt-2 text-xs text-slate-500">{files[assignment.id].name} · {formatBytes(files[assignment.id].size)}</p>}</div><div><textarea value={texts[assignment.id] ?? ''} onChange={event => setTexts(current => ({ ...current, [assignment.id]: event.target.value }))} placeholder="Or write your response here..." className="min-h-24 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-indigo-50" /><button onClick={() => submit(assignment)} className="mt-2 flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"><Upload size={16} />Submit assignment</button></div></div>}{submission?.status === 'Submitted' && <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700"><CheckCircle2 size={17} />Your demo submission is complete.</div>}{messages[assignment.id] && submission?.status !== 'Submitted' && <p className="mt-4 text-sm text-rose-600">{messages[assignment.id]}</p>}</article>})}</div></div>
}
