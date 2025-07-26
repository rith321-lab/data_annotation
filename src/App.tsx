import { useState, useEffect } from 'react'
import { ProjectsPage } from './components/ProjectsPage'
import { TeamPage } from './components/TeamPage'
import { QualityControl } from './components/QualityControl'
import { ReportsPage } from './components/ReportsPage'
import { WebhookSettings } from './components/WebhookSettings'
import { NotificationBell } from './components/NotificationCenter'

// Icons as simple SVG components
const BarChart3Icon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 20V10M12 20V4M6 20v-6"/>
  </svg>
)

const AwardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
)

const CreditCardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
  </svg>
)

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>
  </svg>
)

const FileTextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>
  </svg>
)

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m15 18-6-6 6-6"/>
  </svg>
)

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m9 18 6-6-6-6"/>
  </svg>
)

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3M20.5 7.5L16 12l4.5 4.5M3.5 7.5L8 12l-4.5 4.5M20.5 16.5L16 12l4.5-4.5M3.5 16.5L8 12l-4.5-4.5"/>
  </svg>
)

export default function App() {
  const [view, setView] = useState<'home' | 'login' | 'dashboard'>('home')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeNav, setActiveNav] = useState('Projects')
  const [currentPage, setCurrentPage] = useState('dashboard')

  // Check if user is already logged in
  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      setView('dashboard')
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    
    try {
      const formData = new URLSearchParams()
      formData.append('username', email)
      formData.append('password', password)
      
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      })
      
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)
        setMessage('Login successful!')
        setTimeout(() => setView('dashboard'), 1000)
      } else {
        setMessage('Login failed. Please check your credentials.')
      }
    } catch (error) {
      setMessage('Error connecting to server. Make sure the backend is running on http://localhost:8000')
    }
    setIsLoading(false)
  }

  const handleRegister = async () => {
    setIsLoading(true)
    setMessage('')
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          email: email,
          password: password,
          full_name: 'Test User'
        })
      })
      
      if (response.ok) {
        setMessage('Registration successful! You can now login.')
      } else {
        const errorData = await response.json()
        setMessage(`Registration failed: ${errorData.detail || 'Unknown error'}`)
      }
    } catch (error) {
      setMessage('Error connecting to server. Make sure the backend is running on http://localhost:8000')
    }
    setIsLoading(false)
  }

  if (view === 'dashboard') {
    const navItems = [
      { icon: BarChart3Icon, label: 'Projects', active: activeNav === 'Projects' },
      { icon: AwardIcon, label: 'Qualifications' },
      { icon: CreditCardIcon, label: 'Add funds' },
      { icon: UsersIcon, label: 'Team' },
      { icon: MailIcon, label: 'Inbox' },
      { icon: FileTextIcon, label: 'Announcements' },
    ]

    const contributors = [
      { initials: 'BR', name: 'Braeden R.', role: 'Project Lead', hours: 10, tasks: 3, color: '#ef4444' },
      { initials: 'A', name: 'Alex', role: 'Data Analyst', hours: 10, tasks: 3, color: '#3b82f6' },
      { initials: 'SM', name: 'Sarah M.', role: 'ML Engineer', hours: 10, tasks: 3, color: '#6366f1' },
      { initials: 'MJ', name: 'Mike J.', role: 'QA Specialist', hours: 10, tasks: 3, color: '#8b5cf6' },
      { initials: 'ES', name: 'Emma S.', role: 'Project Manager', hours: 10, tasks: 3, color: '#f59e0b' },
      { initials: 'CL', name: 'Chris L.', role: 'Data Scientist', hours: 10, tasks: 3, color: '#ea580c' },
      { initials: 'LK', name: 'Lisa K.', role: 'UX Researcher', hours: 10, tasks: 3, color: '#2563eb' },
      { initials: 'TR', name: 'Tom R.', role: 'Backend Dev', hours: 10, tasks: 3, color: '#dc2626' },
      { initials: 'AP', name: 'Anna P.', role: 'Frontend Dev', hours: 10, tasks: 3, color: '#f97316' },
      { initials: 'DW', name: 'David W.', role: 'DevOps', hours: 10, tasks: 3, color: '#ef4444' },
      { initials: 'ST', name: 'Sophie T.', role: 'Designer', hours: 10, tasks: 3, color: '#a855f7' },
      { initials: 'MH', name: 'Mark H.', role: 'Tech Lead', hours: 10, tasks: 3, color: '#3b82f6' },
    ]

    return (
      <div style={{ 
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Sidebar */}
        <div style={{
          width: isSidebarCollapsed ? '80px' : '280px',
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'width 0.3s ease',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Logo */}
          <div style={{ 
            padding: '2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'white',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  background: 'linear-gradient(135deg, #7c3aed, #c026d3)',
                  borderRadius: '6px',
                  transform: 'rotate(12deg)'
                }} />
              </div>
              {!isSidebarCollapsed && (
                <div>
                  <h1 style={{ color: 'white', fontSize: '1.5rem', margin: 0 }}>
                    Verita<sup style={{ fontSize: '0.75rem' }}>AI</sup>
                  </h1>
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', margin: 0 }}>
                    Design System
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav style={{ flex: 1, padding: '1rem' }}>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {navItems.map((item, index) => (
                <li key={index} style={{ marginBottom: '0.5rem' }}>
                  <button
                    onClick={() => {
                      setActiveNav(item.label)
                      if (item.label === 'Projects') {
                        setCurrentPage('projects')
                      } else if (item.label === 'Team') {
                        setCurrentPage('team')
                      } else if (item.label === 'Qualifications') {
                        setCurrentPage('quality')
                      } else if (item.label === 'Inbox') {
                        setCurrentPage('reports')
                      } else {
                        setCurrentPage('dashboard')
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: item.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      color: item.active ? 'white' : 'rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: '0.875rem',
                      justifyContent: isSidebarCollapsed ? 'center' : 'flex-start'
                    }}
                    onMouseOver={(e) => {
                      if (!item.active) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                        e.currentTarget.style.color = 'white'
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!item.active) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'
                      }
                    }}
                  >
                    <item.icon />
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Collapse button */}
          <div style={{ padding: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
              }}
            >
              {isSidebarCollapsed ? <ChevronRightIcon /> : (
                <>
                  <ChevronLeftIcon />
                  <span>Collapse</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <header style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            padding: '1.5rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div>
              <h1 style={{ 
                color: 'white', 
                fontSize: '2rem', 
                margin: 0,
                fontWeight: '600'
              }}>
                Projects
              </h1>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                margin: '0.25rem 0 0 0',
                fontSize: '1rem'
              }}>
                Data Collection & Analysis
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                background: 'white', 
                borderRadius: '8px', 
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <NotificationBell />
                <button
                  onClick={() => setCurrentPage('webhooks')}
                  style={{
                    padding: '0.5rem',
                    background: 'transparent',
                    border: 'none',
                    color: '#6b7280',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#f3f4f6'
                    e.currentTarget.style.color = '#111827'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#6b7280'
                  }}
                  title="Webhook Settings"
                >
                  <SettingsIcon />
                </button>
              </div>
              <button
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                }}
              >
                + New Project
              </button>
            </div>
          </header>

          {/* Content */}
          <main style={{ 
            flex: 1, 
            padding: '2rem',
            overflowY: 'auto'
          }}>
            {currentPage === 'projects' ? (
              <ProjectsPage />
            ) : currentPage === 'team' ? (
              <TeamPage />
            ) : currentPage === 'quality' ? (
              <QualityControl />
            ) : currentPage === 'reports' ? (
              <ReportsPage />
            ) : currentPage === 'webhooks' ? (
              <WebhookSettings />
            ) : (
              <>
            {/* Welcome Card */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '3rem',
              marginBottom: '2rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #f87171, #fb923c)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    background: 'white',
                    borderRadius: '6px'
                  }} />
                </div>
                <span style={{ 
                  color: '#1f2937',
                  fontSize: '1.125rem',
                  fontWeight: '500'
                }}>
                  Verita
                </span>
              </div>
              
              <h2 style={{ 
                color: '#1f2937',
                fontSize: '2rem',
                margin: '0 0 0.5rem 0',
                fontWeight: '600'
              }}>
                Welcome Aboard
              </h2>
              <p style={{ 
                color: '#6b7280',
                margin: '0 0 2rem 0',
                fontSize: '1.125rem'
              }}>
                Get started with your first project
              </p>
              
              <button
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #c026d3, #7c3aed)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.opacity = '0.9'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
              >
                Start Project
              </button>
            </div>

            {/* Active Contributors */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '2rem'
              }}>
                <h3 style={{ 
                  color: '#1f2937',
                  fontSize: '1.5rem',
                  margin: 0,
                  fontWeight: '600'
                }}>
                  Active Contributors
                </h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    color: '#1f2937',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    This week
                  </button>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}>
                    All contributors
                  </button>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    cursor: 'pointer',
                    fontSize: '1.25rem'
                  }}>
                    •••
                  </button>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '1.5rem'
              }}>
                {contributors.map((contributor, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      background: contributor.color,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem',
                      color: 'white',
                      fontSize: '1.25rem',
                      fontWeight: '600'
                    }}>
                      {contributor.initials}
                    </div>
                    <h4 style={{ 
                      color: '#1f2937',
                      margin: '0 0 0.25rem 0',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {contributor.name}
                    </h4>
                    <p style={{ 
                      color: '#6b7280',
                      margin: '0 0 0.5rem 0',
                      fontSize: '0.75rem'
                    }}>
                      {contributor.role}
                    </p>
                    <p style={{ 
                      color: '#9ca3af',
                      margin: '0',
                      fontSize: '0.75rem'
                    }}>
                      {contributor.hours} hours
                    </p>
                    <p style={{ 
                      color: '#9ca3af',
                      margin: '0',
                      fontSize: '0.75rem'
                    }}>
                      {contributor.tasks} active tasks
                    </p>
                  </div>
                ))}
              </div>
            </div>
              </>
            )}
          </main>
        </div>
      </div>
    )
  }

  if (view === 'login') {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%)',
          filter: 'blur(100px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-50%',
          left: '-20%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(192, 38, 211, 0.3) 0%, transparent 70%)',
          filter: 'blur(100px)'
        }} />

        <div className="animate-fadeIn" style={{ 
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '3rem',
          borderRadius: '1.5rem',
          width: '100%',
          maxWidth: '400px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: '2rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              background: 'linear-gradient(to right, #7c3aed, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Welcome Back
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Sign in to your Verita AI account
            </p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.5)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                }}
                required
              />
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ 
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.5)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                }}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: isLoading ? 'rgba(124, 58, 237, 0.5)' : 'linear-gradient(to right, #7c3aed, #a855f7)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginBottom: '1rem',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => {
                if (!isLoading) e.currentTarget.style.opacity = '0.9'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.opacity = '1'
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
            
            <button
              type="button"
              onClick={handleRegister}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'transparent',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.5)'
                  e.currentTarget.style.color = '#a855f7'
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                e.currentTarget.style.color = 'white'
              }}
            >
              Create Account
            </button>
          </form>
          
          {message && (
            <div className="animate-fadeIn" style={{ 
              marginTop: '1.5rem', 
              padding: '0.75rem',
              background: message.includes('successful') 
                ? 'rgba(34, 197, 94, 0.1)' 
                : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${message.includes('successful') 
                ? 'rgba(34, 197, 94, 0.3)' 
                : 'rgba(239, 68, 68, 0.3)'}`,
              borderRadius: '0.5rem',
              textAlign: 'center',
              fontSize: '0.875rem',
              color: message.includes('successful') ? '#22c55e' : '#ef4444'
            }}>
              {message}
            </div>
          )}
          
          <button
            onClick={() => setView('home')}
            style={{
              marginTop: '1.5rem',
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              textDecoration: 'underline',
              width: '100%',
              textAlign: 'center',
              fontSize: '0.875rem'
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  // Home view (landing page)
  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#0a0a0a',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(124, 58, 237, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(192, 38, 211, 0.15) 0%, transparent 50%)',
        filter: 'blur(100px)'
      }} />
      
      {/* Header */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        padding: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            V
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white' }}>Verita AI</span>
        </div>
        
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#features" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Features</a>
          <a href="#pricing" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Pricing</a>
          <a href="http://localhost:8000/docs" target="_blank" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>API Docs</a>
          <button
            onClick={() => setView('login')}
            style={{
              padding: '0.5rem 1.5rem',
              background: 'linear-gradient(to right, #7c3aed, #a855f7)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = '0.9'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            Get Started
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main style={{
        position: 'relative',
        zIndex: 10,
        padding: '4rem 2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div className="animate-fadeIn">
          <h1 style={{ 
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            fontWeight: '700',
            marginBottom: '1.5rem',
            lineHeight: '1.1',
            color: 'white'
          }}>
            <span style={{
              background: 'linear-gradient(to right, #7c3aed, #a855f7, #c026d3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              AI-Powered
            </span>
            <br />
            Data Labeling Platform
          </h1>
          
          <p style={{ 
            fontSize: '1.25rem',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '3rem',
            maxWidth: '600px',
            margin: '0 auto 3rem'
          }}>
            Build high-quality training data with our advanced labeling tools, 
            quality control, and workforce management platform.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
            <button
              onClick={() => setView('login')}
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(to right, #7c3aed, #a855f7)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1.125rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Start Free Trial
            </button>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              style={{
                padding: '1rem 2rem',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.5rem',
                fontSize: '1.125rem',
                fontWeight: '500',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              View Demo
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}