import { useState, useEffect } from 'react'
import { AnnotationInterface, QuestionType } from './AnnotationInterface'

// Icons
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
)

interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'draft'
  tasksTotal: number
  tasksCompleted: number
  questionTypes: QuestionType[]
  createdAt: string
}

export const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showAnnotation, setShowAnnotation] = useState(false)
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)

  useEffect(() => {
    // Mock projects data
    setProjects([
      {
        id: '1',
        name: 'Image Classification - Product Categories',
        description: 'Classify e-commerce product images into categories',
        status: 'active',
        tasksTotal: 1000,
        tasksCompleted: 234,
        questionTypes: ['image_classification'],
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        name: 'Customer Support Sentiment Analysis',
        description: 'Analyze sentiment in customer support tickets',
        status: 'active',
        tasksTotal: 500,
        tasksCompleted: 123,
        questionTypes: ['sentiment_analysis', 'text_classification'],
        createdAt: '2024-01-20'
      },
      {
        id: '3',
        name: 'Medical Entity Recognition',
        description: 'Identify medical entities in clinical notes',
        status: 'draft',
        tasksTotal: 2000,
        tasksCompleted: 0,
        questionTypes: ['named_entity_recognition'],
        createdAt: '2024-01-22'
      },
      {
        id: '4',
        name: 'Content Moderation',
        description: 'Review and classify user-generated content',
        status: 'completed',
        tasksTotal: 5000,
        tasksCompleted: 5000,
        questionTypes: ['text_classification', 'multiple_choice'],
        createdAt: '2023-12-01'
      }
    ])
  }, [])

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

  // Sample questions for demonstration
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
          options: ['Brand visible', 'Price tag visible', 'Multiple colors', 'In packaging', 'Used/Second-hand'],
          required: false
        }
      ]
    } else if (project.id === '2') {
      return [
        {
          id: 'q1',
          type: 'text_classification' as QuestionType,
          title: 'What is the overall sentiment of this message?',
          description: 'Analyze the customer\'s tone and emotion',
          data: { text: 'I\'ve been waiting for my order for 3 weeks now. This is unacceptable!' },
          options: ['Very Positive', 'Positive', 'Neutral', 'Negative', 'Very Negative'],
          required: true
        },
        {
          id: 'q2',
          type: 'multiple_choice' as QuestionType,
          title: 'What issues are mentioned?',
          description: 'Select all that apply',
          options: ['Delivery delay', 'Product quality', 'Customer service', 'Pricing', 'Technical issue'],
          required: true
        }
      ]
    }
    return []
  }

  if (showAnnotation && selectedProject) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div>
                <h1 className="text-lg font-semibold">{selectedProject.name}</h1>
                <p className="text-sm text-gray-500">Task annotation</p>
              </div>
              <button
                onClick={() => {
                  setShowAnnotation(false)
                  setSelectedProject(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕ Close
              </button>
            </div>
          </div>
        </div>
        <AnnotationInterface
          projectId={selectedProject.id}
          taskId="task-123"
          questions={getSampleQuestions(selectedProject)}
          onSubmit={handleSubmitAnnotation}
        />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage your data labeling projects</p>
        </div>
        <button
          onClick={() => setShowNewProjectModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <PlusIcon />
          New Project
        </button>
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                project.status === 'active' ? 'bg-green-100 text-green-800' :
                project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {project.status}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{project.description}</p>
            
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-500">Progress</span>
                <span className="text-gray-700">{project.tasksCompleted} / {project.tasksTotal}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${(project.tasksCompleted / project.tasksTotal) * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Question types:</p>
              <div className="flex flex-wrap gap-1">
                {project.questionTypes.map((type) => (
                  <span key={type} className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                    {type.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Created {project.createdAt}</span>
              {project.status === 'active' && (
                <button
                  onClick={() => handleStartAnnotation(project)}
                  className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                >
                  <PlayIcon />
                  Start
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              setShowNewProjectModal(false)
              alert('Project creation would be implemented here')
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  rows={3}
                  placeholder="Describe your project"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">
                  <option value="text_classification">Text Classification</option>
                  <option value="image_classification">Image Classification</option>
                  <option value="sentiment_analysis">Sentiment Analysis</option>
                  <option value="named_entity_recognition">Named Entity Recognition</option>
                  <option value="multiple_choice">Multiple Choice</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Create Project
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}