import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus } from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Badge } from '../components/ui/badge'
import { useProjectStore } from '../stores/projectStore'

export function ProjectCreatePage() {
  const navigate = useNavigate()
  const { createProject, isLoading } = useProjectStore()
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    instructions: '',
    project_type: 'annotation',
    payment_per_response: 0.10,
    consensus_threshold: 0.75,
    max_responses_per_task: 3,
    min_responses_per_task: 1,
    enable_gold_standard: true,
    gold_standard_percentage: 10,
    metadata: {}
  })

  const [metadataInput, setMetadataInput] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Parse metadata
      let metadata = {}
      if (metadataInput.trim()) {
        try {
          metadata = JSON.parse(metadataInput)
        } catch {
          toast.error('Invalid JSON in metadata field')
          return
        }
      }

      // Generate slug from name if not provided
      const slug = formData.slug || formData.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      const projectData = {
        ...formData,
        slug,
        metadata,
        payment_per_response: Number(formData.payment_per_response),
        consensus_threshold: Number(formData.consensus_threshold),
        max_responses_per_task: Number(formData.max_responses_per_task),
        min_responses_per_task: Number(formData.min_responses_per_task),
        gold_standard_percentage: Number(formData.gold_standard_percentage)
      }

      const project = await createProject(projectData)
      toast.success('Project created successfully!')
      navigate(`/projects/${project.id}`)
    } catch (error: any) {
      console.error('Failed to create project:', error)
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to create project'
      toast.error(errorMessage)
      
      // If the error is about needing an organization, suggest going to organization page
      if (errorMessage.includes('organization')) {
        setTimeout(() => {
          toast.info('Click here to create an organization', {
            action: {
              label: 'Go to Organization',
              onClick: () => navigate('/organization')
            }
          })
        }, 2000)
      }
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const projectTypes = [
    { value: 'annotation', label: 'Data Annotation' },
    { value: 'classification', label: 'Classification' },
    { value: 'comparison', label: 'Comparison' },
    { value: 'ranking', label: 'Ranking' },
    { value: 'custom', label: 'Custom' }
  ]

  return (
    <div className="fade-in" style={{ 
      padding: 0,
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div className="content-header" style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        marginBottom: 'var(--margin-lg)',
        paddingBottom: 'var(--padding-md)',
        borderBottom: '1px solid var(--border-primary)'
      }}>
        <button
          onClick={() => navigate('/projects')}
          className="btn btn-secondary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-2) var(--space-4)',
            background: 'var(--surface-bg)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--body-small)',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={20} />
          Back to Projects
        </button>
        <div>
          <h1 style={{
            fontSize: 'var(--h1-size)',
            fontWeight: 'var(--h1-weight)',
            color: 'var(--text-primary)',
            margin: 0,
            marginBottom: 'var(--space-2)'
          }}>
            Create New Project
          </h1>
          <p style={{
            fontSize: 'var(--body-large)',
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            Set up your data labeling project
          </p>
        </div>
      </div>

      <div className="card" style={{
        background: 'var(--secondary-bg)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--padding-xl)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          marginBottom: 'var(--margin-lg)',
          paddingBottom: 'var(--padding-md)',
          borderBottom: '1px solid var(--border-primary)'
        }}>
          <h2 style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            fontSize: 'var(--h3-size)',
            fontWeight: 'var(--h3-weight)',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            <div style={{
              padding: 'var(--space-2)',
              background: 'var(--accent-primary)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Plus size={20} style={{ color: 'var(--text-primary)' }} />
            </div>
            Project Details
          </h2>
        </div>

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-8)'
        }}>
          {/* Basic Information Section */}
          <div>
            <h3 style={{
              fontSize: 'var(--h4-size)',
              fontWeight: 'var(--h4-weight)',
              color: 'var(--text-primary)',
              margin: '0 0 var(--space-4) 0'
            }}>
              Basic Information
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--space-6)'
            }}>
              <div className="form-group">
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--space-2)',
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--body-small)',
                  fontWeight: '500'
                }}>
                  Project Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter project name"
                  required
                  style={{
                    width: '100%',
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--primary-bg)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--body-base)',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>

              <div className="form-group">
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--space-2)',
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--body-small)',
                  fontWeight: '500'
                }}>
                  Project Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="Auto-generated from name"
                  style={{
                    width: '100%',
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--primary-bg)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--body-base)',
                    transition: 'all 0.2s ease'
                  }}
                />
                <p style={{
                  fontSize: 'var(--body-xs)',
                  color: 'var(--text-muted)',
                  margin: 'var(--space-1) 0 0 0'
                }}>
                  Used in URLs. Leave empty to auto-generate.
                </p>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 'var(--space-6)' }}>
              <label style={{
                display: 'block',
                marginBottom: 'var(--space-2)',
                color: 'var(--text-secondary)',
                fontSize: 'var(--body-small)',
                fontWeight: '500'
              }}>
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your project"
                required
                rows={3}
                style={{
                  width: '100%',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'var(--primary-bg)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--body-base)',
                  transition: 'all 0.2s ease',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div className="form-group">
              <label style={{
                display: 'block',
                marginBottom: 'var(--space-2)',
                color: 'var(--text-secondary)',
                fontSize: 'var(--body-small)',
                fontWeight: '500'
              }}>
                Instructions *
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => handleInputChange('instructions', e.target.value)}
                placeholder="Detailed instructions for workers"
                required
                rows={4}
                style={{
                  width: '100%',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'var(--primary-bg)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--body-base)',
                  transition: 'all 0.2s ease',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>

          {/* Project Configuration Section */}
          <div>
            <h3 style={{
              fontSize: 'var(--h4-size)',
              fontWeight: 'var(--h4-weight)',
              color: 'var(--text-primary)',
              margin: '0 0 var(--space-4) 0'
            }}>
              Project Configuration
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--space-6)'
            }}>
              <div className="form-group">
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--space-2)',
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--body-small)',
                  fontWeight: '500'
                }}>
                  Project Type
                </label>
                <Select 
                  value={formData.project_type} 
                  onValueChange={(value) => handleInputChange('project_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="form-group">
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--space-2)',
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--body-small)',
                  fontWeight: '500'
                }}>
                  Payment per Response ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.payment_per_response}
                  onChange={(e) => handleInputChange('payment_per_response', e.target.value)}
                  placeholder="0.10"
                  style={{
                    width: '100%',
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--primary-bg)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--body-base)',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Quality Control Section */}
          <div>
            <h3 style={{
              fontSize: 'var(--h4-size)',
              fontWeight: 'var(--h4-weight)',
              color: 'var(--text-primary)',
              margin: '0 0 var(--space-4) 0'
            }}>
              Quality Control
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-6)',
              marginBottom: 'var(--space-6)'
            }}>
              <div className="form-group">
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--space-2)',
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--body-small)',
                  fontWeight: '500'
                }}>
                  Consensus Threshold
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={formData.consensus_threshold}
                  onChange={(e) => handleInputChange('consensus_threshold', e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--primary-bg)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--body-base)',
                    transition: 'all 0.2s ease'
                  }}
                />
                <p style={{
                  fontSize: 'var(--body-xs)',
                  color: 'var(--text-muted)',
                  margin: 'var(--space-1) 0 0 0'
                }}>
                  0.0 - 1.0
                </p>
              </div>

              <div className="form-group">
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--space-2)',
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--body-small)',
                  fontWeight: '500'
                }}>
                  Min Responses per Task
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.min_responses_per_task}
                  onChange={(e) => handleInputChange('min_responses_per_task', e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--primary-bg)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--body-base)',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>

              <div className="form-group">
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--space-2)',
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--body-small)',
                  fontWeight: '500'
                }}>
                  Max Responses per Task
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.max_responses_per_task}
                  onChange={(e) => handleInputChange('max_responses_per_task', e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--primary-bg)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--body-base)',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--space-6)',
              alignItems: 'start'
            }}>
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--body-small)',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.enable_gold_standard}
                    onChange={(e) => handleInputChange('enable_gold_standard', e.target.checked)}
                    style={{
                      accentColor: 'var(--accent-primary)'
                    }}
                  />
                  Enable Gold Standard
                </label>
                <p style={{
                  fontSize: 'var(--body-xs)',
                  color: 'var(--text-muted)',
                  margin: 'var(--space-1) 0 0 0'
                }}>
                  Use known correct answers to measure worker quality
                </p>
              </div>

              {formData.enable_gold_standard && (
                <div className="form-group">
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--body-small)',
                    fontWeight: '500'
                  }}>
                    Gold Standard Percentage
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.gold_standard_percentage}
                    onChange={(e) => handleInputChange('gold_standard_percentage', e.target.value)}
                    style={{
                      width: '100%',
                      padding: 'var(--space-3) var(--space-4)',
                      background: 'var(--primary-bg)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--body-base)',
                      transition: 'all 0.2s ease'
                    }}
                  />
                  <p style={{
                    fontSize: 'var(--body-xs)',
                    color: 'var(--text-muted)',
                    margin: 'var(--space-1) 0 0 0'
                  }}>
                    % of tasks that are gold standard
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Metadata Section */}
          <div>
            <h3 style={{
              fontSize: 'var(--h4-size)',
              fontWeight: 'var(--h4-weight)',
              color: 'var(--text-primary)',
              margin: '0 0 var(--space-4) 0'
            }}>
              Additional Settings
            </h3>
            
            <div className="form-group">
              <label style={{
                display: 'block',
                marginBottom: 'var(--space-2)',
                color: 'var(--text-secondary)',
                fontSize: 'var(--body-small)',
                fontWeight: '500'
              }}>
                Metadata (Optional)
              </label>
              <textarea
                value={metadataInput}
                onChange={(e) => setMetadataInput(e.target.value)}
                placeholder='{"key": "value", "category": "research"}'
                rows={3}
                style={{
                  width: '100%',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'var(--primary-bg)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--body-base)',
                  transition: 'all 0.2s ease',
                  resize: 'vertical',
                  fontFamily: 'monospace'
                }}
              />
              <p style={{
                fontSize: 'var(--body-xs)',
                color: 'var(--text-muted)',
                margin: 'var(--space-1) 0 0 0'
              }}>
                JSON object for additional project metadata
              </p>
            </div>
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--space-4)',
            paddingTop: 'var(--space-6)',
            borderTop: '1px solid var(--border-primary)'
          }}>
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="btn btn-secondary"
              style={{
                padding: 'var(--space-3) var(--space-6)',
                background: 'var(--surface-bg)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--button-size)',
                fontWeight: 'var(--button-weight)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{
                padding: 'var(--space-3) var(--space-6)',
                background: isLoading ? 'var(--surface-bg)' : 'var(--accent-primary)',
                color: 'var(--text-primary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--button-size)',
                fontWeight: 'var(--button-weight)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              {isLoading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 