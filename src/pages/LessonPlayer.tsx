import { ArrowLeft, ArrowRight, Bookmark, Check, CheckCircle2, Copy, FileText, Send, Sparkles, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useLearning } from '../context/LearningContext'
import { courses, lessonSummaries } from '../data/mockData'

export function LessonPlayer() {
  const { courseId, lessonId } = useParams()
  const course = courses.find(item => item.id === courseId)
  const allLessons = useMemo(() => course?.modules.flatMap(module => module.lessons) ?? [], [course])
  const lessonIndex = allLessons.findIndex(lesson => lesson.id === lessonId)
  const lesson = allLessons[lessonIndex]
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const { enrollCourse, markLessonComplete, isLessonComplete, completedLessonIds, setPlaybackPosition, getPlaybackPosition, getCourseProgress, notes: lessonNotes, bookmarks, addNote, removeNote, toggleBookmark } = useLearning()
  const [speed, setSpeed] = useState(1)
  const [position, setPosition] = useState(0)
  const [mediaUnavailable, setMediaUnavailable] = useState(false)
  const [noteDraft, setNoteDraft] = useState('')
  const [showSummary, setShowSummary] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!lessonId) return
    setPosition(getPlaybackPosition(lessonId))
    setMediaUnavailable(false)
    setNoteDraft('')
  }, [lessonId, getPlaybackPosition])

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = speed
  }, [speed])

  if (!course || !lesson) return <div className="mx-auto max-w-xl p-8 text-center"><h2 className="text-2xl font-bold text-ink">Lesson not found</h2><Link to="/courses" className="mt-5 inline-block text-sm font-semibold text-brand">Back to catalog</Link></div>

  const completed = isLessonComplete(course.id, lesson.id)
  const completedCount = completedLessonIds[course.id]?.length ?? 0
  const courseProgress = getCourseProgress(course.id)
  const summary = lessonSummaries[lesson.id] ?? { overview: `${lesson.title} introduces the core ideas and gives you a practical way to apply them.`, points: ['Connect the concept to a real example.', 'Practice the idea in a small exercise.', 'Review your notes before moving on.'] }
  const summaryText = `${summary.overview}\n\n${summary.points.map(point => `• ${point}`).join('\n')}`
  const currentNotes = lessonNotes[lesson.id] ?? []
  const currentBookmarks = bookmarks[lesson.id] ?? []
  const hasVideo = Boolean(lesson.videoUrl)
  const savePosition = (seconds: number) => { setPosition(seconds); setPlaybackPosition(lesson.id, seconds) }
  const goToLesson = (index: number) => { const next = allLessons[index]; if (next) navigate(`/learn/${course.id}/${next.id}`) }

  return <div className="mx-auto max-w-7xl p-5 sm:p-8"><Link to={`/courses/${course.id}`} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand"><ArrowLeft size={16} />Back to course</Link>
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]"><main>
      <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-soft">
        {!hasVideo ? <div className="flex min-h-64 flex-col justify-center bg-gradient-to-br from-indigo-950 to-slate-900 px-6 py-10 text-white"><FileText size={32} className="mb-4 text-indigo-300" /><p className="font-semibold">Text lesson</p><p className="mt-2 text-sm leading-6 text-white/70">{lesson.description}</p><p className="mt-4 text-xs text-white/50">Read the lesson, then mark it complete when you are ready.</p></div> : mediaUnavailable ? <div className="flex aspect-video flex-col items-center justify-center px-6 text-center text-white"><p className="font-semibold">Video unavailable</p><p className="mt-2 text-sm text-white/60">The video could not be loaded. You can still read the lesson and mark it complete.</p></div> : <video ref={videoRef} className="aspect-video w-full bg-black" controls preload="metadata" src={lesson.videoUrl} onLoadedMetadata={event => { const saved = getPlaybackPosition(lesson.id); if (saved > 0) event.currentTarget.currentTime = saved }} onTimeUpdate={event => savePosition(event.currentTarget.currentTime)} onEnded={() => { enrollCourse(course.id); markLessonComplete(course.id, lesson.id) }} onError={() => setMediaUnavailable(true)} />}
        {hasVideo && !mediaUnavailable && <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-slate-900 px-4 py-3"><span className="text-xs text-white/60">Position: {Math.floor(position)}s · Session-only resume</span><label className="flex items-center gap-2 text-xs text-white/70">Speed<select value={speed} onChange={event => setSpeed(Number(event.target.value))} className="rounded-lg border border-white/20 bg-slate-800 px-2 py-1 text-white"><option value="0.75">0.75x</option><option value="1">1x</option><option value="1.25">1.25x</option><option value="1.5">1.5x</option><option value="2">2x</option></select></label></div>}
      </div>
      <div className="mt-6"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-brand">{course.title}</p><h1 className="mt-1 text-2xl font-bold text-ink">{lesson.title}</h1></div><span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">{lesson.duration}</span></div><p className="mt-4 leading-7 text-slate-500">{lesson.description}</p><p className="mt-3 text-sm font-medium text-slate-500">{completedCount} of {allLessons.length} lessons complete · {courseProgress}% course progress</p>
        <div className="mt-6 flex flex-wrap gap-3"><button onClick={() => goToLesson(lessonIndex - 1)} disabled={lessonIndex === 0} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"><ArrowLeft size={16} />Previous</button><button onClick={() => { enrollCourse(course.id); markLessonComplete(course.id, lesson.id) }} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${completed ? 'bg-emerald-50 text-emerald-700' : 'bg-brand text-white hover:bg-indigo-700'}`}>{completed ? <Check size={16} /> : <CheckCircle2 size={16} />}{completed ? 'Lesson complete' : 'Mark complete'}</button><button onClick={() => goToLesson(lessonIndex + 1)} disabled={lessonIndex === allLessons.length - 1} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40">Next lesson<ArrowRight size={16} /></button></div>
        <div className="mt-8 flex flex-wrap gap-3"><button onClick={() => setShowSummary(!showSummary)} className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-brand"><Sparkles size={16} />{showSummary ? 'Hide summary' : 'Generate summary'}</button>{showSummary && <button onClick={() => { navigator.clipboard?.writeText(summaryText); setCopied(true); window.setTimeout(() => setCopied(false), 1500) }} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600"><Copy size={16} />{copied ? 'Copied' : 'Copy summary'}</button>}</div>{showSummary && <section className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5"><p className="text-sm leading-6 text-slate-600">{summary.overview}</p><ul className="mt-3 space-y-2 text-sm text-slate-600">{summary.points.map(point => <li key={point}>• {point}</li>)}</ul></section>}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5"><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><FileText size={18} className="text-brand" /><h2 className="font-semibold text-ink">Timestamped notes</h2></div><button onClick={() => toggleBookmark({ lessonId: lesson.id, seconds: position })} className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${currentBookmarks.some(item => Math.abs(item.seconds - position) < 2) ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-500'}`}><Bookmark size={14} fill={currentBookmarks.some(item => Math.abs(item.seconds - position) < 2) ? 'currentColor' : 'none'} />{currentBookmarks.some(item => Math.abs(item.seconds - position) < 2) ? 'Bookmarked' : 'Bookmark time'}</button></div><div className="mt-4 flex gap-2"><textarea value={noteDraft} onChange={event => setNoteDraft(event.target.value)} placeholder="Write a note at the current video position..." className="min-h-20 flex-1 resize-y rounded-xl border border-slate-200 p-3 text-sm text-slate-600 outline-none focus:border-brand focus:ring-4 focus:ring-indigo-50" /><button disabled={!noteDraft.trim()} onClick={() => { addNote({ lessonId: lesson.id, seconds: position, text: noteDraft.trim() }); setNoteDraft('') }} className="self-end rounded-xl bg-brand p-3 text-white disabled:cursor-not-allowed disabled:opacity-40" aria-label="Save note"><Send size={17} /></button></div><div className="mt-4 space-y-2">{currentNotes.length === 0 ? <p className="text-xs text-slate-400">No notes yet. Notes stay in this demo session.</p> : currentNotes.map(note => <div key={note.id} className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-3"><div><span className="text-xs font-semibold text-brand">{Math.floor(note.seconds)}s</span><p className="mt-1 text-sm text-slate-600">{note.text}</p></div><button onClick={() => removeNote(lesson.id, note.id)} aria-label={`Delete note at ${Math.floor(note.seconds)} seconds`} className="text-slate-400 hover:text-rose-500"><Trash2 size={15} /></button></div>)}</div><div className="mt-3 text-xs text-slate-400">Bookmarks: {currentBookmarks.length} · timestamped at the current position</div></section>
      </div>
    </main><aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-soft lg:sticky lg:top-6"><div className="mb-4 flex items-center justify-between"><h2 className="font-bold text-ink">Course lessons</h2><span className="text-xs text-slate-400">{completedCount}/{allLessons.length}</span></div><div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand" style={{ width: `${courseProgress}%` }} /></div><div className="space-y-1">{course.modules.map(module => <div key={module.id}><p className="px-2 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{module.title}</p>{module.lessons.map(item => <button key={item.id} onClick={() => navigate(`/learn/${course.id}/${item.id}`)} className={`flex w-full items-center justify-between rounded-lg px-2 py-2.5 text-left text-sm ${item.id === lesson.id ? 'bg-indigo-50 font-semibold text-brand' : 'text-slate-600 hover:bg-slate-50'}`}><span className="truncate">{item.title}</span><span className="ml-2 shrink-0 text-xs text-slate-400">{item.duration}</span></button>)}</div>)}</div></aside></div>
  </div>
}
