import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import './styles.css'
import { LearningProvider } from './context/LearningContext'

createRoot(document.getElementById('root')!).render(<StrictMode><BrowserRouter><LearningProvider><App /></LearningProvider></BrowserRouter></StrictMode>)
