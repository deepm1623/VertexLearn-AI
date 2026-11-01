import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { Topbar } from '../components/Topbar'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return <div className="min-h-screen bg-slate-50 lg:flex"><Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /><div className="min-w-0 flex-1"><Topbar onMenu={() => setSidebarOpen(true)} /><main><Outlet /></main></div></div>
}
