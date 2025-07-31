import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Home,
  BarChart3, 
  Building2,
  Settings, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: BarChart3, label: 'Projects', path: '/projects' },
  { icon: Building2, label: 'Organization', path: '/organization' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const sidebarStyle = {
    width: isCollapsed ? '80px' : 'var(--sidebar-width)',
    background: 'var(--secondary-bg)',
    borderRight: '1px solid var(--border-primary)',
    height: '100vh',
    transition: 'width 0.3s ease',
    display: 'flex',
    flexDirection: 'column' as const,
    position: 'fixed' as const,
    left: 0,
    top: 0,
    zIndex: 1000
  }

  const headerStyle = {
    padding: 'var(--padding-lg)',
    borderBottom: '1px solid var(--border-primary)',
    minHeight: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: isCollapsed ? 'center' : 'flex-start'
  }

  const logoStyle = {
    width: '40px',
    height: '40px',
    background: 'var(--accent-primary)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const
  }

  const logoIconStyle = {
    width: '24px',
    height: '24px',
    background: 'var(--text-primary)',
    borderRadius: '4px',
    transform: 'rotate(12deg)'
  }

  const brandTextStyle = {
    marginLeft: 'var(--space-3)',
    display: isCollapsed ? 'none' : 'block'
  }

  const navStyle = {
    flex: 1,
    padding: 'var(--padding-lg)',
    paddingTop: 'var(--padding-md)'
  }

  const menuItemStyle = (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    padding: 'var(--space-3) var(--space-4)',
    marginBottom: 'var(--space-2)',
    borderRadius: 'var(--radius-md)',
    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
    background: isActive ? 'var(--accent-primary)' : 'transparent',
    fontSize: 'var(--body-small)',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    width: '100%',
    textAlign: 'left' as const,
    gap: 'var(--space-3)',
    justifyContent: isCollapsed ? 'center' : 'flex-start'
  })

  const footerStyle = {
    padding: 'var(--padding-lg)',
    borderTop: '1px solid var(--border-primary)'
  }

  const toggleButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--space-2) var(--space-4)',
    background: 'var(--surface-bg)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-primary)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--body-small)',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: '100%',
    gap: 'var(--space-2)'
  }

  return (
    <div style={sidebarStyle} className="sidebar">
      {/* Header */}
      <div style={headerStyle}>
        <div style={logoStyle}>
          <div style={logoIconStyle}></div>
        </div>
        <div style={brandTextStyle}>
          <h1 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '700', 
            color: 'var(--text-primary)',
            margin: 0,
            lineHeight: '1.2'
          }}>
            Verita<sup style={{ fontSize: '0.75rem' }}>AI</sup>
          </h1>
          <p style={{ 
            fontSize: 'var(--body-xs)', 
            color: 'var(--text-accent)',
            margin: 0,
            marginTop: '2px'
          }}>
            Data Annotation
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav style={navStyle}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path || 
              (item.path === '/projects' && location.pathname.startsWith('/projects')) ||
              (item.path === '/dashboard' && location.pathname === '/')
            
            return (
              <li key={index}>
                <button
                  onClick={() => navigate(item.path)}
                  style={menuItemStyle(isActive)}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--surface-bg)'
                      e.currentTarget.style.color = 'var(--text-primary)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'var(--text-secondary)'
                    }
                  }}
                >
                  <item.icon size={20} />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Toggle Button */}
      <div style={footerStyle}>
        <button
          onClick={onToggle}
          style={toggleButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--border-primary)'
            e.currentTarget.style.color = 'var(--text-primary)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--surface-bg)'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
        >
          {isCollapsed ? (
            <ChevronRight size={16} />
          ) : (
            <>
              <ChevronLeft size={16} />
              {!isCollapsed && <span>Collapse</span>}
            </>
          )}
        </button>
      </div>
    </div>
  )
}