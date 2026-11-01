import { ArrowRight, Clock3, PlayCircle, Star } from 'lucide-react'
import type { Course } from '../types'
import { Link } from 'react-router-dom'
import { useLearning } from '../context/LearningContext'

export function CourseCard({ course }: { course: Course }) {
  const { isEnrolled, getCourseProgress } = useLearning()
  const enrolled = isEnrolled(course.id)
  const progress = enrolled ? getCourseProgress(course.id) : 0
  const totalLessons = course.modules.flatMap(module => module.lessons).length
  return <Link to={`/courses/${course.id}`} className="block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition hover:-translate-y-0.5 hover:border-indigo-200">
    <div className={`flex h-28 items-center justify-center bg-gradient-to-br ${course.accent}`}><PlayCircle className="text-white/90" size={34} strokeWidth={1.5} /></div>
    <div className="p-4"><div className="mb-2 flex items-center justify-between"><span className="text-[11px] font-semibold uppercase tracking-wider text-brand">{course.category}</span><span className="flex items-center gap-1 text-xs text-slate-400"><Clock3 size={13} />{course.duration}</span></div>
      <h3 className="font-semibold text-ink">{course.title}</h3><p className="mt-1 text-xs text-slate-400">By {course.instructor}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs"><span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-500">{course.difficulty}</span><span className="flex items-center gap-1 font-medium text-amber-500"><Star size={13} fill="currentColor" />{course.rating}</span></div>
      <div className="mt-4 flex items-center justify-between text-xs"><span className="font-medium text-slate-500">{enrolled ? `${Math.round(progress / 100 * totalLessons)} of ${totalLessons} lessons` : `${course.lessons} lessons`}</span><span className="font-bold text-brand">{enrolled ? `${progress}%` : 'Start course'}</span></div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand" style={{ width: `${progress}%` }} /></div>
      <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-brand">View course <ArrowRight size={15} /></span>
    </div>
  </Link>
}
