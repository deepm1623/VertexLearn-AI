import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { NotFound } from './pages/NotFound'
import { Placeholder } from './pages/Placeholder'
import { Courses } from './pages/Courses'
import { CourseDetails } from './pages/CourseDetails'
import { LessonPlayer } from './pages/LessonPlayer'
import { Quiz } from './pages/Quiz'
import { AiTutor } from './pages/AiTutor'
import { InstructorLayout } from './layouts/InstructorLayout'
import { InstructorWorkspace } from './pages/InstructorWorkspace'
import { Assignments } from './pages/Assignments'
import { Certificates } from './pages/Certificates'
import { AdminLayout } from './layouts/AdminLayout'
import { AdminWorkspace } from './pages/AdminWorkspace'

export function App() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<AppLayout />}><Route path="/dashboard" element={<Dashboard />} /><Route path="/courses" element={<Courses />} /><Route path="/courses/:courseId" element={<CourseDetails />} /><Route path="/learn/:courseId/:lessonId" element={<LessonPlayer />} /><Route path="/quiz" element={<Quiz />} /><Route path="/ai-tutor" element={<AiTutor />} /><Route path="/assignments" element={<Assignments />} /><Route path="/certificates" element={<Certificates />} /></Route>
    <Route element={<InstructorLayout />}><Route path="/instructor/dashboard" element={<InstructorWorkspace />} /><Route path="/instructor/courses" element={<InstructorWorkspace />} /><Route path="/instructor/courses/new" element={<InstructorWorkspace />} /><Route path="/instructor/content" element={<InstructorWorkspace />} /><Route path="/instructor/assignments" element={<InstructorWorkspace />} /><Route path="/instructor/announcements" element={<InstructorWorkspace />} /><Route path="/instructor/quizzes" element={<InstructorWorkspace />} /><Route path="/instructor/analytics" element={<InstructorWorkspace />} /></Route>
    <Route element={<AdminLayout />}><Route path="/admin" element={<AdminWorkspace />} /><Route path="/admin/users" element={<AdminWorkspace />} /><Route path="/admin/courses" element={<AdminWorkspace />} /><Route path="/admin/settings" element={<AdminWorkspace />} /></Route>
    <Route path="/" element={<Navigate to="/login" replace />} /><Route path="*" element={<NotFound />} />
  </Routes>
}
