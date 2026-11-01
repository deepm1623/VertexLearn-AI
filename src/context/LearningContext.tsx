import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { AchievementBadge, Announcement, Assignment, DiscussionPost, DiscussionReply, LessonBookmark, LessonNote, QuizResult, StudentNotification } from '../types'
import { courses } from '../data/mockData'
import { translate, type Language, type TranslationKey } from '../i18n'

type FileMetadata = { name: string; size: number; type: string }
type AssignmentSubmission = { status: 'Not submitted' | 'Submitted' | 'Overdue'; file?: FileMetadata; text?: string }

type LearningContextValue = {
  enrolledCourseIds: string[]
  completedLessonIds: Record<string, string[]>
  playbackPositions: Record<string, number>
  submissions: Record<string, AssignmentSubmission>
  notes: Record<string, LessonNote[]>
  bookmarks: Record<string, LessonBookmark[]>
  announcements: Announcement[]
  notifications: StudentNotification[]
  quizResults: Record<string, QuizResult>
  streakDays: number
  badges: AchievementBadge[]
  enrollCourse: (courseId: string) => void
  isEnrolled: (courseId: string) => boolean
  markLessonComplete: (courseId: string, lessonId: string) => void
  isLessonComplete: (courseId: string, lessonId: string) => boolean
  getCourseProgress: (courseId: string) => number
  setPlaybackPosition: (lessonKey: string, seconds: number) => void
  getPlaybackPosition: (lessonKey: string) => number
  addNote: (note: Omit<LessonNote, 'id'>) => void
  removeNote: (lessonId: string, noteId: string) => void
  toggleBookmark: (bookmark: LessonBookmark) => void
  submitAssignment: (assignment: Assignment, submission: Omit<AssignmentSubmission, 'status'>) => void
  saveAnnouncement: (announcement: Announcement) => void
  deleteAnnouncement: (announcementId: string) => void
  markNotificationRead: (notificationId: string) => void
  markAllNotificationsRead: () => void
  saveQuizResult: (result: QuizResult) => void
  discussions: DiscussionPost[]
  addDiscussion: (courseId: string, message: string) => void
  editDiscussion: (postId: string, message: string) => void
  deleteDiscussion: (postId: string) => void
  addDiscussionReply: (postId: string, message: string) => void
  darkMode: boolean
  toggleDarkMode: () => void
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey) => string
}

const LearningContext = createContext<LearningContextValue | null>(null)

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const initialEnrolled = courses.filter(course => course.progress > 0).map(course => course.id)
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(initialEnrolled)
  const [completedLessonIds, setCompletedLessonIds] = useState<Record<string, string[]>>({})
  const [playbackPositions, setPlaybackPositions] = useState<Record<string, number>>({})
  const [submissions, setSubmissions] = useState<Record<string, AssignmentSubmission>>({})
  const [notes, setNotes] = useState<Record<string, LessonNote[]>>({})
  const [bookmarks, setBookmarks] = useState<Record<string, LessonBookmark[]>>({})
  const [announcements, setAnnouncements] = useState<Announcement[]>([{
    id: 'announcement-design-welcome',
    title: 'Welcome to the new design module',
    message: 'A new set of product design lessons is ready for you. Start with the user journey module this week.',
    courseId: 'product-design',
    createdAt: 'October 22, 2026',
    published: true,
  }])
  const [notifications, setNotifications] = useState<StudentNotification[]>([
    { id: 'notification-announcement', type: 'announcement', title: 'New course announcement', message: 'Welcome to the new design module', createdAt: '1 hour ago', read: false, courseId: 'product-design' },
    { id: 'notification-deadline', type: 'deadline', title: 'Assignment due soon', message: 'Create your first user flow is due October 24.', createdAt: 'Today', read: false, courseId: 'product-design' },
    { id: 'notification-quiz', type: 'quiz', title: 'New quiz published', message: 'Foundations knowledge check is ready.', createdAt: 'Yesterday', read: true, courseId: 'product-design' },
    { id: 'notification-grading', type: 'grading', title: 'Assignment graded', message: 'Your design critique reflection received feedback.', createdAt: '2 days ago', read: true },
  ])
  const [quizResults, setQuizResults] = useState<Record<string, QuizResult>>({})
  const [streakDays, setStreakDays] = useState(12)
  const [discussions, setDiscussions] = useState<DiscussionPost[]>([{
    id: 'discussion-welcome',
    courseId: 'product-design',
    author: 'Maya Chen',
    message: 'What part of the design process are you most excited to practice?',
    createdAt: 'Today',
    replies: [{ id: 'reply-welcome', author: 'Jamie Davis', message: 'I am looking forward to user interviews.', createdAt: 'Today' }],
  }])
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState<'en' | 'gu'>('en')
  useEffect(() => { document.documentElement.classList.toggle('dark', darkMode) }, [darkMode])

  const value = useMemo<LearningContextValue>(() => ({
    enrolledCourseIds,
    completedLessonIds,
    playbackPositions,
    submissions,
    notes,
    bookmarks,
    announcements,
    notifications,
    quizResults,
    streakDays,
    badges: [
      ...(Object.values(quizResults).some(result => result.passed) ? [{ id: 'quiz-pass', title: 'Quiz finisher', description: 'Passed a knowledge check.' }] : []),
      ...(Object.values(completedLessonIds).some(lessonIds => lessonIds.length > 0) ? [{ id: 'first-lesson', title: 'First steps', description: 'Completed your first lesson.' }] : []),
      ...(courses.some(course => (completedLessonIds[course.id]?.length ?? 0) === course.modules.flatMap(module => module.lessons).length && course.modules.flatMap(module => module.lessons).length > 0) ? [{ id: 'course-complete', title: 'Course finisher', description: 'Completed every lesson in a course.' }] : []),
    ],
    enrollCourse: courseId => setEnrolledCourseIds(current => current.includes(courseId) ? current : [...current, courseId]),
    isEnrolled: courseId => enrolledCourseIds.includes(courseId),
    markLessonComplete: (courseId, lessonId) => {
      setCompletedLessonIds(current => {
        const existing = current[courseId] ?? []
        return existing.includes(lessonId) ? current : { ...current, [courseId]: [...existing, lessonId] }
      })
      setEnrolledCourseIds(current => current.includes(courseId) ? current : [...current, courseId])
      setStreakDays(current => Math.max(current, 13))
    },
    isLessonComplete: (courseId, lessonId) => (completedLessonIds[courseId] ?? []).includes(lessonId),
    getCourseProgress: courseId => {
      const course = courses.find(item => item.id === courseId)
      if (!course) return 0
      const lessonProgress = ((completedLessonIds[courseId]?.length ?? 0) / course.modules.flatMap(module => module.lessons).length) * 100
      const courseQuiz = Object.values(quizResults).find(result => result.courseId === courseId)
      return Math.min(100, Math.round(lessonProgress + (courseQuiz ? (courseQuiz.score / courseQuiz.total) * 10 : 0)))
    },
    setPlaybackPosition: (lessonKey, seconds) => setPlaybackPositions(current => ({ ...current, [lessonKey]: seconds })),
    getPlaybackPosition: lessonKey => playbackPositions[lessonKey] ?? 0,
    addNote: note => setNotes(current => ({ ...current, [note.lessonId]: [...(current[note.lessonId] ?? []), { ...note, id: `${note.lessonId}-${Date.now()}` }] })),
    removeNote: (lessonId, noteId) => setNotes(current => ({ ...current, [lessonId]: (current[lessonId] ?? []).filter(note => note.id !== noteId) })),
    toggleBookmark: bookmark => setBookmarks(current => {
      const existing = current[bookmark.lessonId] ?? []
      const found = existing.some(item => Math.abs(item.seconds - bookmark.seconds) < 2)
      return { ...current, [bookmark.lessonId]: found ? existing.filter(item => Math.abs(item.seconds - bookmark.seconds) >= 2) : [...existing, bookmark] }
    }),
    submitAssignment: (assignment, submission) => setSubmissions(current => ({ ...current, [assignment.id]: { ...submission, status: 'Submitted' } })),
    saveAnnouncement: announcement => {
      setAnnouncements(current => current.some(item => item.id === announcement.id) ? current.map(item => item.id === announcement.id ? announcement : item) : [...current, announcement])
      if (announcement.published) {
        setNotifications(current => [{ id: `notification-${announcement.id}`, type: 'announcement', title: 'New course announcement', message: announcement.title, createdAt: 'Just now', read: false, courseId: announcement.courseId }, ...current.filter(item => item.id !== `notification-${announcement.id}`)])
      }
    },
    deleteAnnouncement: announcementId => setAnnouncements(current => current.filter(item => item.id !== announcementId)),
    markNotificationRead: notificationId => setNotifications(current => current.map(notification => notification.id === notificationId ? { ...notification, read: true } : notification)),
    markAllNotificationsRead: () => setNotifications(current => current.map(notification => ({ ...notification, read: true }))),
    saveQuizResult: result => {
      setQuizResults(current => ({ ...current, [result.quizId]: result }))
      if (result.passed) setStreakDays(current => Math.max(current, 13))
    },
    discussions,
    addDiscussion: (courseId, message) => setDiscussions(current => [{ id: `discussion-${Date.now()}`, courseId, author: 'Jamie Davis', message: message.trim(), createdAt: 'Just now', replies: [] }, ...current]),
    editDiscussion: (postId, message) => setDiscussions(current => current.map(post => post.id === postId ? { ...post, message: message.trim() } : post)),
    deleteDiscussion: postId => setDiscussions(current => current.filter(post => post.id !== postId)),
    addDiscussionReply: (postId, message) => setDiscussions(current => current.map(post => post.id === postId ? { ...post, replies: [...post.replies, { id: `reply-${Date.now()}`, author: 'Jamie Davis', message: message.trim(), createdAt: 'Just now' } as DiscussionReply] } : post)),
    darkMode,
    toggleDarkMode: () => setDarkMode(current => !current),
    language,
    setLanguage,
    t: key => translate(language, key),
  }), [completedLessonIds, enrolledCourseIds, playbackPositions, submissions, notes, bookmarks, announcements, notifications, quizResults, streakDays, discussions, darkMode, language])

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>
}

export function useLearning() {
  const context = useContext(LearningContext)
  if (!context) throw new Error('useLearning must be used inside LearningProvider')
  return context
}
