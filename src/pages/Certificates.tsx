import { Award, Download, Eye, LockKeyhole, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { courses } from '../data/mockData'
import { useLearning } from '../context/LearningContext'

const certificateId = (courseId: string) => `VLA-${courseId.toUpperCase()}-2026`
const pdfEscape = (value: string) => value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')

function createCertificatePdf(courseTitle: string, id: string) {
  const lines = [
    'VertexLearn AI',
    'Certificate of Completion',
    'This certifies that Jamie Davis completed',
    courseTitle,
    `Certificate ID: ${id}`,
    `Completion date: ${new Date().toLocaleDateString()}`,
  ]
  const content = ['BT', '/F1 24 Tf', '72 700 Td', ...lines.flatMap((line, index) => [index ? '0 -45 Td' : '', `(${pdfEscape(line)}) Tj`]), 'ET'].filter(Boolean).join('\n')
  const objects = [
    '1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj',
    '2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj',
    '3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources<< /Font<< /F1 4 0 R >> >> /Contents 5 0 R >>endobj',
    '4 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj',
    `5 0 obj<< /Length ${content.length} >>stream\n${content}\nendstream\nendobj`,
  ]
  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  objects.forEach(object => { offsets.push(pdf.length); pdf += `${object}\n` })
  const xref = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${offset.toString().padStart(10, '0')} 00000 n `).join('\n')}\ntrailer<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
  return new Blob([pdf], { type: 'application/pdf' })
}

export function Certificates() {
  const { enrolledCourseIds, getCourseProgress } = useLearning()
  const [previewCourseId, setPreviewCourseId] = useState<string | null>(null)
  const previewCourse = courses.find(course => course.id === previewCourseId)
  const download = (courseTitle: string, courseId: string) => {
    const url = URL.createObjectURL(createCertificatePdf(courseTitle, certificateId(courseId)))
    const link = document.createElement('a')
    link.href = url
    link.download = `${courseTitle.toLowerCase().replace(/\s+/g, '-')}-certificate.pdf`
    link.click()
    URL.revokeObjectURL(url)
  }
  return <div className="mx-auto max-w-5xl p-5 sm:p-8"><div className="mb-7"><p className="text-sm font-medium text-brand">Your achievements</p><h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">Certificates</h2><p className="mt-2 text-sm text-slate-500">Complete every lesson in a course to unlock its certificate.</p></div><div className="grid gap-5 sm:grid-cols-2">{courses.filter(course => enrolledCourseIds.includes(course.id)).map(course => { const progress = getCourseProgress(course.id); const eligible = progress === 100; return <article key={course.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><div className={`flex h-32 items-center justify-center rounded-xl ${eligible ? 'bg-gradient-to-br from-amber-100 to-indigo-100 text-brand' : 'bg-slate-100 text-slate-400'}`}>{eligible ? <Award size={42} /> : <LockKeyhole size={34} />}</div><h3 className="mt-4 font-bold text-ink">{course.title}</h3><div className="mt-3 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand" style={{ width: `${progress}%` }} /></div><div className="mt-2 flex justify-between text-xs text-slate-500"><span>{progress}% complete</span><span>{eligible ? 'Ready' : 'Locked'}</span></div>{eligible ? <div className="mt-4 grid grid-cols-2 gap-2"><button onClick={() => setPreviewCourseId(course.id)} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600"><Eye size={16} />Preview</button><button onClick={() => download(course.title, course.id)} className="flex items-center justify-center gap-2 rounded-xl bg-brand px-3 py-2.5 text-sm font-semibold text-white"><Download size={16} />PDF</button></div> : <Link to={`/courses/${course.id}`} className="mt-4 block text-center text-sm font-semibold text-brand">Continue course</Link>}</article> })}</div>{enrolledCourseIds.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><p className="text-sm text-slate-500">Enroll in a course to start working toward a certificate.</p></div>}{previewCourse && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-5" role="dialog" aria-modal="true" aria-labelledby="certificate-preview-title" tabIndex={-1}><div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl"><div className="flex justify-end"><button aria-label="Close preview" onClick={() => setPreviewCourseId(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={18} /></button></div><div className="border-8 border-double border-amber-200 bg-gradient-to-br from-amber-50 to-indigo-50 px-6 py-12 text-center"><Award className="mx-auto text-brand" size={44} /><p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-brand">VertexLearn AI</p><h2 id="certificate-preview-title" className="mt-5 text-3xl font-serif font-bold text-ink">Certificate of Completion</h2><p className="mt-5 text-sm text-slate-500">This certifies that</p><p className="mt-2 text-2xl font-bold text-ink">Jamie Davis</p><p className="mt-4 text-sm text-slate-500">has successfully completed</p><p className="mt-2 text-xl font-semibold text-brand">{previewCourse.title}</p><p className="mt-6 text-xs text-slate-500">ID: {certificateId(previewCourse.id)} · {new Date().toLocaleDateString()}</p></div><button onClick={() => download(previewCourse.title, previewCourse.id)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white"><Download size={16} />Download PDF</button></div></div>}</div>
}
