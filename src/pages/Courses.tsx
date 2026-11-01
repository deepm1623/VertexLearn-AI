import { Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CourseCard } from '../components/CourseCard'
import { courses } from '../data/mockData'

export function Courses() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All categories')
  const [difficulty, setDifficulty] = useState('All levels')
  const [rating, setRating] = useState('All ratings')
  const categories = ['All categories', ...Array.from(new Set(courses.map(course => course.category)))]
  const filtered = useMemo(() => courses.filter(course => `${course.title} ${course.instructor}`.toLowerCase().includes(query.toLowerCase()) && (category === 'All categories' || course.category === category) && (difficulty === 'All levels' || course.difficulty === difficulty) && (rating === 'All ratings' || course.rating >= Number(rating))), [query, category, difficulty, rating])
  return <div className="mx-auto max-w-7xl p-5 sm:p-8">
    <div className="mb-7"><p className="text-sm font-medium text-brand">Learn something new</p><h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">Explore courses</h2><p className="mt-2 text-sm text-slate-500">Build practical skills with expert-led learning paths.</p></div>
    <div className="mb-7 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-soft md:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-3 text-slate-400" size={18} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by course or instructor" className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-indigo-50" /></label><div className="flex flex-wrap items-center gap-2 text-slate-400"><SlidersHorizontal size={17} /><select aria-label="Category filter" value={category} onChange={event => setCategory(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-brand">{categories.map(item => <option key={item}>{item}</option>)}</select><select aria-label="Difficulty filter" value={difficulty} onChange={event => setDifficulty(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-brand"><option>All levels</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select><select aria-label="Rating filter" value={rating} onChange={event => setRating(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-brand"><option>All ratings</option><option value="4.5">4.5+ stars</option><option value="4.7">4.7+ stars</option><option value="4.9">4.9+ stars</option></select></div></div>
    {filtered.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{filtered.map(course => <CourseCard key={course.id} course={course} />)}</div> : <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><h3 className="font-semibold text-ink">No courses found</h3><p className="mt-2 text-sm text-slate-500">Try a different search term or reset your filters.</p><button onClick={() => { setQuery(''); setCategory('All categories'); setDifficulty('All levels'); setRating('All ratings') }} className="mt-4 text-sm font-semibold text-brand">Clear filters</button></div>}
  </div>
}
