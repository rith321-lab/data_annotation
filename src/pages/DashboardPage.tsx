import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, TrendingUp, Users, FolderOpen, Clock, ArrowRight, BarChart3 } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { useProjectStore } from '../stores/projectStore'
import { useOrganizationStore } from '../stores/organizationStore'

export function DashboardPage() {
  const navigate = useNavigate()
  const { projects, fetchProjects } = useProjectStore()
  const { organization, fetchOrganization } = useOrganizationStore()

  useEffect(() => {
    fetchProjects()
    fetchOrganization()
  }, [fetchProjects, fetchOrganization])

  const recentProjects = projects.slice(0, 3)
  const activeProjects = projects.filter(p => p.status === 'active').length
  const totalTasks = projects.reduce((sum, p) => sum + p.total_tasks, 0)
  const completedTasks = projects.reduce((sum, p) => sum + p.completed_tasks, 0)
  const overallProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500'
      case 'completed':
        return 'bg-blue-500'
      case 'draft':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="fade-in" style={{ padding: 0 }}>
      {/* Header */}
      <div className="content-header" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--margin-lg)',
        paddingBottom: 'var(--padding-md)',
        borderBottom: '1px solid var(--border-primary)'
      }}>
        <div>
          <h1 style={{
            fontSize: 'var(--h1-size)',
            fontWeight: 'var(--h1-weight)',
            color: 'var(--text-primary)',
            margin: 0,
            marginBottom: 'var(--space-2)'
          }}>
            Dashboard
          </h1>
          <p style={{
            fontSize: 'var(--body-large)',
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            Welcome back! Here's what's happening with your projects.
          </p>
        </div>
        <button
          onClick={() => navigate('/projects/new')}
          className="btn btn-primary interactive"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-3) var(--space-6)',
            background: 'var(--accent-primary)',
            color: 'var(--text-primary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--button-size)',
            fontWeight: 'var(--button-weight)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Plus size={20} />
          New Project
        </button>
      </div>

      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'var(--space-6)',
        marginBottom: 'var(--margin-lg)'
      }}>
        <div className="card card-interactive" style={{
          background: 'var(--secondary-bg)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--padding-lg)',
          transition: 'all 0.2s ease',
          position: 'relative' as const,
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            height: '100%',
            background: 'var(--accent-primary)'
          }}></div>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <h4 style={{
              fontSize: 'var(--body-small)',
              fontWeight: '500',
              color: 'var(--text-muted)',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Total Projects
            </h4>
          </div>
          <div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-2)'
            }}>
              {projects.length}
            </div>
            <p style={{
              fontSize: 'var(--body-small)',
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              {activeProjects} active
            </p>
          </div>
        </div>

        <div className="card card-interactive" style={{
          background: 'var(--secondary-bg)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--padding-lg)',
          transition: 'all 0.2s ease',
          position: 'relative' as const,
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            height: '100%',
            background: 'var(--success)'
          }}></div>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <h4 style={{
              fontSize: 'var(--body-small)',
              fontWeight: '500',
              color: 'var(--text-muted)',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Overall Progress
            </h4>
          </div>
          <div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-2)'
            }}>
              {overallProgress.toFixed(0)}%
            </div>
            <p style={{
              fontSize: 'var(--body-small)',
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              {completedTasks} of {totalTasks} tasks
            </p>
          </div>
        </div>

        <div className="card card-interactive" style={{
          background: 'var(--secondary-bg)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--padding-lg)',
          transition: 'all 0.2s ease',
          position: 'relative' as const,
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            height: '100%',
            background: 'var(--info)'
          }}></div>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <h4 style={{
              fontSize: 'var(--body-small)',
              fontWeight: '500',
              color: 'var(--text-muted)',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Team Members
            </h4>
          </div>
          <div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-2)'
            }}>
              {organization?.user_count || 0}
            </div>
            <p style={{
              fontSize: 'var(--body-small)',
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              Active collaborators
            </p>
          </div>
        </div>

        <div className="card card-interactive" style={{
          background: 'var(--secondary-bg)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--padding-lg)',
          transition: 'all 0.2s ease',
          position: 'relative' as const,
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            height: '100%',
            background: 'var(--warning)'
          }}></div>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <h4 style={{
              fontSize: 'var(--body-small)',
              fontWeight: '500',
              color: 'var(--text-muted)',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              This Month
            </h4>
          </div>
          <div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-2)'
            }}>
              {completedTasks}
            </div>
            <p style={{
              fontSize: 'var(--body-small)',
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              Tasks completed
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <Card className="bg-white/95 backdrop-blur border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-purple-600" />
                  Recent Projects
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/projects')}
                  className="text-purple-600 hover:text-purple-700"
                >
                  View All
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentProjects.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FolderOpen size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                  <p className="text-gray-600 mb-4">Create your first project to get started</p>
                  <Button
                    onClick={() => navigate('/projects/new')}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="mr-2" size={16} />
                    Create Project
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentProjects.map((project) => {
                    const completionRate = project.total_tasks > 0 
                      ? (project.completed_tasks / project.total_tasks) * 100 
                      : 0

                    return (
                      <div 
                        key={project.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`} />
                          <div className="flex-1">
                            <h4 className="font-medium">{project.name}</h4>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {project.description || project.instructions}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">{completionRate.toFixed(0)}%</p>
                            <p className="text-xs text-gray-500">{project.completed_tasks}/{project.total_tasks} tasks</p>
                          </div>
                          <div className="w-16">
                            <Progress value={completionRate} className="h-2" />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Organization Overview */}
        <div className="space-y-6">
          {organization && (
            <Card className="bg-white/95 backdrop-blur border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Organization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">{organization.name}</h3>
                  <Badge className="mt-1 bg-blue-100 text-blue-800">
                    {organization.subscription_tier.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Projects</span>
                    <span className="text-sm font-medium">
                      {organization.project_count}/{organization.max_projects}
                    </span>
                  </div>
                  <Progress 
                    value={(organization.project_count / organization.max_projects) * 100} 
                    className="h-2" 
                  />
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Team Members</span>
                    <span className="text-sm font-medium">
                      {organization.user_count}/{organization.max_workers}
                    </span>
                  </div>
                  <Progress 
                    value={(organization.user_count / organization.max_workers) * 100} 
                    className="h-2" 
                  />
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/organization')}
                >
                  Manage Organization
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="bg-white/95 backdrop-blur border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => navigate('/projects/new')}
              >
                <Plus className="mr-2 w-4 h-4" />
                Create New Project
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => navigate('/organization')}
              >
                <Users className="mr-2 w-4 h-4" />
                Invite Team Members
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => navigate('/projects')}
              >
                <BarChart3 className="mr-2 w-4 h-4" />
                View All Projects
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 