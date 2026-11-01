import type { Course, InstructorCourse, QuizQuestion, Task } from '../types'

export const courses: Course[] = [
  {
    id: 'product-design',
    title: 'Product Design Fundamentals',
    category: 'Design',
    instructor: 'Maya Chen',
    progress: 72,
    lessons: 18,
    completedLessons: 13,
    duration: '6h 20m',
    accent: 'from-violet-500 to-indigo-500',
    description: 'Learn the principles and practical process behind creating clear, useful digital products people love to use.',
    difficulty: 'Beginner',
    rating: 4.9,
    outcomes: ['Plan a user-centered design process', 'Create wireframes and user flows', 'Present design decisions with confidence'],
    modules: [{ id: 'design-1', title: 'Foundations of Product Design', lessons: [{ id: 'design-1-1', title: 'What makes a great product?', duration: '12 min', description: 'Explore the principles that make digital experiences useful and memorable.', videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' }, { id: 'design-1-2', title: 'Understanding your users', duration: '18 min', description: 'Learn how research helps teams make better product decisions.' }] }, { id: 'design-2', title: 'From idea to interface', lessons: [{ id: 'design-2-1', title: 'Mapping the user journey', duration: '22 min', description: 'Turn user needs into a clear flow through your product.' }, { id: 'design-2-2', title: 'Wireframes that communicate', duration: '16 min', description: 'Build low-fidelity wireframes that align your team.' }] }],
  },
  {
    id: 'react-development',
    title: 'Modern React Development',
    category: 'Development',
    instructor: 'Alex Morgan',
    progress: 48,
    lessons: 24,
    completedLessons: 11,
    duration: '9h 45m',
    accent: 'from-sky-500 to-cyan-400',
    description: 'Build modern, maintainable interfaces with React, TypeScript and the patterns used by professional frontend teams.',
    difficulty: 'Intermediate',
    rating: 4.8,
    outcomes: ['Compose reusable React components', 'Manage state and user interactions', 'Ship a typed React application'],
    modules: [{ id: 'react-1', title: 'React essentials', lessons: [{ id: 'react-1-1', title: 'Components and JSX', duration: '20 min', description: 'Understand the building blocks of every React interface.' }, { id: 'react-1-2', title: 'Props and composition', duration: '24 min', description: 'Share data and compose flexible components.' }] }, { id: 'react-2', title: 'State and application flow', lessons: [{ id: 'react-2-1', title: 'State with hooks', duration: '25 min', description: 'Use hooks to make your interface interactive.' }, { id: 'react-2-2', title: 'Routing a React app', duration: '18 min', description: 'Create clear navigation between application views.' }] }],
  },
  {
    id: 'data-storytelling',
    title: 'Data Storytelling with Python',
    category: 'Data & AI',
    instructor: 'Jordan Lee',
    progress: 26,
    lessons: 20,
    completedLessons: 5,
    duration: '7h 10m',
    accent: 'from-emerald-500 to-teal-400',
    description: 'Turn raw datasets into compelling stories and insightful visualizations using Python and practical data thinking.',
    difficulty: 'Intermediate',
    rating: 4.7,
    outcomes: ['Prepare and explore datasets', 'Choose effective visualizations', 'Tell a clear story with data'],
    modules: [{ id: 'data-1', title: 'Thinking with data', lessons: [{ id: 'data-1-1', title: 'Ask better questions', duration: '15 min', description: 'Start every analysis with a focused question.' }, { id: 'data-1-2', title: 'Reading a dataset', duration: '21 min', description: 'Find useful signals and patterns in unfamiliar data.' }] }, { id: 'data-2', title: 'Visual storytelling', lessons: [{ id: 'data-2-1', title: 'Choosing the right chart', duration: '19 min', description: 'Match your message to a visual form.' }, { id: 'data-2-2', title: 'Presenting your insight', duration: '17 min', description: 'Create a narrative your audience can act on.' }] }],
  },
  { id: 'leadership', title: 'Essential Leadership Skills', category: 'Business', instructor: 'Priya Shah', progress: 0, lessons: 16, completedLessons: 0, duration: '5h 40m', accent: 'from-amber-500 to-orange-400', description: 'Build the communication, collaboration and decision-making skills that help teams do their best work.', difficulty: 'Beginner', rating: 4.8, outcomes: ['Lead productive conversations', 'Give feedback that builds trust', 'Make decisions with clarity'], modules: [{ id: 'lead-1', title: 'Leading with intention', lessons: [{ id: 'lead-1-1', title: 'Your leadership style', duration: '14 min', description: 'Identify your strengths and opportunities as a leader.' }, { id: 'lead-1-2', title: 'Building team trust', duration: '20 min', description: 'Create the conditions for honest, productive teamwork.' }] }] },
  { id: 'machine-learning', title: 'Machine Learning in Practice', category: 'Data & AI', instructor: 'Noah Williams', progress: 0, lessons: 22, completedLessons: 0, duration: '8h 15m', accent: 'from-fuchsia-500 to-purple-500', description: 'Understand the practical machine learning workflow from problem framing to evaluating your first model.', difficulty: 'Advanced', rating: 4.6, outcomes: ['Frame a machine learning problem', 'Prepare features for a model', 'Evaluate model performance'], modules: [{ id: 'ml-1', title: 'Machine learning workflow', lessons: [{ id: 'ml-1-1', title: 'From problem to prediction', duration: '23 min', description: 'See how a business question becomes a modeling task.' }, { id: 'ml-1-2', title: 'Your first training set', duration: '27 min', description: 'Prepare clean data for reliable experiments.' }] }] },
  { id: 'public-speaking', title: 'Confident Public Speaking', category: 'Personal Growth', instructor: 'Elena Rossi', progress: 0, lessons: 14, completedLessons: 0, duration: '4h 30m', accent: 'from-rose-500 to-pink-400', description: 'Speak with confidence, structure your message and connect with any audience.', difficulty: 'Beginner', rating: 4.9, outcomes: ['Structure a memorable talk', 'Use your voice with intention', 'Handle presentation nerves'], modules: [{ id: 'speak-1', title: 'Your message and presence', lessons: [{ id: 'speak-1-1', title: 'Find your core message', duration: '16 min', description: 'Give your presentation one clear purpose.' }, { id: 'speak-1-2', title: 'Presenting with presence', duration: '19 min', description: 'Use pace, posture and pauses to engage listeners.' }] }] },
  { id: 'ux-research', title: 'UX Research and Discovery', category: 'Design', instructor: 'Sam Okafor', progress: 0, lessons: 19, completedLessons: 0, duration: '6h 50m', accent: 'from-indigo-500 to-blue-400', description: 'Learn lightweight research methods that uncover what users need before you design.', difficulty: 'Advanced', rating: 4.7, outcomes: ['Plan useful user interviews', 'Synthesize qualitative research', 'Share findings with stakeholders'], modules: [{ id: 'ux-1', title: 'Research foundations', lessons: [{ id: 'ux-1-1', title: 'Planning your research', duration: '18 min', description: 'Choose a method that answers your product question.' }, { id: 'ux-1-2', title: 'Running an interview', duration: '24 min', description: 'Ask open questions and listen for useful detail.' }] }] },
  { id: 'excel-productivity', title: 'Excel for Everyday Productivity', category: 'Business', instructor: 'Marcus Green', progress: 0, lessons: 15, completedLessons: 0, duration: '3h 55m', accent: 'from-lime-500 to-green-500', description: 'Work faster and make better decisions with the spreadsheet skills you use every day.', difficulty: 'Beginner', rating: 4.5, outcomes: ['Organize information clearly', 'Use formulas with confidence', 'Build simple useful reports'], modules: [{ id: 'excel-1', title: 'A smarter spreadsheet workflow', lessons: [{ id: 'excel-1-1', title: 'Organize your workbook', duration: '13 min', description: 'Set up a spreadsheet that stays easy to use.' }, { id: 'excel-1-2', title: 'Formulas that save time', duration: '22 min', description: 'Automate common calculations with simple formulas.' }] }] },
]

export const coursePricing: Record<string, number> = {
  'product-design': 49,
  'react-development': 79,
  'data-storytelling': 59,
  leadership: 39,
  'machine-learning': 99,
  'public-speaking': 45,
  'ux-research': 69,
  'excel-productivity': 29,
}

export const quizQuestions: QuizQuestion[] = [
  { id: 'q1', type: 'single', question: 'Which practice best supports a user-centered product?', options: ['Skipping research to move faster', 'Testing assumptions with real users', 'Adding every requested feature', 'Using only internal opinions'], answer: 1, explanation: 'Testing assumptions with real users keeps the product grounded in their needs.' },
  { id: 'q2', type: 'multi', question: 'Which activities are useful during product discovery?', options: ['User interviews', 'Journey mapping', 'Ignoring feedback', 'Usability testing'], answer: [0, 1, 3], explanation: 'Interviews, journey mapping and usability testing all help teams understand user needs.' },
  { id: 'q3', type: 'short', question: 'In one word, what does a wireframe describe?', options: [], answer: ['structure', 'layout'], explanation: 'A wireframe describes the structure or layout of an interface before visual polish.' },
]

export const instructorCourses: InstructorCourse[] = [
  { id: 'ic-1', title: 'Product Design Fundamentals', category: 'Design', difficulty: 'Beginner', students: 1248, completion: 72, status: 'Published' },
  { id: 'ic-2', title: 'Design Systems at Scale', category: 'Design', difficulty: 'Advanced', students: 684, completion: 61, status: 'Published' },
  { id: 'ic-3', title: 'Portfolio Case Study Workshop', category: 'Career', difficulty: 'Intermediate', students: 0, completion: 0, status: 'Draft' },
]

export const flashcards = [
  { question: 'What is a user flow?', answer: 'A sequence of steps a user takes to complete a goal in a product.' },
  { question: 'Why use a wireframe?', answer: 'To explore structure and interaction before investing in visual polish.' },
  { question: 'What makes feedback useful?', answer: 'It is specific, connected to a goal, and gives the learner a clear next step.' },
]

export const lessonSummaries: Record<string, { overview: string; points: string[] }> = {
  'design-1-1': { overview: 'Great products solve a real problem while staying simple and useful for the people using them.', points: ['Start with a clear user need.', 'Reduce friction in the most important journey.', 'Validate ideas before polishing them.'] },
  'react-1-1': { overview: 'React interfaces are made from components: small reusable pieces that describe what should appear on screen.', points: ['Components should have focused responsibilities.', 'JSX combines UI structure with JavaScript expressions.', 'Composition keeps interfaces flexible.'] },
}

export const tasks: Task[] = [
  { title: 'Create your first user flow', course: 'Product Design Fundamentals', due: 'Today', status: 'Due soon' },
  { title: 'React components quiz', course: 'Modern React Development', due: 'Tomorrow', status: 'Upcoming' },
  { title: 'Submit data visualisation', course: 'Data Storytelling with Python', due: 'Oct 28', status: 'Upcoming' },
]
