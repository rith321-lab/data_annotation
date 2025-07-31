import { useState, useEffect } from 'react'
import { ProjectsPage } from './components/ProjectsPage'
import { AuthPage } from './components/AuthPage'
import { AnalyticsPage } from './components/AnalyticsPage'
import { NotificationBell } from './components/NotificationCenter'
import { ThemeToggle } from './components/ThemeToggle'
import { apiClient } from './api/client'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar'
import { Badge } from './components/ui/badge'
import { Toaster } from './components/ui/sonner'
import { cn } from './components/ui/utils'
import { 
  BarChart3, 
  Users, 
  Settings, 
  TrendingUp, 
  Bell, 
  LogOut, 
  Sparkles,
  Database,
  Activity,
  Zap
} from 'lucide-react'

export default function App() {
  const [view, setView] = useState<'login' | 'dashboard'>('login')
  const [activeNav, setActiveNav] = useState('Projects')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token')
      const refreshToken = localStorage.getItem('refresh_token')
      
      if (token) {
        try {
          // Set tokens in API client
          apiClient.setTokens(token, refreshToken || '')
          const user = await apiClient.getCurrentUser()
          setCurrentUser(user)
          setView('dashboard')
        } catch (error) {
          console.error('Auth check failed:', error)
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          apiClient.clearTokens()
        }
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    apiClient.clearTokens()
    setCurrentUser(null)
    setView('login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
          <div className="w-6 h-6 border-2 border-muted-foreground border-t-primary rounded-full animate-spin" />
          <span>Loading Verita AI...</span>
        </div>
      </div>
    )
  }

  // Modern Dashboard
  if (view === 'dashboard') {
    const navItems = [
      { icon: BarChart3, label: 'Projects', active: activeNav === 'Projects', description: 'Manage data labeling projects' },
      { icon: Users, label: 'Team', active: activeNav === 'Team', description: 'Collaborate with team members' },
      { icon: TrendingUp, label: 'Analytics', active: activeNav === 'Analytics', description: 'View insights and metrics' },
      { icon: Settings, label: 'Settings', active: activeNav === 'Settings', description: 'Configure workspace settings' },
    ]

    return (
      <div className="flex min-h-screen bg-background">
        {/* Modern Sidebar */}
        <div className="w-72 bg-card/50 backdrop-blur-xl border-r border-border flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg">
                  V
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Verita AI
                </h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  Data Platform
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.label}
                    onClick={() => setActiveNav(item.label)}
                    variant={item.active ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-11",
                      item.active ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "hover:bg-secondary/80"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className={cn(
                        "text-xs",
                        item.active ? "text-primary-foreground/80" : "text-muted-foreground"
                      )}>
                        {item.description}
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>
            
            {/* Quick Stats */}
            <div className="mt-6 p-4 bg-secondary/30 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Quick Stats</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Projects</span>
                  <Badge variant="secondary">3</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Tasks</span>
                  <Badge variant="secondary">1,247</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completion</span>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600">87%</Badge>
                </div>
              </div>
            </div>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {currentUser?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {currentUser?.full_name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentUser?.email}
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-center gap-2 hover:bg-destructive/10 hover:border-destructive hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Modern Header */}
          <header className="bg-card/50 backdrop-blur-xl px-8 py-6 flex justify-between items-center border-b border-border shadow-sm">
            <div>
              <h1 className="text-3xl font-bold">{activeNav}</h1>
              <p className="text-muted-foreground mt-1">
                {activeNav === 'Projects' ? 'Manage your data labeling projects' :
                 activeNav === 'Team' ? 'Collaborate with your team' :
                 activeNav === 'Analytics' ? 'View insights and metrics' :
                 'Configure your workspace'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell />
              <ThemeToggle />
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Zap className="w-3 h-3 mr-1" />
                Pro Plan
              </Badge>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 bg-background overflow-auto">
            {activeNav === 'Projects' && <ProjectsPage />}
            {activeNav === 'Team' && (
              <div className="p-8">
                <Card className="text-center py-16">
                  <CardHeader>
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-2xl mb-2">Team Management</CardTitle>
                    <CardDescription className="text-base">
                      Collaborate with team members, assign roles, and manage permissions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </CardContent>
                </Card>
              </div>
            )}
            {activeNav === 'Analytics' && <AnalyticsPage />}
            {activeNav === 'Settings' && (
              <div className="p-8">
                <Card className="text-center py-16">
                  <CardHeader>
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Settings className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-2xl mb-2">Settings</CardTitle>
                    <CardDescription className="text-base">
                      Configure your workspace, integrations, and preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
        <Toaster />
      </div>
    )
  }

  // Login View
  return (
    <AuthPage onAuthSuccess={() => {
      setView('dashboard')
    }} />
  )
}