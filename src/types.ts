export type Course = {
  id: string
  title: string
  category: string
  instructor: string
  progress: number
  lessons: number
  completedLessons: number
  duration: string
  accent: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  rating: number
  outcomes: string[]
  modules: CourseModule[]
}

export type CourseModule = {
  id: string
  title: string
  lessons: Lesson[]
}

export type Lesson = {
  id: string
  title: string
  duration: string
  description: string
  videoUrl?: string
}

export type Task = {
  title: string
  course: string
  due: string
  status: 'Due soon' | 'Upcoming'
}

export type QuizQuestion = {
  id: string
  type: 'single' | 'multi' | 'short'
  question: string
  options: string[]
  answer: number | number[] | string[]
  explanation: string
}

export type Assignment = {
  id: string
  title: string
  course: string
  instructions: string
  deadline: string
}

export type LessonNote = {
  id: string
  lessonId: string
  seconds: number
  text: string
}

export type LessonBookmark = {
  lessonId: string
  seconds: number
}

export type InstructorCourse = {
  id: string
  title: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  students: number
  completion: number
  status: 'Draft' | 'Pending Review' | 'Published'
}

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string
  sources?: string[]
}

export type Announcement = {
  id: string
  title: string
  message: string
  courseId: string
  createdAt: string
  published: boolean
}

export type StudentNotification = {
  id: string
  type: 'announcement' | 'deadline' | 'quiz' | 'grading'
  title: string
  message: string
  createdAt: string
  read: boolean
  courseId?: string
}

export type QuizResult = {
  quizId: string
  courseId: string
  score: number
  total: number
  passed: boolean
  completedAt: string
}

export type AchievementBadge = {
  id: string
  title: string
  description: string
}

export type DiscussionReply = {
  id: string
  author: string
  message: string
  createdAt: string
}

export type DiscussionPost = {
  id: string
  courseId: string
  author: string
  message: string
  createdAt: string
  replies: DiscussionReply[]
}

export type RubricCriterion = {
  id: string
  title: string
  description: string
  points: number
}

export type CourseMaterial = {
  id: string
  courseId: string
  name: string
  url: string
}
