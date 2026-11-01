# VertexLearn AI LMS

A frontend-only Learning Management System (LMS) built with React, Vite, and TypeScript. VertexLearn provides separate interfaces for students, instructors, and administrators to demonstrate common learning management workflows.

## Features

### Student Module
- Student dashboard with course progress and learning activity
- Browse courses and enroll in available courses
- Watch course videos and track progress
- Take quizzes and view results
- Submit assignments
- Earn and preview course certificates
- Participate in course discussions
- View announcements and notifications

### Instructor Module
- Instructor dashboard and analytics
- Create and manage courses
- Manage course content and learning materials
- Create and manage quizzes
- Publish announcements
- Manage assignments and grading rubrics
- View course enrollment and performance metrics

### Admin Module
- Admin dashboard with platform metrics
- Search and manage users
- Update user roles and account status
- Review and approve or reject courses
- View mock revenue and analytics
- Manage platform settings

### Additional Features
- Responsive layout for desktop, tablet, and mobile
- Light and dark themes
- English and Gujarati language selector
- Accessible navigation and form feedback

## Technology Stack

- React
- Vite
- TypeScript
- CSS
- React state and mock data

## Getting Started

### Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (included with Node.js)
- Git (optional, for cloning the repository)

### Installation

1. Clone or download the project.
2. Open a terminal in the project root directory.
3. Install the dependencies:

   ```bash
   npm install
   ```

### Start the Development Server

Run:

```bash
npm run dev
```

Vite will display a local URL in the terminal, usually:

```text
http://localhost:5173
```

Open that URL in your browser to access VertexLearn.

### Production Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Accessing the Modules

Use the application's role-based navigation to access the student, instructor, and admin interfaces.

| Module | Main route |
|---|---|
| Student Dashboard | `/dashboard` |
| Instructor Dashboard | `/instructor/dashboard` |
| Instructor Quizzes | `/instructor/quizzes` |
| Instructor Content | `/instructor/content` |
| Instructor Announcements | `/instructor/announcements` |

The admin module is accessible through the admin navigation. Exact access depends on the role selected or provided by the current mock login flow.

> Note: Routes may require navigating through the application's login or role selection screen first.

## Project Structure

```text
src/
├── components/       # Shared UI components
├── context/          # Shared application state
├── pages/            # Student-facing pages
├── styles.css        # Global styles
├── i18n.ts           # English and Gujarati translations
└── ...
```

## Important Notes

- This is a **frontend-only demonstration project**.
- Data is provided through mock data and client-side React state.
- Changes are not persisted after refreshing the page.
- Authentication, database operations, real file uploads, and live analytics are not connected to a backend.
- Some course and user content may remain in English when Gujarati is selected.

## Troubleshooting

### Dependencies fail to install

Check that Node.js and npm are installed:

```bash
node -v
npm -v
```

Then try:

```bash
npm install
```

### Development server does not start

Ensure the terminal is in the project root and run:

```bash
npm run dev
```

If the default port is occupied, Vite may provide a different local URL.

### Build errors

Run:

```bash
npm run build
```

Review the terminal output for the file and error details.

## License

This project was created for educational and demonstration purposes.
