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
    <div style={{ padding: '2rem', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#111827',
            margin: '0 0 0.5rem 0'
          }}>
            Projects
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '1rem',
            margin: 0
          }}>
            Manage your data labeling projects and track progress
          </p>
        </div>
        <button
          onClick={() => setShowNewProjectModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#7c3aed',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#6d28d9'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#7c3aed'
          }}
        >
          <PlusIcon />
          New Project
        </button>
      </div>

      {/* Projects grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '1.5rem'
      }}>
        {projects.map((project) => {
          const progressPercentage = (project.tasksCompleted / project.tasksTotal) * 100
          const getStatusColor = (status: string) => {
            switch (status) {
              case 'active': return { bg: '#ecfdf5', text: '#059669' }
              case 'completed': return { bg: '#eff6ff', text: '#2563eb' }
              default: return { bg: '#f3f4f6', text: '#6b7280' }
            }
          }
          const statusColor = getStatusColor(project.status)

          return (
            <div key={project.id} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              transition: 'box-shadow 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0,
                  flex: 1,
                  marginRight: '1rem'
                }}>
                  {project.name}
                </h3>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  borderRadius: '9999px',
                  backgroundColor: statusColor.bg,
                  color: statusColor.text,
                  textTransform: 'capitalize'
                }}>
                  {project.status}
                </span>
              </div>

              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                margin: '0 0 1.5rem 0',
                lineHeight: '1.5'
              }}>
                {project.description}
              </p>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ color: '#6b7280' }}>Progress</span>
                  <span style={{ color: '#111827', fontWeight: '500' }}>
                    {project.tasksCompleted} / {project.tasksTotal}
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${progressPercentage}%`,
                    height: '100%',
                    backgroundColor: '#7c3aed',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  margin: '0 0 0.5rem 0',
                  fontWeight: '500'
                }}>
                  Question types:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {project.questionTypes.map((type) => (
                    <span key={type} style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      backgroundColor: '#f3e8ff',
                      color: '#7c3aed',
                      borderRadius: '4px',
                      fontWeight: '500'
                    }}>
                      {type.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>
                  Created {project.createdAt}
                </span>
                {project.status === 'active' && (
                  <button
                    onClick={() => handleStartAnnotation(project)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: '#7c3aed',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#6d28d9'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#7c3aed'
                    }}
                  >
                    <PlayIcon />
                    Start
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            width: '100%',
            maxWidth: '500px',
            margin: '1rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111827',
              margin: '0 0 1.5rem 0'
            }}>
              Create New Project
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              setShowNewProjectModal(false)
              alert('Project creation would be implemented here')
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Project Name
                </label>
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Description
                </label>
                <textarea
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  placeholder="Describe your project"
                />
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Question Type
                </label>
                <select style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  backgroundColor: 'white'
                }}>
                  <option value="text_classification">Text Classification</option>
                  <option value="image_classification">Image Classification</option>
                  <option value="sentiment_analysis">Sentiment Analysis</option>
                  <option value="named_entity_recognition">Named Entity Recognition</option>
                  <option value="multiple_choice">Multiple Choice</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: '#7c3aed',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Create Project
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
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