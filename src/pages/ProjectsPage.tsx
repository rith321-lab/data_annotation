import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, MoreHorizontal, Play, Pause, Archive, FolderOpen } from 'lucide-react'
import { format } from 'date-fns'

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import { useProjectStore } from '../stores/projectStore'
import { toast } from 'sonner'

export function ProjectsPage() {
  const navigate = useNavigate()
  const { projects, isLoading, fetchProjects, launchProject, pauseProject, deleteProject } = useProjectStore()

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleProjectAction = async (action: string, projectId: string) => {
    try {
      switch (action) {
        case 'launch':
          await launchProject(projectId)
          toast.success('Project launched successfully')
          break
        case 'pause':
          await pauseProject(projectId)
          toast.success('Project paused successfully')
          break
        case 'delete':
          if (confirm('Are you sure you want to delete this project?')) {
            await deleteProject(projectId)
            toast.success('Project deleted successfully')
          }
          break
      }
    } catch (error) {
      toast.error(`Failed to ${action} project`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'var(--text-muted)'
      case 'active': return 'var(--success)'
      case 'paused': return 'var(--warning)'
      case 'completed': return 'var(--info)'
      case 'cancelled': return 'var(--error)'
      default: return 'var(--text-muted)'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'draft': return 'rgba(136, 136, 136, 0.1)'
      case 'active': return 'rgba(40, 167, 69, 0.1)'
      case 'paused': return 'rgba(255, 193, 7, 0.1)'
      case 'completed': return 'rgba(23, 162, 184, 0.1)'
      case 'cancelled': return 'rgba(220, 53, 69, 0.1)'
      default: return 'rgba(136, 136, 136, 0.1)'
    }
  }

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50vh'
      }}>
        <div className="loading" style={{
          color: 'var(--text-primary)',
          fontSize: 'var(--body-large)'
        }}>
          Loading projects...
        </div>
      </div>
    )
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
            Projects
          </h1>
          <p style={{
            fontSize: 'var(--body-large)',
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            Manage your data labeling projects
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

      {/* Projects Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: 'var(--space-6)'
      }}>
        {projects.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            background: 'var(--secondary-bg)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--padding-xl)',
            textAlign: 'center' as const
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'var(--surface-bg)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--margin-md) auto'
            }}>
              <FolderOpen size={32} style={{ color: 'var(--text-muted)' }} />
            </div>
            <h3 style={{
              fontSize: 'var(--h4-size)',
              fontWeight: 'var(--h4-weight)',
              color: 'var(--text-primary)',
              margin: '0 0 var(--space-2) 0'
            }}>
              No projects yet
            </h3>
            <p style={{
              fontSize: 'var(--body-base)',
              color: 'var(--text-secondary)',
              margin: '0 0 var(--margin-md) 0'
            }}>
              Create your first project to get started
            </p>
            <button
              onClick={() => navigate('/projects/new')}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-5)',
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
              Create Project
            </button>
          </div>
        ) : (
          projects.map((project) => {
            const completionRate = project.total_tasks > 0 
              ? (project.completed_tasks / project.total_tasks) * 100 
              : 0

            return (
              <div 
                key={project.id}
                className="card card-interactive"
                style={{
                  background: 'var(--secondary-bg)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--padding-lg)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative' as const
                }}
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                {/* Status Indicator */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  background: getStatusColor(project.status),
                  borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)'
                }}></div>

                {/* Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-4)'
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: 'var(--h4-size)',
                      fontWeight: 'var(--h4-weight)',
                      color: 'var(--text-primary)',
                      margin: '0 0 var(--space-2) 0',
                      lineHeight: 'var(--line-height-tight)'
                    }}>
                      {project.name}
                    </h3>
                    <span style={{
                      display: 'inline-block',
                      padding: 'var(--space-1) var(--space-3)',
                      background: getStatusBg(project.status),
                      color: getStatusColor(project.status),
                      fontSize: 'var(--body-xs)',
                      fontWeight: '600',
                      borderRadius: 'var(--radius-pill)',
                      textTransform: 'capitalize' as const
                    }}>
                      {project.status}
                    </span>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <button style={{
                        padding: 'var(--space-2)',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        transition: 'all 0.2s ease'
                      }}>
                        <MoreHorizontal size={16} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                                              <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/projects/${project.id}`)
                        }}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/projects/${project.id}/tasks`)
                        }}>
                          Manage Tasks
                        </DropdownMenuItem>
                      {project.status === 'draft' && (
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          handleProjectAction('launch', project.id)
                        }}>
                          <Play className="mr-2" size={16} />
                          Launch Project
                        </DropdownMenuItem>
                      )}
                      {project.status === 'active' && (
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          handleProjectAction('pause', project.id)
                        }}>
                          <Pause className="mr-2" size={16} />
                          Pause Project
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleProjectAction('delete', project.id)
                        }}
                      >
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Description */}
                <p style={{
                  fontSize: 'var(--body-small)',
                  color: 'var(--text-secondary)',
                  margin: '0 0 var(--margin-md) 0',
                  lineHeight: 'var(--line-height-base)',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {project.description || project.instructions}
                </p>
                
                {/* Progress Section */}
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-2)'
                  }}>
                    <span style={{
                      fontSize: 'var(--body-small)',
                      color: 'var(--text-muted)',
                      fontWeight: '500'
                    }}>
                      Progress
                    </span>
                    <span style={{
                      fontSize: 'var(--body-small)',
                      color: 'var(--text-primary)',
                      fontWeight: '600'
                    }}>
                      {completionRate.toFixed(0)}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    background: 'var(--surface-bg)',
                    borderRadius: 'var(--radius-pill)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${completionRate}%`,
                      height: '100%',
                      background: getStatusColor(project.status),
                      borderRadius: 'var(--radius-pill)',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'var(--space-4)',
                  marginBottom: 'var(--space-4)'
                }}>
                  <div>
                    <span style={{
                      fontSize: 'var(--body-xs)',
                      color: 'var(--text-muted)',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Tasks
                    </span>
                    <div style={{
                      fontSize: 'var(--body-base)',
                      color: 'var(--text-primary)',
                      fontWeight: '600',
                      marginTop: 'var(--space-1)'
                    }}>
                      {project.total_tasks}
                    </div>
                  </div>
                  <div>
                    <span style={{
                      fontSize: 'var(--body-xs)',
                      color: 'var(--text-muted)',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Completed
                    </span>
                    <div style={{
                      fontSize: 'var(--body-base)',
                      color: 'var(--text-primary)',
                      fontWeight: '600',
                      marginTop: 'var(--space-1)'
                    }}>
                      {project.completed_tasks}
                    </div>
                  </div>
                </div>
                
                {/* Footer */}
                <div style={{
                  paddingTop: 'var(--space-3)',
                  borderTop: '1px solid var(--border-primary)'
                }}>
                  <p style={{
                    fontSize: 'var(--body-xs)',
                    color: 'var(--text-muted)',
                    margin: 0
                  }}>
                    Created {format(new Date(project.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}