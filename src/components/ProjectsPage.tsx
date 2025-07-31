import React, { useState, useEffect } from 'react'
import { AnnotationInterface, QuestionType } from './AnnotationInterface'
import { apiClient } from '../api/client'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { cn } from './ui/utils'
import {
  Plus,
  Play,
  Pause,
  Calendar,
  Target,
  Activity,
  ArrowLeft,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FolderPlus,
  Search
} from 'lucide-react'

interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'draft' | 'paused' | 'cancelled' | 'archived'
  total_tasks: number
  completed_tasks: number
  project_type: string
  created_at: string
  instructions: string
  organization_id: string
  creator_id: string
}

interface NewProjectForm {
  name: string
  description: string
  questionType: string
}

export const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showAnnotation, setShowAnnotation] = useState(false)
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [newProjectForm, setNewProjectForm] = useState<NewProjectForm>({
    name: '',
    description: '',
    questionType: 'text_classification'
  })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Loading projects from API...')
      const projectsData = await apiClient.getProjects()
      console.log('Projects loaded:', projectsData)
      setProjects(projectsData)
    } catch (err: any) {
      console.error('Failed to load projects:', err)
      setError(err.message || 'Failed to load projects')
      // Fallback to mock data if API fails
      setProjects([
        {
          id: '1',
          name: 'Image Classification - Product Categories',
          description: 'Classify e-commerce product images into categories',
          status: 'active',
          total_tasks: 1000,
          completed_tasks: 234,
          project_type: 'classification',
          created_at: '2024-01-15',
          instructions: 'Please classify the images according to the given categories.',
          organization_id: 'org1',
          creator_id: 'user1'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    
    try {
      // Call the API to create the project
      const projectData = {
        name: newProjectForm.name,
        description: newProjectForm.description,
        project_type: newProjectForm.questionType,
        instructions: 'Project instructions will be added here.',
        status: 'draft'
      }
      
      console.log('Creating project with data:', projectData)
      const newProject = await apiClient.createProject(projectData)
      console.log('Project created successfully:', newProject)
      
      // Add the new project to the list
      setProjects(prev => [newProject, ...prev])
      setShowNewProjectModal(false)
      setNewProjectForm({
        name: '',
        description: '',
        questionType: 'text_classification'
      })
      setError(null) // Clear any previous errors
    } catch (err: any) {
      console.error('Failed to create project:', err)
      setError(err.message || 'Failed to create project')
      
      // If API fails, still add locally for demo purposes
      const localProject: Project = {
        id: Date.now().toString(),
        name: newProjectForm.name,
        description: newProjectForm.description,
        status: 'draft',
        total_tasks: 0,
        completed_tasks: 0,
        project_type: newProjectForm.questionType,
        created_at: new Date().toISOString(),
        instructions: 'Project instructions will be added here.',
        organization_id: 'org1',
        creator_id: 'user1'
      }
      
      setProjects(prev => [localProject, ...prev])
      setShowNewProjectModal(false)
      setNewProjectForm({
        name: '',
        description: '',
        questionType: 'text_classification'
      })
    } finally {
      setCreating(false)
    }
  }

  const handleStartAnnotation = (project: Project) => {
    setSelectedProject(project)
    setShowAnnotation(true)
  }

  const handleSubmitAnnotation = (responses: any) => {
    console.log('Submitted responses:', responses)
    // Here you would send the responses to your backend
    alert('Annotation submitted successfully!')
    setShowAnnotation(false)
    setSelectedProject(null)
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          variant: 'default' as const,
          icon: <Play className="w-3 h-3" />,
          className: 'bg-green-500/10 text-green-700 border-green-500/20'
        }
      case 'completed':
        return {
          variant: 'secondary' as const,
          icon: <CheckCircle2 className="w-3 h-3" />,
          className: 'bg-blue-500/10 text-blue-700 border-blue-500/20'
        }
      case 'paused':
        return {
          variant: 'outline' as const,
          icon: <Pause className="w-3 h-3" />,
          className: 'bg-orange-500/10 text-orange-700 border-orange-500/20'
        }
      default:
        return {
          variant: 'secondary' as const,
          icon: <AlertCircle className="w-3 h-3" />,
          className: 'bg-gray-500/10 text-gray-700 border-gray-500/20'
        }
    }
  }

  const getSampleQuestions = (project: Project) => {
    if (project.id === '1') {
      return [
        {
          id: 'q1',
          type: 'image_classification' as QuestionType,
          title: 'What type of product is shown in this image?',
          description: 'Select the most appropriate category for this product',
          data: { imageUrl: 'https://via.placeholder.com/400x300' },
          options: ['Electronics', 'Clothing', 'Home & Garden', 'Sports & Outdoors', 'Books', 'Other'],
          required: true
        },
        {
          id: 'q2',
          type: 'multiple_choice' as QuestionType,
          title: 'Select all visible product attributes',
          description: 'Choose all that apply',
          data: {},
          options: ['Brand visible', 'Price tag visible', 'Multiple colors', 'In packaging', 'Used/Second-hand'],
          required: false
        }
      ]
    }
    return []
  }

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (showAnnotation && selectedProject) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => {
                    setShowAnnotation(false)
                    setSelectedProject(null)
                  }}
                  variant="outline"
                  size="sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Projects
                </Button>
                <div>
                  <h1 className="text-xl font-semibold">{selectedProject.name}</h1>
                  <p className="text-sm text-muted-foreground">Task annotation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AnnotationInterface
          projectId={selectedProject.id}
          taskId="sample-task-1"
          questions={getSampleQuestions(selectedProject)}
          onSubmit={handleSubmitAnnotation}
        />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage your data labeling projects and track progress
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Dialog open={showNewProjectModal} onOpenChange={setShowNewProjectModal}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Set up a new data annotation project to get started.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName" className="text-foreground">Project Name</Label>
                  <Input
                    id="projectName"
                    value={newProjectForm.name}
                    onChange={(e) => setNewProjectForm(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    placeholder="Enter project name"
                    required
                    className="text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectDescription" className="text-foreground">Description</Label>
                  <Textarea
                    id="projectDescription"
                    value={newProjectForm.description}
                    onChange={(e) => setNewProjectForm(prev => ({
                      ...prev,
                      description: e.target.value
                    }))}
                    placeholder="Describe your project"
                    rows={3}
                    className="text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="questionType" className="text-foreground">Question Type</Label>
                  <Select
                    value={newProjectForm.questionType}
                    onValueChange={(value) => setNewProjectForm(prev => ({
                      ...prev,
                      questionType: value
                    }))}
                  >
                    <SelectTrigger className="text-foreground">
                      <SelectValue placeholder="Select question type" className="text-muted-foreground" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text_classification">Text Classification</SelectItem>
                      <SelectItem value="image_classification">Image Classification</SelectItem>
                      <SelectItem value="sentiment_analysis">Sentiment Analysis</SelectItem>
                      <SelectItem value="named_entity_recognition">Named Entity Recognition</SelectItem>
                      <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={creating} className="flex-1">
                    {creating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Project'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewProjectModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading projects...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">Failed to load projects</p>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full">
              <Card className="text-center py-16">
                <CardContent>
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <FolderPlus className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-xl mb-2">
                    {searchTerm ? 'No projects found' : 'No projects yet'}
                  </CardTitle>
                  <CardDescription className="mb-6">
                    {searchTerm 
                      ? `No projects match "${searchTerm}". Try adjusting your search.`
                      : 'Create your first project to get started with data labeling!'
                    }
                  </CardDescription>
                  {!searchTerm && (
                    <Button onClick={() => setShowNewProjectModal(true)} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Create Your First Project
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredProjects.map((project) => {
              const progressPercentage = project.total_tasks > 0 
                ? (project.completed_tasks / project.total_tasks) * 100 
                : 0
              const statusConfig = getStatusConfig(project.status)
              
              return (
                <Card key={project.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-full flex flex-col">
                  <CardHeader className="pb-3 flex-grow-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                          {project.name}
                        </CardTitle>
                      </div>
                      <Badge className={cn("shrink-0 flex items-center gap-1", statusConfig.className)}>
                        {statusConfig.icon}
                        <span className="capitalize">{project.status}</span>
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2 mt-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 flex-grow flex flex-col">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Progress</span>
                        <span className="font-semibold text-right">
                          {project.completed_tasks} / {project.total_tasks}
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                      <div className="text-xs text-muted-foreground text-right">
                        {Math.round(progressPercentage)}% complete
                      </div>
                    </div>

                    {/* Project Type */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium">Project type:</span>
                        <Badge variant="secondary" className="text-xs">
                          {project.project_type?.replace(/_/g, ' ') || 'classification'}
                        </Badge>
                      </div>
                    </div>

                    {/* Spacer to push actions to bottom */}
                    <div className="flex-grow"></div>

                    {/* Actions - anchored to bottom */}
                    <div className="flex items-center justify-between pt-2 mt-auto">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(project.created_at).toLocaleDateString()}</span>
                      </div>
                      {project.status === 'active' && (
                        <Button
                          onClick={() => handleStartAnnotation(project)}
                          size="sm"
                          className="gap-1"
                        >
                          <Play className="w-3 h-3" />
                          Start
                        </Button>
                      )}
                      {project.status === 'paused' && (
                        <Button
                          onClick={() => handleStartAnnotation(project)}
                          size="sm"
                          variant="outline"
                          className="gap-1"
                        >
                          <Play className="w-3 h-3" />
                          Resume
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      )}

      {/* Quick Stats */}
      {!loading && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{filteredProjects.length}</p>
                  <p className="text-xs text-muted-foreground">Total Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {filteredProjects.filter(p => p.status === 'active').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Active Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {filteredProjects.reduce((acc, p) => acc + p.completed_tasks, 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Completed Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(
                      filteredProjects.reduce((acc, p) => {
                        const progress = p.total_tasks > 0 ? (p.completed_tasks / p.total_tasks) * 100 : 0
                        return acc + progress
                      }, 0) / filteredProjects.length || 0
                    )}%
                  </p>
                  <p className="text-xs text-muted-foreground">Avg Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}