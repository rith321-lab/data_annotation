import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'

export function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen" style={{ background: 'var(--primary-bg)' }}>
      <div className="flex h-screen">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
        <main className="flex-1 overflow-auto main-content" style={{ 
          background: 'var(--tertiary-bg)',
          marginLeft: isSidebarCollapsed ? '80px' : 'var(--sidebar-width)',
          padding: 'var(--padding-xl)',
          transition: 'margin-left 0.3s ease'
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}