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
      case 'draft': return 'bg-gray-500'
      case 'active': return 'bg-green-500'
      case 'paused': return 'bg-yellow-500'
      case 'completed': return 'bg-blue-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white">Loading projects...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-white/60 mt-1">Manage your data labeling projects</p>
        </div>
        <Button
          onClick={() => navigate('/projects/new')}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="mr-2" size={20} />
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-4">Create your first project to get started</p>
              <Button
                onClick={() => navigate('/projects/new')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="mr-2" size={20} />
                Create Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => {
            const completionRate = project.total_tasks > 0 
              ? (project.completed_tasks / project.total_tasks) * 100 
              : 0

            return (
              <Card 
                key={project.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge 
                        className={`${getStatusColor(project.status)} text-white mt-2`}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal size={16} />
                        </Button>
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
                          View Tasks
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
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {project.description || project.instructions}
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{completionRate.toFixed(0)}%</span>
                      </div>
                      <Progress value={completionRate} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Tasks:</span>
                        <span className="ml-2 font-medium">{project.total_tasks}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Completed:</span>
                        <span className="ml-2 font-medium">{project.completed_tasks}</span>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-500">
                        Created {format(new Date(project.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}