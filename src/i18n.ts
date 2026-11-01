export type Language = 'en' | 'gu'

const translations = {
  en: {
    workspace: 'Workspace', dashboard: 'Dashboard', myCourses: 'My Courses', exploreCourses: 'Explore Courses', aiTutor: 'AI Tutor',
    assignments: 'Assignments', certificates: 'Certificates', instructorDemo: 'Instructor demo', learnSmarter: 'Learn smarter',
    notifications: 'Notifications', markAllRead: 'Mark all as read', noNotifications: 'No notifications yet.', student: 'Student',
    switchDark: 'Switch to dark mode', switchLight: 'Switch to light mode', language: 'Language', exploreCatalog: 'Explore catalog',
    continueLearning: 'Continue learning', recommendations: 'Recommended for you', browseAll: 'Browse all', badges: 'Achievement badges',
    courseAnnouncements: 'Course announcements', continue: 'Continue learning', upcomingTasks: 'Upcoming tasks', viewAll: 'View all',
    keepMomentum: 'Keep up the momentum. You’re making great progress.', noAnnouncements: 'No announcements for your courses.',
    completeToEarn: 'Complete a lesson or pass a quiz to earn badges.', welcomeBack: 'Welcome back',
    learningJourney: 'Continue your learning journey with your personalized workspace.', email: 'Email address', password: 'Password',
    enterPassword: 'Enter your password', enterDashboard: 'Enter demo dashboard', requiredLogin: 'Please enter both fields to continue.',
    frontendDemo: 'This is a frontend demo. No real authentication or account data is used.', skipDemo: 'Skip to demo',
    courseDetails: 'Course details', lessonPlayer: 'Lesson player', quiz: 'Quiz', courseContent: 'Course content', createCourse: 'Create course',
    announcements: 'Announcements', quizzes: 'Quizzes', analytics: 'Analytics', instructorWorkspace: 'Instructor workspace', adminWorkspace: 'Admin workspace',
    recentActivity: 'Recent course activity', completionByCourse: 'Completion by course', manageCourses: 'Manage courses', totalCourses: 'Total courses', enrolledStudents: 'Enrolled students',
  },
  gu: {
    workspace: 'કાર્યસ્થળ', dashboard: 'ડેશબોર્ડ', myCourses: 'મારા કોર્સ', exploreCourses: 'કોર્સ શોધો', aiTutor: 'AI ટ્યુટર',
    assignments: 'સોંપણીઓ', certificates: 'પ્રમાણપત્રો', instructorDemo: 'પ્રશિક્ષક ડેમો', learnSmarter: 'વધુ સ્માર્ટ શીખો',
    notifications: 'સૂચનાઓ', markAllRead: 'બધું વાંચેલું કરો', noNotifications: 'હજુ કોઈ સૂચના નથી.', student: 'વિદ્યાર્થી',
    switchDark: 'ડાર્ક મોડ ચાલુ કરો', switchLight: 'લાઇટ મોડ ચાલુ કરો', language: 'ભાષા', exploreCatalog: 'કેટલોગ જુઓ',
    continueLearning: 'શીખવાનું ચાલુ રાખો', recommendations: 'તમારા માટે ભલામણ', browseAll: 'બધું જુઓ', badges: 'સિદ્ધિ બેજ',
    courseAnnouncements: 'કોર્સ જાહેરાતો', continue: 'ચાલુ રાખો', upcomingTasks: 'આગામી કાર્યો', viewAll: 'બધું જુઓ',
    keepMomentum: 'તમારી પ્રગતિ સારી છે. આ ગતિ જાળવો.', noAnnouncements: 'તમારા કોર્સ માટે કોઈ જાહેરાત નથી.',
    completeToEarn: 'બેજ મેળવવા માટે પાઠ પૂર્ણ કરો અથવા ક્વિઝ પાસ કરો.', welcomeBack: 'ફરી સ્વાગત છે',
    learningJourney: 'તમારા વ્યક્તિગત કાર્યસ્થળ સાથે શીખવાનું ચાલુ રાખો.', email: 'ઇમેઇલ સરનામું', password: 'પાસવર્ડ',
    enterPassword: 'પાસવર્ડ દાખલ કરો', enterDashboard: 'ડેમો ડેશબોર્ડ ખોલો', requiredLogin: 'ચાલુ રાખવા બંને ક્ષેત્રો ભરો.',
    frontendDemo: 'આ ફ્રન્ટએન્ડ ડેમો છે. વાસ્તવિક પ્રમાણીકરણ અથવા એકાઉન્ટ ડેટા નથી.', skipDemo: 'ડેમો પર જાઓ',
    courseDetails: 'કોર્સ વિગતો', lessonPlayer: 'પાઠ પ્લેયર', quiz: 'ક્વિઝ', courseContent: 'કોર્સ સામગ્રી', createCourse: 'કોર્સ બનાવો',
    announcements: 'જાહેરાતો', quizzes: 'ક્વિઝ', analytics: 'વિશ્લેષણ', instructorWorkspace: 'પ્રશિક્ષક કાર્યસ્થળ', adminWorkspace: 'એડમિન કાર્યસ્થળ',
    recentActivity: 'તાજેતરની કોર્સ પ્રવૃત્તિ', completionByCourse: 'કોર્સ પ્રમાણે પૂર્ણતા', manageCourses: 'કોર્સ મેનેજ કરો', totalCourses: 'કુલ કોર્સ', enrolledStudents: 'નોંધાયેલા વિદ્યાર્થીઓ',
  },
} as const

export type TranslationKey = keyof typeof translations.en
export const translate = (language: Language, key: TranslationKey) => translations[language][key]
