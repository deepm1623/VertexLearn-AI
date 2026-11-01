import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { quizQuestions } from '../data/mockData'
import type { QuizQuestion } from '../types'
import { useLearning } from '../context/LearningContext'

type Answer = number | number[] | string

function isCorrect(question: QuizQuestion, answer: Answer | undefined) {
  if (answer === undefined) return false
  if (question.type === 'single') return answer === question.answer
  if (question.type === 'multi') {
    const correctAnswers = question.answer as number[]
    return Array.isArray(answer) && answer.length === correctAnswers.length && answer.every(value => correctAnswers.includes(value))
  }
  const acceptedAnswers = question.answer as string[]
  return typeof answer === 'string' && acceptedAnswers.some(expected => expected.toLowerCase() === answer.trim().toLowerCase())
}

export function Quiz() {
  const { saveQuizResult } = useLearning()
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [submitted, setSubmitted] = useState(false)
  const [validation, setValidation] = useState(false)
  const score = useMemo(() => quizQuestions.filter(question => isCorrect(question, answers[question.id])).length, [answers])
  const reset = () => { setAnswers({}); setSubmitted(false); setValidation(false) }
  const setOption = (question: QuizQuestion, optionIndex: number) => {
    if (submitted) return
    if (question.type === 'multi') {
      setAnswers(state => {
        const current: number[] = Array.isArray(state[question.id]) ? (state[question.id] as number[]) : []
        return { ...state, [question.id]: current.includes(optionIndex) ? current.filter(value => value !== optionIndex) : [...current, optionIndex] }
      })
    } else setAnswers(state => ({ ...state, [question.id]: optionIndex }))
  }
  const submit = () => { if (Object.keys(answers).length !== quizQuestions.length || quizQuestions.some(question => question.type === 'multi' && !(answers[question.id] as number[])?.length)) { setValidation(true); return } setSubmitted(true); setValidation(false); saveQuizResult({ quizId: 'product-design-foundations', courseId: 'product-design', score, total: quizQuestions.length, passed: score / quizQuestions.length >= 0.7, completedAt: new Date().toISOString() }) }
  const passed = score / quizQuestions.length >= 0.7
  return <div className="mx-auto max-w-3xl p-5 sm:p-8"><Link to="/courses" className="text-sm font-medium text-slate-500 hover:text-brand">Back to catalog</Link><div className="mt-6"><p className="text-sm font-medium text-brand">Product Design Fundamentals</p><h1 className="mt-2 text-3xl font-bold text-ink">Foundations knowledge check</h1><p className="mt-2 text-sm text-slate-500">Single-choice, multi-select and short-answer questions.</p></div>{submitted && <div className={`mt-7 rounded-2xl border p-5 ${passed ? 'border-emerald-100 bg-emerald-50' : 'border-amber-100 bg-amber-50'}`}><p className="text-sm font-medium text-brand">Quiz result</p><p className="mt-1 text-3xl font-bold text-ink">{score} / {quizQuestions.length}</p><p className="mt-1 text-sm font-semibold">{passed ? 'Passed — great work!' : 'Not passed — review the explanations and try again.'}</p><p className="mt-1 text-xs text-slate-600">Your result contributes to course progress.</p></div>}{validation && !submitted && <p className="mt-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">Please answer every question before submitting.</p>}<div className="mt-7 space-y-5">{quizQuestions.map((question, index) => { const selected = answers[question.id]; const selectedOptions: number[] = question.type === 'multi' && Array.isArray(selected) ? (selected as number[]) : []; return <section key={question.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-semibold text-ink">{index + 1}. {question.question}</p><span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500">{question.type === 'multi' ? 'Select all that apply' : question.type === 'short' ? 'Short answer' : 'Single choice'}</span></div>{question.type === 'short' ? <><input disabled={submitted} value={typeof selected === 'string' ? selected : ''} onChange={event => setAnswers(state => ({ ...state, [question.id]: event.target.value }))} placeholder="Type your answer" className="mt-4 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand disabled:bg-slate-50" /><p className="mt-2 text-xs text-slate-400">Demo grading uses trimmed, case-insensitive matching.</p></> : <div className="mt-4 space-y-2">{question.options.map((option, optionIndex) => { const selectedOption = question.type === 'multi' ? selectedOptions.includes(optionIndex) : selected === optionIndex; const correct = submitted && (Array.isArray(question.answer) ? (question.answer as number[]).includes(optionIndex) : question.answer === optionIndex); const incorrect = submitted && selectedOption && !correct; return <button disabled={submitted} key={option} onClick={() => setOption(question, optionIndex)} className={`flex w-full items-center justify-between rounded-xl border p-3 text-left text-sm transition ${correct ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : incorrect ? 'border-rose-300 bg-rose-50 text-rose-800' : selectedOption ? 'border-brand bg-indigo-50 text-brand' : 'border-slate-200 text-slate-600 hover:border-indigo-200'} disabled:cursor-default`}>{option}{correct && <CheckCircle2 size={17} />}{incorrect && <XCircle size={17} />}</button> })}</div>}{submitted && <p className={`mt-4 rounded-lg p-3 text-xs leading-5 ${isCorrect(question, selected) ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-500'}`}><b>{isCorrect(question, selected) ? 'Correct. ' : 'Review. '}</b>{question.explanation}</p>}</section> })}</div><div className="mt-6 flex justify-end">{submitted ? <button onClick={reset} className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"><RotateCcw size={16} />Retake quiz</button> : <button onClick={submit} className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Submit quiz</button>}</div></div>
}
