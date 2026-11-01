import { BarChart3, Check, ChevronDown, ChevronUp, Eye, FileText, Link2, Pencil, Plus, Search, Trash2, Upload, Users, Video } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { courses as learnerCourses, instructorCourses } from '../data/mockData'
import { useLearning } from '../context/LearningContext'
import type { Announcement, CourseMaterial, InstructorCourse, RubricCriterion } from '../types'

export function InstructorWorkspace() {
  const path = useLocation().pathname
  const [courses, setCourses] = useState<InstructorCourse[]>(instructorCourses)
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState(false)
  const [modules, setModules] = useState([{ title: 'Getting started', lessons: ['Welcome lesson'] }])
  if (path.endsWith('/new')) return <CourseForm onSave={(course) => { setCourses(current => [...current, course]); setSaved(true) }} saved={saved} modules={modules} setModules={setModules} />
  if (path.endsWith('/assignments')) return <Assignments />
  if (path.endsWith('/announcements')) return <AnnouncementManager />
  if (path.endsWith('/quizzes')) return <QuizManager />
  if (path.endsWith('/content')) return <ContentManager courses={courses} />
  if (path.endsWith('/analytics')) return <Analytics />
  if (path.endsWith('/courses')) return <CourseManager courses={courses} setCourses={setCourses} query={query} setQuery={setQuery} />
  return <InstructorDashboard courses={courses} />
}

function InstructorDashboard({ courses }: { courses: InstructorCourse[] }) {
  const { t } = useLearning()
  return <div className="mx-auto max-w-7xl p-5 sm:p-8"><div className="mb-7"><p className="text-sm font-medium text-brand">Wednesday, October 22, 2026</p><h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">{t('welcomeBack')}, Maya</h2><p className="mt-2 text-sm text-slate-500">{t('keepMomentum')}</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[[t('totalCourses'), courses.length.toString(), '2 published'], [t('enrolledStudents'), '1,932', '+18% this month'], ['Completion rate', '68%', '+6% this quarter'], ['Average quiz score', '84%', '+4% this month']].map(([label, value, detail]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-ink">{value}</p><p className="mt-1 text-xs text-emerald-600">{detail}</p></div>)}</div><div className="mt-8 grid gap-6 lg:grid-cols-[1fr_350px]"><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><div className="flex items-center justify-between"><h3 className="font-bold text-ink">{t('recentActivity')}</h3><Link to="/instructor/courses" className="text-sm font-semibold text-brand">{t('manageCourses')}</Link></div>{[['Product Design Fundamentals', '12 new enrollments', 'Today'], ['Design Systems at Scale', '18 assignments submitted', 'Yesterday'], ['Portfolio Case Study Workshop', 'Draft updated', 'Oct 20']].map(([title, activity, date]) => <div key={title} className="flex items-center justify-between border-b border-slate-100 py-4 last:border-0"><div><p className="text-sm font-semibold text-ink">{title}</p><p className="mt-1 text-xs text-slate-500">{activity}</p></div><span className="text-xs text-slate-400">{date}</span></div>)}</section><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><h3 className="font-bold text-ink">{t('completionByCourse')}</h3>{courses.map(course => <div key={course.id} className="mt-5"><div className="flex justify-between text-xs"><span className="truncate pr-2 text-slate-600">{course.title}</span><b className="text-ink">{course.completion}%</b></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand" style={{ width: `${course.completion}%` }} /></div></div>)}</section></div></div>
}

function AnnouncementManager() {
  const { announcements, saveAnnouncement, deleteAnnouncement } = useLearning()
  const [editingId, setEditingId] = useState<string>()
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [courseId, setCourseId] = useState(learnerCourses[0]?.id ?? '')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const reset = () => { setEditingId(undefined); setTitle(''); setMessage(''); setCourseId(learnerCourses[0]?.id ?? ''); setError('') }
  const edit = (announcement: Announcement) => { setEditingId(announcement.id); setTitle(announcement.title); setMessage(announcement.message); setCourseId(announcement.courseId); setError(''); setSuccess('') }
  const save = (published: boolean) => {
    if (!title.trim() || !message.trim() || !courseId) { setError('Title, message, and course are required.'); setSuccess(''); return }
    saveAnnouncement({ id: editingId ?? `announcement-${Date.now()}`, title: title.trim(), message: message.trim(), courseId, createdAt: editingId ? announcements.find(item => item.id === editingId)?.createdAt ?? 'Just now' : 'Just now', published })
    setError('')
    setSuccess(published ? 'Announcement published to enrolled students.' : 'Announcement saved as a draft.')
    reset()
  }
  const togglePublished = (announcement: Announcement) => {
    saveAnnouncement({ ...announcement, published: !announcement.published })
    setSuccess(announcement.published ? 'Announcement unpublished.' : 'Announcement published to enrolled students.')
  }

  return <div className="mx-auto max-w-6xl p-5 sm:p-8"><div className="mb-7"><p className="text-sm font-medium text-brand">Keep learners informed</p><h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">Announcements</h2><p className="mt-2 text-sm text-slate-500">Share updates with students enrolled in a specific course.</p></div>
    {success && <p className="mb-5 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700">{success}</p>}
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]"><form onSubmit={event => { event.preventDefault(); save(false) }} className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><h3 className="font-bold text-ink">{editingId ? 'Edit announcement' : 'Create announcement'}</h3><div className="mt-4 space-y-4"><Field label="Title" value={title} onChange={setTitle} placeholder="e.g. New lesson available" /><label className="block text-sm font-medium text-slate-700">Course<select value={courseId} onChange={event => setCourseId(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm">{learnerCourses.map(course => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label><label className="block text-sm font-medium text-slate-700">Message<textarea value={message} onChange={event => setMessage(event.target.value)} placeholder="Write an update for learners..." className="mt-2 min-h-28 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-brand" /></label></div>{error && <p className="mt-3 text-sm text-rose-600">{error}</p>}<div className="mt-4 flex gap-2"><button type="submit" className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600">{editingId ? 'Save draft changes' : 'Save draft'}</button><button type="button" onClick={() => save(true)} className="flex-1 rounded-xl bg-brand px-3 py-2.5 text-sm font-semibold text-white">Publish</button>{editingId && <button type="button" onClick={reset} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600">Cancel</button>}</div></form>
      <section className="space-y-4">{announcements.map(announcement => <article key={announcement.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-ink">{announcement.title}</h3><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${announcement.published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{announcement.published ? 'Published' : 'Draft'}</span></div><p className="mt-1 text-xs font-medium text-brand">{learnerCourses.find(course => course.id === announcement.courseId)?.title ?? 'Course'}</p><p className="mt-3 text-sm leading-6 text-slate-500">{announcement.message}</p><p className="mt-2 text-xs text-slate-400">Created {announcement.createdAt}</p></div><div className="flex shrink-0 gap-2"><button onClick={() => edit(announcement)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-brand" aria-label={`Edit ${announcement.title}`}><Pencil size={16} /></button><button onClick={() => deleteAnnouncement(announcement.id)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500" aria-label={`Delete ${announcement.title}`}><Trash2 size={16} /></button></div></div><button onClick={() => togglePublished(announcement)} className="mt-4 text-xs font-semibold text-brand">{announcement.published ? 'Unpublish announcement' : 'Publish announcement'}</button></article>)}{!announcements.length && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No announcements yet.</div>}</section>
    </div>
  </div>
}

function CourseManager({ courses, setCourses, query, setQuery }: { courses: InstructorCourse[]; setCourses: React.Dispatch<React.SetStateAction<InstructorCourse[]>>; query: string; setQuery: (value: string) => void }) {
  const [editing, setEditing] = useState<string>()
  const filtered = courses.filter(course => course.title.toLowerCase().includes(query.toLowerCase()))
  return <div className="mx-auto max-w-7xl p-5 sm:p-8"><div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-brand">Content library</p><h2 className="mt-2 text-2xl font-bold text-ink">My courses</h2></div><Link to="/instructor/courses/new" className="flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white"><Plus size={16} />Create course</Link></div><div className="mb-4 relative max-w-md"><Search className="absolute left-3 top-3 text-slate-400" size={17} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search courses" className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-brand" /></div><div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-soft"><table className="w-full min-w-[700px] text-left text-sm"><thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wider text-slate-400"><tr><th className="p-4">Course</th><th className="p-4">Students</th><th className="p-4">Completion</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody>{filtered.map(course => <tr key={course.id} className="border-b border-slate-100 last:border-0"><td className="p-4">{editing === course.id ? <input autoFocus value={course.title} onChange={event => setCourses(current => current.map(item => item.id === course.id ? { ...item, title: event.target.value } : item))} onBlur={() => setEditing(undefined)} className="h-9 rounded-lg border border-brand px-2 text-sm" /> : <p className="font-semibold text-ink">{course.title}</p>}<p className="mt-1 text-xs text-slate-400">{course.category} · {course.difficulty}</p></td><td className="p-4 text-slate-600">{course.students}</td><td className="p-4 text-slate-600">{course.completion}%</td><td className="p-4"><select value={course.status} onChange={event => setCourses(current => current.map(item => item.id === course.id ? { ...item, status: event.target.value as InstructorCourse['status'] } : item))} className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-600"><option>Draft</option><option>Pending Review</option><option>Published</option></select></td><td className="p-4"><div className="flex gap-2"><button onClick={() => setEditing(course.id)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-brand" aria-label="Edit course"><Pencil size={16} /></button><button onClick={() => setCourses(current => current.filter(item => item.id !== course.id))} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500" aria-label="Delete course"><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div></div>
}

function CourseForm({ onSave, saved, modules, setModules }: { onSave: (course: InstructorCourse) => void; saved: boolean; modules: { title: string; lessons: string[] }[]; setModules: React.Dispatch<React.SetStateAction<{ title: string; lessons: string[] }[]>> }) {
  const [title, setTitle] = useState(''); const [description, setDescription] = useState(''); const [category, setCategory] = useState('Design'); const [difficulty, setDifficulty] = useState<InstructorCourse['difficulty']>('Beginner'); const [lesson, setLesson] = useState('')
  const submit = (event: FormEvent) => { event.preventDefault(); onSave({ id: `new-${Date.now()}`, title: title || 'Untitled course', category, difficulty, students: 0, completion: 0, status: 'Draft' }) }
  return <div className="mx-auto max-w-4xl p-5 sm:p-8"><div className="mb-7"><p className="text-sm font-medium text-brand">Course editor</p><h2 className="mt-2 text-2xl font-bold text-ink">Create a course</h2></div>{saved && <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700"><Check size={17} />Course saved to this demo session.</div>}<form onSubmit={submit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><Field label="Course title" value={title} onChange={setTitle} placeholder="e.g. Design critique essentials" /><label className="block text-sm font-medium text-slate-700">Description<textarea required value={description} onChange={event => setDescription(event.target.value)} className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-brand" /></label><div className="grid gap-4 sm:grid-cols-2"><Select label="Category" value={category} onChange={setCategory} options={['Design', 'Development', 'Business', 'Data & AI']} /><Select label="Difficulty" value={difficulty} onChange={value => setDifficulty(value as InstructorCourse['difficulty'])} options={['Beginner', 'Intermediate', 'Advanced']} /></div><Field label="Thumbnail URL (optional)" value="" onChange={() => undefined} placeholder="https://..." /><div className="border-t border-slate-100 pt-5"><div className="flex items-center justify-between"><h3 className="font-semibold text-ink">Modules and lessons</h3><button type="button" onClick={() => setModules(current => [...current, { title: `Module ${current.length + 1}`, lessons: [] }])} className="text-sm font-semibold text-brand">+ Add module</button></div>{modules.map((module, index) => <div key={index} className="mt-3 rounded-xl bg-slate-50 p-3"><div className="flex gap-2"><input value={module.title} onChange={event => setModules(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item))} className="h-10 flex-1 rounded-lg border border-slate-200 px-3 text-sm" /><button type="button" onClick={() => setModules(current => current.filter((_, itemIndex) => itemIndex !== index))} className="text-slate-400"><Trash2 size={16} /></button></div>{module.lessons.map(item => <p key={item} className="mt-2 rounded-lg bg-white px-3 py-2 text-xs text-slate-500">{item}</p>)}<div className="mt-2 flex gap-2"><input value={lesson} onChange={event => setLesson(event.target.value)} placeholder="New lesson title" className="h-9 flex-1 rounded-lg border border-slate-200 px-3 text-xs" /><button type="button" onClick={() => { if (lesson.trim()) { setModules(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, lessons: [...item.lessons, lesson.trim()] } : item)); setLesson('') } }} className="rounded-lg bg-white px-3 text-xs font-semibold text-brand">Add lesson</button></div></div>)}</div><button className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white">Save course</button></form></div>
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) { return <label className="block text-sm font-medium text-slate-700">{label}<input required={label === 'Course title'} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand" /></label> }
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) { return <label className="block text-sm font-medium text-slate-700">{label}<select value={value} onChange={event => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><>{options.map(option => <option key={option}>{option}</option>)}</></select></label> }
type InstructorSubmission = { id: string; student: string; submittedDate: string; status: 'Submitted' | 'Graded'; score?: number; feedback?: string }
type InstructorAssignment = { id: string; title: string; course: string; dueDate: string; maxScore: number; submissions: InstructorSubmission[] }

const initialInstructorAssignments: InstructorAssignment[] = [
  {
    id: 'assignment-flow',
    title: 'Create your first user flow',
    course: 'Product Design Fundamentals',
    dueDate: 'October 24, 2026',
    maxScore: 100,
    submissions: [
      { id: 'submission-jamie', student: 'Jamie Davis', submittedDate: 'October 22, 2026', status: 'Submitted' },
      { id: 'submission-ravi', student: 'Ravi Patel', submittedDate: 'October 21, 2026', status: 'Graded', score: 88, feedback: 'Clear flow and strong attention to the user goal.' },
    ],
  },
  {
    id: 'assignment-reflection',
    title: 'React components quiz reflection',
    course: 'Modern React Development',
    dueDate: 'October 28, 2026',
    maxScore: 50,
    submissions: [{ id: 'submission-noor', student: 'Noor Hassan', submittedDate: 'October 22, 2026', status: 'Submitted' }],
  },
]

function Assignments() {
  const [assignments, setAssignments] = useState(initialInstructorAssignments)
  const [openAssignment, setOpenAssignment] = useState<string>()
  const [openSubmission, setOpenSubmission] = useState<string>()
  const [score, setScore] = useState('')
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const startGrading = (assignment: InstructorAssignment, submission: InstructorSubmission) => {
    setOpenAssignment(assignment.id)
    setOpenSubmission(submission.id)
    setScore(submission.score?.toString() ?? '')
    setFeedback(submission.feedback ?? '')
    setError('')
    setSuccess('')
  }

  const saveGrade = (assignment: InstructorAssignment, submission: InstructorSubmission) => {
    const numericScore = Number(score)
    if (score.trim() === '' || !Number.isFinite(numericScore) || numericScore < 0 || numericScore > assignment.maxScore) {
      setError(`Enter a score from 0 to ${assignment.maxScore}.`)
      setSuccess('')
      return
    }
    setAssignments(current => current.map(item => item.id === assignment.id ? {
      ...item,
      submissions: item.submissions.map(itemSubmission => itemSubmission.id === submission.id ? { ...itemSubmission, status: 'Graded', score: numericScore, feedback: feedback.trim() } : itemSubmission),
    } : item))
    setError('')
    setSuccess(`Grade saved for ${submission.student}.`)
  }

  return <div className="mx-auto max-w-6xl p-5 sm:p-8">
    <div className="mb-7"><p className="text-sm font-medium text-brand">Review learner work</p><h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">Assignments</h2><p className="mt-2 text-sm text-slate-500">Open a submission to add a score and feedback.</p></div>
    {success && <p className="mb-5 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700">{success}</p>}
    <div className="space-y-5">{assignments.map(assignment => <article key={assignment.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <button onClick={() => setOpenAssignment(openAssignment === assignment.id ? undefined : assignment.id)} className="flex w-full flex-col justify-between gap-3 text-left sm:flex-row sm:items-start">
        <div><h3 className="font-bold text-ink">{assignment.title}</h3><p className="mt-1 text-xs font-medium text-brand">{assignment.course}</p></div>
        <div className="flex flex-wrap gap-3 text-xs text-slate-500"><span>Due {assignment.dueDate}</span><span>{assignment.submissions.length} submissions</span><span className="rounded-full bg-indigo-50 px-2.5 py-1 font-semibold text-brand">{assignment.submissions.filter(submission => submission.status === 'Graded').length} graded</span></div>
      </button>
      {openAssignment === assignment.id && <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">{assignment.submissions.map(submission => <div key={submission.id} className="rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><p className="font-semibold text-ink">{submission.student}</p><p className="mt-1 text-xs text-slate-400">Submitted {submission.submittedDate}</p></div><div className="flex items-center gap-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${submission.status === 'Graded' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{submission.status}{submission.status === 'Graded' ? ` · ${submission.score}/${assignment.maxScore}` : ''}</span><button onClick={() => startGrading(assignment, submission)} className="rounded-xl bg-brand px-3 py-2 text-xs font-semibold text-white">{submission.status === 'Graded' ? 'Edit grade' : 'Open submission'}</button></div></div>
        {openSubmission === submission.id && openAssignment === assignment.id && <div className="mt-4 border-t border-slate-100 pt-4"><div className="grid gap-3 sm:grid-cols-[160px_1fr]"><label className="text-sm font-semibold text-slate-700">Score<span className="mt-1 block text-xs font-normal text-slate-400">Maximum {assignment.maxScore}</span><input type="number" min="0" max={assignment.maxScore} value={score} onChange={event => setScore(event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand" /></label><label className="text-sm font-semibold text-slate-700">Written feedback<textarea value={feedback} onChange={event => setFeedback(event.target.value)} placeholder="Share helpful feedback..." className="mt-2 min-h-20 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-brand" /></label></div>{error && <p className="mt-3 text-sm text-rose-600">{error}</p>}<button onClick={() => saveGrade(assignment, submission)} className="mt-3 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Save grade</button>{submission.status === 'Graded' && <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600"><b>Saved feedback:</b> {submission.feedback || 'No written feedback.'}</div>}</div>}
      </div>)}</div>}
    </article>)}</div>
  </div>
}
type BuilderQuestion = { id: string; type: 'single' | 'multi' | 'trueFalse'; text: string; options: string[]; correct: number[] }
type BuilderQuiz = { id: string; title: string; description: string; passingScore: number; published: boolean; questions: BuilderQuestion[] }

const initialQuizzes: BuilderQuiz[] = [{
  id: 'quiz-design-foundations',
  title: 'Foundations knowledge check',
  description: 'Check understanding of the core product design principles.',
  passingScore: 70,
  published: true,
  questions: [{ id: 'builder-q-1', type: 'single', text: 'Which practice supports a user-centered product?', options: ['Testing assumptions with users', 'Skipping research'], correct: [0] }],
}]

function QuizManager() {
  const [quizzes, setQuizzes] = useState(initialQuizzes)
  const [selectedId, setSelectedId] = useState(initialQuizzes[0].id)
  const [quiz, setQuiz] = useState<BuilderQuiz>(initialQuizzes[0])
  const [preview, setPreview] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const selectQuiz = (id: string) => {
    const next = quizzes.find(item => item.id === id)
    if (next) { setSelectedId(id); setQuiz(next); setPreview(false); setError(''); setMessage('') }
  }
  const updateQuestion = (id: string, update: Partial<BuilderQuestion>) => setQuiz(current => ({ ...current, questions: current.questions.map(question => question.id === id ? { ...question, ...update } : question) }))
  const validateQuiz = () => {
    if (!quiz.title.trim() || !quiz.description.trim()) return 'Quiz title and description are required.'
    if (!Number.isFinite(quiz.passingScore) || quiz.passingScore < 0 || quiz.passingScore > 100) return 'Passing score must be between 0 and 100.'
    if (!quiz.questions.length) return 'Add at least one question.'
    for (const question of quiz.questions) {
      if (!question.text.trim()) return 'Every question needs text.'
      if (question.options.length < 2 || question.options.some(option => !option.trim())) return 'Each question needs at least two non-empty options.'
      if (!question.correct.length) return 'Choose at least one correct answer for every question.'
      if (question.type !== 'multi' && question.correct.length > 1) return 'Single-choice and true/false questions can only have one correct answer.'
    }
    return ''
  }
  const saveQuiz = (publish = quiz.published) => {
    const validation = validateQuiz()
    if (validation) { setError(validation); setMessage(''); return }
    const savedQuiz = { ...quiz, published: publish }
    setQuiz(savedQuiz)
    setQuizzes(current => current.some(item => item.id === savedQuiz.id) ? current.map(item => item.id === savedQuiz.id ? savedQuiz : item) : [...current, savedQuiz])
    setError('')
    setMessage(publish ? 'Quiz saved and published.' : 'Quiz saved.')
  }
  const createQuiz = () => {
    const next: BuilderQuiz = { id: `quiz-${Date.now()}`, title: '', description: '', passingScore: 70, published: false, questions: [] }
    setQuizzes(current => [...current, next])
    setSelectedId(next.id)
    setQuiz(next)
    setPreview(false)
    setError('')
    setMessage('New quiz ready to edit.')
  }
  const deleteQuiz = () => {
    if (quizzes.length === 1) { setError('Keep at least one quiz in this demo.'); return }
    const remaining = quizzes.filter(item => item.id !== selectedId)
    setQuizzes(remaining)
    setQuiz(remaining[0])
    setSelectedId(remaining[0].id)
    setMessage('Quiz deleted.')
  }
  const addQuestion = () => setQuiz(current => ({ ...current, questions: [...current.questions, { id: `question-${Date.now()}`, type: 'single', text: '', options: ['', ''], correct: [] }] }))
  const changeType = (question: BuilderQuestion, type: BuilderQuestion['type']) => updateQuestion(question.id, { type, options: type === 'trueFalse' ? ['True', 'False'] : question.options.length >= 2 && question.type !== 'trueFalse' ? question.options : ['', ''], correct: [] })
  const toggleCorrect = (question: BuilderQuestion, index: number) => updateQuestion(question.id, { correct: question.type === 'multi' ? question.correct.includes(index) ? question.correct.filter(item => item !== index) : [...question.correct, index] : [index] })

  return <div className="mx-auto max-w-7xl p-5 sm:p-8"><div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-brand">Build assessments</p><h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">Quiz builder</h2><p className="mt-2 text-sm text-slate-500">Create questions, preview the learner experience, and publish quizzes.</p></div><button onClick={createQuiz} className="flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white"><Plus size={16} />New quiz</button></div>
    <div className="grid gap-6 lg:grid-cols-[250px_1fr]"><aside className="h-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-soft"><p className="px-2 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Your quizzes</p>{quizzes.map(item => <button key={item.id} onClick={() => selectQuiz(item.id)} className={`mb-1 w-full rounded-xl p-3 text-left text-sm ${item.id === selectedId ? 'bg-indigo-50 font-semibold text-brand' : 'text-slate-600 hover:bg-slate-50'}`}><span className="block truncate">{item.title || 'Untitled quiz'}</span><span className="mt-1 block text-xs text-slate-400">{item.published ? 'Published' : 'Draft'}</span></button>)}</aside>
      {preview ? <QuizPreview quiz={quiz} onClose={() => setPreview(false)} /> : <section className="space-y-5"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><div className="flex items-start justify-between gap-3"><div className="grid flex-1 gap-4 sm:grid-cols-[1fr_150px]"><Field label="Quiz title" value={quiz.title} onChange={value => setQuiz(current => ({ ...current, title: value }))} placeholder="e.g. Module checkpoint" /><label className="block text-sm font-medium text-slate-700">Passing score (%)<input type="number" min="0" max="100" value={quiz.passingScore} onChange={event => setQuiz(current => ({ ...current, passingScore: Number(event.target.value) }))} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand" /></label></div><button onClick={deleteQuiz} aria-label="Delete quiz" className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500"><Trash2 size={17} /></button></div><label className="mt-4 block text-sm font-medium text-slate-700">Description<textarea value={quiz.description} onChange={event => setQuiz(current => ({ ...current, description: event.target.value }))} placeholder="Describe what learners will practice..." className="mt-2 min-h-20 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-brand" /></label></div>
        {quiz.questions.map((question, questionIndex) => <QuestionEditor key={question.id} question={question} index={questionIndex} update={updateQuestion} changeType={changeType} toggleCorrect={toggleCorrect} remove={() => setQuiz(current => ({ ...current, questions: current.questions.filter(item => item.id !== question.id) }))} />)}
        <button onClick={addQuestion} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm font-semibold text-brand hover:border-brand"><Plus size={16} />Add question</button>
        {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}{message && <p className="rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700">{message}</p>}
        <div className="flex flex-wrap justify-end gap-2"><button onClick={() => setPreview(true)} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600"><Eye size={16} />Preview</button><button onClick={() => saveQuiz(!quiz.published)} className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white">{quiz.published ? 'Unpublish' : 'Publish quiz'}</button><button onClick={() => saveQuiz(quiz.published)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600">Save draft</button></div>
      </section>}
    </div>
  </div>
}

function QuestionEditor({ question, index, update, changeType, toggleCorrect, remove }: { question: BuilderQuestion; index: number; update: (id: string, update: Partial<BuilderQuestion>) => void; changeType: (question: BuilderQuestion, type: BuilderQuestion['type']) => void; toggleCorrect: (question: BuilderQuestion, index: number) => void; remove: () => void }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><div className="flex items-start justify-between gap-3"><div className="grid flex-1 gap-3 sm:grid-cols-[1fr_180px]"><label className="block text-sm font-semibold text-slate-700">Question {index + 1}<input value={question.text} onChange={event => update(question.id, { text: event.target.value })} placeholder="Write the question..." className="mt-2 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none focus:border-brand" /></label><label className="block text-sm font-semibold text-slate-700">Question type<select value={question.type} onChange={event => changeType(question, event.target.value as BuilderQuestion['type'])} className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-white px-2 text-sm font-normal"><option value="single">Single choice</option><option value="multi">Multiple select</option><option value="trueFalse">True / False</option></select></label></div><button onClick={remove} aria-label={`Remove question ${index + 1}`} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500"><Trash2 size={17} /></button></div><div className="mt-4 space-y-2">{question.options.map((option, optionIndex) => <div key={`${question.id}-${optionIndex}`} className="flex items-center gap-2"><input type={question.type === 'multi' ? 'checkbox' : 'radio'} name={question.id} checked={question.correct.includes(optionIndex)} onChange={() => toggleCorrect(question, optionIndex)} aria-label={`Correct answer ${optionIndex + 1}`} className="h-4 w-4 accent-brand" /><input value={option} disabled={question.type === 'trueFalse'} onChange={event => update(question.id, { options: question.options.map((item, itemIndex) => itemIndex === optionIndex ? event.target.value : item) })} placeholder={`Answer option ${optionIndex + 1}`} className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand disabled:bg-slate-50" />{question.type !== 'trueFalse' && question.options.length > 2 && <button onClick={() => { const options = question.options.filter((_, itemIndex) => itemIndex !== optionIndex); update(question.id, { options, correct: question.correct.filter(item => item !== optionIndex).map(item => item > optionIndex ? item - 1 : item) }) }} aria-label={`Remove option ${optionIndex + 1}`} className="text-slate-400 hover:text-rose-500"><Trash2 size={15} /></button>}</div>)}</div>{question.type !== 'trueFalse' && <button onClick={() => update(question.id, { options: [...question.options, ''] })} className="mt-3 text-xs font-semibold text-brand">+ Add option</button>}<p className="mt-3 text-xs text-slate-400">Select the checkbox/radio beside each correct answer.</p></section>
}

function QuizPreview({ quiz, onClose }: { quiz: BuilderQuiz; onClose: () => void }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-medium text-brand">Learner preview</p><h2 className="mt-1 text-2xl font-bold text-ink">{quiz.title || 'Untitled quiz'}</h2><p className="mt-2 text-sm text-slate-500">{quiz.description}</p></div><button onClick={onClose} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600">Back to builder</button></div><div className="mt-6 space-y-4">{quiz.questions.map((question, index) => <div key={question.id} className="rounded-xl bg-slate-50 p-4"><p className="font-semibold text-ink">{index + 1}. {question.text || 'Untitled question'}</p><div className="mt-3 space-y-2">{question.options.map(option => <div key={option} className="rounded-lg border border-slate-200 bg-white p-2.5 text-sm text-slate-600">{option || 'Empty option'}</div>)}</div></div>)}</div></section>
}

type ContentLesson = { id: string; title: string; type: 'text' | 'video' | 'resource' | 'download'; content: string; resourceName: string; resourceUrl: string }
type ContentModule = { id: string; title: string; lessons: ContentLesson[] }

const createLesson = (): ContentLesson => ({ id: `lesson-${Date.now()}`, title: '', type: 'text', content: '', resourceName: '', resourceUrl: '' })
const initialContent: ContentModule[] = [{ id: 'module-1', title: 'Getting started', lessons: [{ id: 'lesson-1', title: 'Welcome lesson', type: 'text', content: 'Introduce the course goals and learning path.', resourceName: '', resourceUrl: '' }] }]

function ContentManager({ courses }: { courses: InstructorCourse[] }) {
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.id ?? '')
  const [content, setContent] = useState<Record<string, ContentModule[]>>(() => Object.fromEntries(courses.map(course => [course.id, initialContent.map(module => ({ ...module, id: `${course.id}-${module.id}`, lessons: module.lessons.map(lesson => ({ ...lesson, id: `${course.id}-${lesson.id}` })) }))])))
  const [selectedModule, setSelectedModule] = useState('')
  const [editingLesson, setEditingLesson] = useState<string>()
  const [draft, setDraft] = useState<ContentLesson>(createLesson())
  const [moduleTitle, setModuleTitle] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const modules = content[selectedCourse] ?? []
  const updateModules = (next: ContentModule[]) => setContent(current => ({ ...current, [selectedCourse]: next }))
  const addModule = () => { if (!moduleTitle.trim()) { setError('Enter a module title.'); return } const next = [...modules, { id: `module-${Date.now()}`, title: moduleTitle.trim(), lessons: [] }]; updateModules(next); setModuleTitle(''); setSelectedModule(next[next.length - 1].id); setError(''); setMessage('Module added.') }
  const saveLesson = () => {
    if (!selectedModule || !draft.title.trim() || !draft.content.trim() && draft.type !== 'download' || draft.type === 'download' && (!draft.resourceName.trim() || !draft.resourceUrl.trim())) { setError('Choose a module and complete the required lesson fields.'); return }
    if ((draft.type === 'video' || draft.type === 'resource' || draft.type === 'download') && !isValidUrl(draft.type === 'download' ? draft.resourceUrl : draft.content)) { setError('Enter a valid http(s) URL.'); return }
    const next = modules.map(module => module.id === selectedModule ? { ...module, lessons: editingLesson ? module.lessons.map(lesson => lesson.id === editingLesson ? draft : lesson) : [...module.lessons, draft] } : module)
    updateModules(next); setDraft(createLesson()); setEditingLesson(undefined); setError(''); setMessage(editingLesson ? 'Lesson updated.' : 'Lesson added.')
  }
  const editLesson = (lesson: ContentLesson, moduleId: string) => { setSelectedModule(moduleId); setEditingLesson(lesson.id); setDraft(lesson); setError(''); setMessage('') }
  const removeLesson = (moduleId: string, lessonId: string) => updateModules(modules.map(module => module.id === moduleId ? { ...module, lessons: module.lessons.filter(lesson => lesson.id !== lessonId) } : module))
  const moveLesson = (moduleId: string, lessonIndex: number, direction: -1 | 1) => { const nextIndex = lessonIndex + direction; if (nextIndex < 0) return; updateModules(modules.map(module => { if (module.id !== moduleId || nextIndex >= module.lessons.length) return module; const lessons = [...module.lessons]; [lessons[lessonIndex], lessons[nextIndex]] = [lessons[nextIndex], lessons[lessonIndex]]; return { ...module, lessons } })) }
  const removeModule = (moduleId: string) => { updateModules(modules.filter(module => module.id !== moduleId)); if (selectedModule === moduleId) setSelectedModule('') }
  return <div className="mx-auto max-w-7xl p-5 sm:p-8"><div className="mb-7"><p className="text-sm font-medium text-brand">Manage learning materials</p><h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">Course content</h2><p className="mt-2 text-sm text-slate-500">Organize modules and add text, video, and resource lessons.</p></div><label className="mb-5 block max-w-md text-sm font-semibold text-slate-700">Course<select value={selectedCourse} onChange={event => { setSelectedCourse(event.target.value); setSelectedModule(''); setEditingLesson(undefined); setDraft(createLesson()) }} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal">{courses.map(course => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label><div className="grid gap-6 lg:grid-cols-[1fr_340px]"><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><div className="flex flex-col gap-3 sm:flex-row"><input value={moduleTitle} onChange={event => setModuleTitle(event.target.value)} placeholder="New module title" className="h-10 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand" /><button onClick={addModule} className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"><Plus size={15} className="mr-1 inline" />Add module</button></div><div className="mt-5 space-y-4">{modules.map(module => <div key={module.id} className="rounded-xl border border-slate-200 p-4"><div className="flex items-center justify-between gap-2"><input aria-label={`Module title ${module.title}`} value={module.title} onChange={event => updateModules(modules.map(item => item.id === module.id ? { ...item, title: event.target.value } : item))} onClick={() => setSelectedModule(module.id)} className={`min-w-0 flex-1 rounded-lg border-transparent px-2 py-1 font-semibold outline-none focus:border-brand ${selectedModule === module.id ? 'text-brand' : 'text-ink'}`} /><button onClick={() => removeModule(module.id)} aria-label={`Delete ${module.title}`} className="text-slate-400 hover:text-rose-500"><Trash2 size={15} /></button></div>{module.lessons.map((lesson, index) => <div key={lesson.id} className="mt-3 rounded-lg bg-slate-50 p-2.5"><div className="flex items-center gap-2"><span className="min-w-0 flex-1 truncate text-sm text-slate-600">{lesson.title || 'Untitled lesson'} <span className="text-xs text-slate-400">· {lesson.type}</span></span><button onClick={() => moveLesson(module.id, index, -1)} aria-label="Move lesson up" className="text-slate-400 disabled:opacity-30" disabled={index === 0}><ChevronUp size={15} /></button><button onClick={() => moveLesson(module.id, index, 1)} aria-label="Move lesson down" className="text-slate-400 disabled:opacity-30" disabled={index === module.lessons.length - 1}><ChevronDown size={15} /></button><button onClick={() => editLesson(lesson, module.id)} aria-label={`Edit ${lesson.title}`} className="text-slate-400 hover:text-brand"><Pencil size={15} /></button><button onClick={() => removeLesson(module.id, lesson.id)} aria-label={`Delete ${lesson.title}`} className="text-slate-400 hover:text-rose-500"><Trash2 size={15} /></button></div><p className="mt-1 truncate text-xs text-slate-400">{lesson.type === 'download' ? `${lesson.resourceName} · ${lesson.resourceUrl}` : lesson.content}</p></div>)}</div>)}</div></section><LessonEditor draft={draft} setDraft={setDraft} editing={Boolean(editingLesson)} saveLesson={saveLesson} cancel={() => { setEditingLesson(undefined); setDraft(createLesson()) }} error={error} message={message} /></div></div>
}

function LessonEditor({ draft, setDraft, editing, saveLesson, cancel, error, message }: { draft: ContentLesson; setDraft: React.Dispatch<React.SetStateAction<ContentLesson>>; editing: boolean; saveLesson: () => void; cancel: () => void; error: string; message: string }) {
  const set = (update: Partial<ContentLesson>) => setDraft(current => ({ ...current, ...update }))
  return <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><h3 className="font-bold text-ink">{editing ? 'Edit lesson' : 'Add lesson'}</h3><div className="mt-4 space-y-3"><Field label="Lesson title" value={draft.title} onChange={value => set({ title: value })} placeholder="e.g. Introduction" /><label className="block text-sm font-medium text-slate-700">Content type<select value={draft.type} onChange={event => set({ type: event.target.value as ContentLesson['type'], content: '' })} className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-white px-2 text-sm"><option value="text">Text</option><option value="video">Video URL</option><option value="resource">Resource link</option><option value="download">Downloadable resource</option></select></label>{draft.type === 'download' ? <><Field label="Resource name" value={draft.resourceName} onChange={value => set({ resourceName: value })} placeholder="e.g. Worksheet PDF" /><Field label="Resource URL" value={draft.resourceUrl} onChange={value => set({ resourceUrl: value })} placeholder="https://..." /></> : <label className="block text-sm font-medium text-slate-700">{draft.type === 'text' ? 'Lesson text' : 'URL'}{draft.type === 'text' ? <textarea value={draft.content} onChange={event => set({ content: event.target.value })} className="mt-2 min-h-28 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-brand" /> : <input value={draft.content} onChange={event => set({ content: event.target.value })} placeholder="https://..." className="mt-2 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand" />}</label>}<div className="flex gap-2"><button onClick={saveLesson} className="flex-1 rounded-xl bg-brand px-3 py-2.5 text-sm font-semibold text-white">{editing ? 'Update lesson' : 'Add lesson'}</button>{editing && <button onClick={cancel} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600">Cancel</button>}</div>{error && <p className="text-sm text-rose-600">{error}</p>}{message && <p className="text-sm text-emerald-700">{message}</p>}<div className="rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500"><b>Preview:</b> {draft.type === 'text' ? draft.content || 'Lesson text will appear here.' : draft.type === 'download' ? `${draft.resourceName || 'Resource'} · ${draft.resourceUrl || 'URL'}` : draft.content || 'Lesson URL will appear here.'}</div></div></aside>
}

function isValidUrl(value: string) {
  try { const url = new URL(value); return url.protocol === 'http:' || url.protocol === 'https:' } catch { return false }
}
function SimpleManager({ title, subtitle, rows, formLabel }: { title: string; subtitle: string; rows: string[]; formLabel: string }) { const [newItem, setNewItem] = useState(''); const [items, setItems] = useState(rows); return <div className="mx-auto max-w-5xl p-5 sm:p-8"><h2 className="text-2xl font-bold text-ink">{title}</h2><p className="mt-2 text-sm text-slate-500">{subtitle}</p><div className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><div className="flex gap-2"><input value={newItem} onChange={event => setNewItem(event.target.value)} placeholder={formLabel} className="h-11 flex-1 rounded-xl border border-slate-200 px-3 text-sm" /><button onClick={() => { if (newItem.trim()) { setItems(current => [...current, newItem]); setNewItem('') } }} className="rounded-xl bg-brand px-4 text-sm font-semibold text-white"><Plus size={16} /></button></div>{items.map(item => <div key={item} className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 p-4 text-sm text-slate-600"><span>{item}</span><button onClick={() => setItems(current => current.filter(row => row !== item))} className="text-slate-400 hover:text-rose-500"><Trash2 size={16} /></button></div>)}</div></div> }
function Analytics() {
  const [courseId, setCourseId] = useState(instructorCourses[0]?.id ?? '')
  const [price, setPrice] = useState('49')
  const [enrollmentOpen, setEnrollmentOpen] = useState(true)
  const [materials, setMaterials] = useState<CourseMaterial[]>([{ id: 'material-1', courseId, name: 'Course workbook', url: 'https://example.com/workbook.pdf' }])
  const [materialName, setMaterialName] = useState('')
  const [materialUrl, setMaterialUrl] = useState('')
  const [rubrics, setRubrics] = useState<RubricCriterion[]>([{ id: 'rubric-1', title: 'Clarity', description: 'Explains the solution clearly.', points: 10 }])
  const [criterionTitle, setCriterionTitle] = useState('')
  const addMaterial = () => { if (!materialName.trim() || !/^https?:\/\//.test(materialUrl)) return; setMaterials(current => [...current, { id: `material-${Date.now()}`, courseId, name: materialName.trim(), url: materialUrl.trim() }]); setMaterialName(''); setMaterialUrl('') }
  const addRubric = () => { if (!criterionTitle.trim()) return; setRubrics(current => [...current, { id: `rubric-${Date.now()}`, title: criterionTitle.trim(), description: 'Instructor-defined grading criterion.', points: 10 }]); setCriterionTitle('') }
  return <div className="mx-auto max-w-7xl p-5 sm:p-8"><h2 className="text-2xl font-bold text-ink">Analytics and course setup</h2><p className="mt-2 text-sm text-slate-500">Track learner outcomes and manage demo course settings.</p><div className="mt-7 grid gap-4 sm:grid-cols-3">{[['Enrollment', '1,932'], ['Completion', '68%'], ['Average quiz score', '84%']].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-ink">{value}</p></div>)}</div><div className="mt-7 grid gap-6 lg:grid-cols-2"><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><h3 className="font-bold text-ink">Pricing and enrollment</h3><label className="mt-4 block text-sm font-medium text-slate-700">Course<select value={courseId} onChange={event => setCourseId(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm">{instructorCourses.map(course => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label><label className="mt-4 block text-sm font-medium text-slate-700">Price (USD)<input type="number" min="0" value={price} onChange={event => setPrice(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" /></label><label className="mt-4 flex items-center justify-between text-sm font-medium text-slate-700">Allow new enrollments<input type="checkbox" checked={enrollmentOpen} onChange={event => setEnrollmentOpen(event.target.checked)} className="h-5 w-5 accent-brand" /></label><p className="mt-4 rounded-xl bg-indigo-50 p-3 text-sm text-brand">Mock price: ${price || '0'} · {enrollmentOpen ? 'Enrollment open' : 'Enrollment paused'}</p></section><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><h3 className="font-bold text-ink">Learning materials</h3><div className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]"><input aria-label="Material name" value={materialName} onChange={event => setMaterialName(event.target.value)} placeholder="Material name" className="h-10 rounded-lg border border-slate-200 px-3 text-sm" /><input aria-label="Material URL" value={materialUrl} onChange={event => setMaterialUrl(event.target.value)} placeholder="https://..." className="h-10 rounded-lg border border-slate-200 px-3 text-sm" /><button onClick={addMaterial} className="rounded-lg bg-brand px-3 text-sm font-semibold text-white">Attach</button></div><div className="mt-4 space-y-2">{materials.filter(material => material.courseId === courseId).map(material => <div key={material.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm"><a href={material.url} target="_blank" rel="noreferrer" className="truncate text-brand">{material.name}</a><button aria-label={`Remove ${material.name}`} onClick={() => setMaterials(current => current.filter(item => item.id !== material.id))} className="text-rose-500"><Trash2 size={15} /></button></div>)}</div></section></div><section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><h3 className="font-bold text-ink">Assignment grading rubric</h3><p className="mt-1 text-sm text-slate-500">Criteria are available to guide assignment grading.</p><div className="mt-4 flex gap-2"><input aria-label="Rubric criterion" value={criterionTitle} onChange={event => setCriterionTitle(event.target.value)} placeholder="Criterion title" className="h-10 flex-1 rounded-lg border border-slate-200 px-3 text-sm" /><button onClick={addRubric} className="rounded-lg bg-brand px-3 text-sm font-semibold text-white">Add criterion</button></div><div className="mt-4 grid gap-3 sm:grid-cols-2">{rubrics.map(rubric => <div key={rubric.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3"><div className="flex justify-between"><p className="font-semibold text-ink">{rubric.title}</p><button aria-label={`Remove ${rubric.title}`} onClick={() => setRubrics(current => current.filter(item => item.id !== rubric.id))} className="text-rose-500"><Trash2 size={15} /></button></div><p className="mt-1 text-xs text-slate-500">{rubric.description}</p><p className="mt-2 text-xs font-semibold text-brand">{rubric.points} points</p></div>)}</div></section></div>
}
