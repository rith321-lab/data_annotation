import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Upload, FileText, MoreHorizontal, ArrowLeft, Filter, Search, Download } from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu'
import { useTaskStore } from '../stores/taskStore'
import { useProjectStore } from '../stores/projectStore'

export function TasksPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  
  const { 
    tasks, 
    taskStats, 
    isLoading, 
    error,
    fetchProjectTasks,
    fetchTaskStats,
    createTask,
    createTasksBulk,
    uploadTasksCSV,
    deleteTask,
    clearError
  } = useTaskStore()
  
  const { currentProject, fetchProject } = useProjectStore()
  
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showBulkDialog, setShowBulkDialog] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Single task creation
  const [taskData, setTaskData] = useState({
    external_id: '',
    data: '{}',
    metadata: '{}',
    priority: 'medium'
  })
  
  // Bulk task creation
  const [bulkTasks, setBulkTasks] = useState('')
  
  // CSV upload
  const [csvFile, setCsvFile] = useState<File | null>(null)

  useEffect(() => {
    if (projectId) {
      fetchProjectTasks(projectId)
      fetchTaskStats(projectId)
      fetchProject(projectId)
    }
  }, [projectId, fetchProjectTasks, fetchTaskStats, fetchProject])

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectId) return

    try {
      let data = {}
      let metadata = {}
      
      try {
        data = JSON.parse(taskData.data)
      } catch {
        toast.error('Invalid JSON in data field')
        return
      }
      
      try {
        metadata = JSON.parse(taskData.metadata)
      } catch {
        toast.error('Invalid JSON in metadata field')
        return
      }

      await createTask(projectId, {
        external_id: taskData.external_id || undefined,
        data,
        metadata,
        priority: taskData.priority
      })
      
      toast.success('Task created successfully!')
      setShowCreateDialog(false)
      setTaskData({
        external_id: '',
        data: '{}',
        metadata: '{}',
        priority: 'medium'
      })
      
      // Refresh stats
      fetchTaskStats(projectId)
    } catch (error) {
      toast.error('Failed to create task')
    }
  }

  const handleBulkCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectId) return

    try {
      const tasks = JSON.parse(bulkTasks)
      if (!Array.isArray(tasks)) {
        toast.error('Bulk tasks must be an array')
        return
      }

      await createTasksBulk(projectId, tasks)
      toast.success(`${tasks.length} tasks created successfully!`)
      setShowBulkDialog(false)
      setBulkTasks('')
      
      // Refresh stats
      fetchTaskStats(projectId)
    } catch (error) {
      toast.error('Failed to create bulk tasks')
    }
  }

  const handleCsvUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectId || !csvFile) return

    try {
      const result = await uploadTasksCSV(projectId, csvFile)
      toast.success(`${result.task_count} tasks uploaded successfully!`)
      setShowUploadDialog(false)
      setCsvFile(null)
      
      // Refresh stats
      fetchTaskStats(projectId)
    } catch (error) {
      toast.error('Failed to upload CSV')
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    
    try {
      await deleteTask(taskId)
      toast.success('Task deleted successfully!')
      
      // Refresh stats if we have projectId
      if (projectId) {
        fetchTaskStats(projectId)
      }
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'var(--text-muted)'
      case 'assigned': return 'var(--info)'
      case 'in_progress': return 'var(--warning)'
      case 'completed': return 'var(--success)'
      case 'rejected': return 'var(--error)'
      default: return 'var(--text-muted)'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'pending': return 'rgba(136, 136, 136, 0.1)'
      case 'assigned': return 'rgba(23, 162, 184, 0.1)'
      case 'in_progress': return 'rgba(255, 193, 7, 0.1)'
      case 'completed': return 'rgba(40, 167, 69, 0.1)'
      case 'rejected': return 'rgba(220, 53, 69, 0.1)'
      default: return 'rgba(136, 136, 136, 0.1)'
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchQuery || 
      task.external_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(task.data).toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (isLoading && tasks.length === 0) {
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
          Loading tasks...
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
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
            <ArrowLeft size={16} />
            Back to Projects
          </button>
          
          <div>
            <h1 style={{
              fontSize: 'var(--h1-size)',
              fontWeight: 'var(--h1-weight)',
              color: 'var(--text-primary)',
              margin: 0,
              marginBottom: 'var(--space-1)'
            }}>
              Tasks
            </h1>
            <p style={{
              fontSize: 'var(--body-large)',
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              {currentProject?.name || `Project ${projectId}`}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger 
              className="btn btn-secondary" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-4)',
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
              <Upload size={16} />
              Upload CSV
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle style={{ color: 'var(--text-primary)' }}>Upload Tasks via CSV</DialogTitle>
                <DialogDescription>
                  Upload a CSV file to create multiple tasks at once. The CSV should have columns for task data.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCsvUpload} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)'
              }}>
                <div className="form-group">
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--body-small)',
                    fontWeight: '500'
                  }}>
                    CSV File *
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
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
                  <p style={{
                    fontSize: 'var(--body-xs)',
                    color: 'var(--text-muted)',
                    margin: 'var(--space-1) 0 0 0'
                  }}>
                    CSV should have columns for task data. First row will be used as headers.
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 'var(--space-3)',
                  paddingTop: 'var(--space-4)',
                  borderTop: '1px solid var(--border-primary)'
                }}>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowUploadDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isLoading || !csvFile}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isLoading ? 'Uploading...' : 'Upload CSV'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
            <DialogTrigger 
              className="btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-4)',
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
              <FileText size={16} />
              Bulk Create
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle style={{ color: 'var(--text-primary)' }}>Bulk Create Tasks</DialogTitle>
                <DialogDescription>
                  Create multiple tasks by providing a JSON array of task objects.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleBulkCreate} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)'
              }}>
                <div className="form-group">
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--body-small)',
                    fontWeight: '500'
                  }}>
                    Tasks JSON Array *
                  </label>
                  <textarea
                    value={bulkTasks}
                    onChange={(e) => setBulkTasks(e.target.value)}
                    placeholder={`[
  {
    "external_id": "task-001",
    "data": {"text": "First task to annotate"},
    "metadata": {"batch": "1"},
    "priority": "medium"
  },
  {
    "external_id": "task-002", 
    "data": {"text": "Second task to annotate"},
    "metadata": {"batch": "1"},
    "priority": "high"
  }
]`}
                    required
                    rows={12}
                    style={{
                      width: '100%',
                      padding: 'var(--space-3) var(--space-4)',
                      background: 'var(--primary-bg)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--body-small)',
                      transition: 'all 0.2s ease',
                      resize: 'vertical',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 'var(--space-3)',
                  paddingTop: 'var(--space-4)',
                  borderTop: '1px solid var(--border-primary)'
                }}>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowBulkDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isLoading ? 'Creating...' : 'Create Tasks'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger 
              className="btn btn-primary interactive"
              style={{
                display: 'flex',
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
              <Plus size={16} />
              Create Task
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle style={{ color: 'var(--text-primary)' }}>Create New Task</DialogTitle>
                <DialogDescription>
                  Create a single task with custom data, metadata, and priority settings.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTask} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)'
              }}>
                <div className="form-group">
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--body-small)',
                    fontWeight: '500'
                  }}>
                    External ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={taskData.external_id}
                    onChange={(e) => setTaskData(prev => ({ ...prev, external_id: e.target.value }))}
                    placeholder="task-001"
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
                    Task Data (JSON) *
                  </label>
                  <textarea
                    value={taskData.data}
                    onChange={(e) => setTaskData(prev => ({ ...prev, data: e.target.value }))}
                    placeholder='{"text": "Sample text to annotate", "type": "classification"}'
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
                      fontFamily: 'monospace'
                    }}
                  />
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr',
                  gap: 'var(--space-4)'
                }}>
                  <div className="form-group">
                    <label style={{
                      display: 'block',
                      marginBottom: 'var(--space-2)',
                      color: 'var(--text-secondary)',
                      fontSize: 'var(--body-small)',
                      fontWeight: '500'
                    }}>
                      Metadata (JSON)
                    </label>
                    <textarea
                      value={taskData.metadata}
                      onChange={(e) => setTaskData(prev => ({ ...prev, metadata: e.target.value }))}
                      placeholder='{"source": "batch_1", "difficulty": "medium"}'
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
                  </div>

                  <div className="form-group">
                    <label style={{
                      display: 'block',
                      marginBottom: 'var(--space-2)',
                      color: 'var(--text-secondary)',
                      fontSize: 'var(--body-small)',
                      fontWeight: '500'
                    }}>
                      Priority
                    </label>
                    <select
                      value={taskData.priority}
                      onChange={(e) => setTaskData(prev => ({ ...prev, priority: e.target.value }))}
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
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 'var(--space-3)',
                  paddingTop: 'var(--space-4)',
                  borderTop: '1px solid var(--border-primary)'
                }}>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isLoading ? 'Creating...' : 'Create Task'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Task Statistics */}
      {taskStats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--margin-lg)'
        }}>
          <div className="card" style={{
            background: 'var(--secondary-bg)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--padding-md)',
            position: 'relative' as const
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              background: 'var(--accent-primary)',
              borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)'
            }}></div>
            <div style={{
              fontSize: 'var(--body-xs)',
              color: 'var(--text-muted)',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 'var(--space-2)'
            }}>
              Total Tasks
            </div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--text-primary)'
            }}>
              {taskStats.total_tasks || 0}
            </div>
          </div>

          <div className="card" style={{
            background: 'var(--secondary-bg)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--padding-md)',
            position: 'relative' as const
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              background: 'var(--success)',
              borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)'
            }}></div>
            <div style={{
              fontSize: 'var(--body-xs)',
              color: 'var(--text-muted)',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 'var(--space-2)'
            }}>
              Completed
            </div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--text-primary)'
            }}>
              {taskStats.completed_tasks || 0}
            </div>
          </div>

          <div className="card" style={{
            background: 'var(--secondary-bg)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--padding-md)',
            position: 'relative' as const
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              background: 'var(--warning)',
              borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)'
            }}></div>
            <div style={{
              fontSize: 'var(--body-xs)',
              color: 'var(--text-muted)',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 'var(--space-2)'
            }}>
              In Progress
            </div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--text-primary)'
            }}>
              {taskStats.in_progress_tasks || 0}
            </div>
          </div>

          <div className="card" style={{
            background: 'var(--secondary-bg)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--padding-md)',
            position: 'relative' as const
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              background: 'var(--info)',
              borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)'
            }}></div>
            <div style={{
              fontSize: 'var(--body-xs)',
              color: 'var(--text-muted)',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 'var(--space-2)'
            }}>
              Completion Rate
            </div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--text-primary)'
            }}>
              {(taskStats.completion_rate || 0).toFixed(1)}%
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-4)',
        marginBottom: 'var(--margin-md)',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
          <Search size={16} style={{
            position: 'absolute',
            left: 'var(--space-3)',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--space-3) var(--space-3) var(--space-3) 40px',
              background: 'var(--primary-bg)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontSize: 'var(--body-base)',
              transition: 'all 0.2s ease'
            }}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger style={{ width: '150px' }}>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tasks Table */}
      <div className="card" style={{
        background: 'var(--secondary-bg)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden'
      }}>
        {filteredTasks.length === 0 ? (
          <div style={{
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
              <FileText size={32} style={{ color: 'var(--text-muted)' }} />
            </div>
            <h3 style={{
              fontSize: 'var(--h4-size)',
              fontWeight: 'var(--h4-weight)',
              color: 'var(--text-primary)',
              margin: '0 0 var(--space-2) 0'
            }}>
              No tasks yet
            </h3>
            <p style={{
              fontSize: 'var(--body-base)',
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              Create your first task to get started
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>
                  External ID
                </TableHead>
                <TableHead style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>
                  Status
                </TableHead>
                <TableHead style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>
                  Priority
                </TableHead>
                <TableHead style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>
                  Data Preview
                </TableHead>
                <TableHead style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>
                  Created
                </TableHead>
                <TableHead style={{ color: 'var(--text-secondary)', fontWeight: '600', width: '50px' }}>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id} style={{
                  borderBottom: '1px solid var(--border-primary)'
                }}>
                  <TableCell style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                    {task.external_id || task.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    <span style={{
                      display: 'inline-block',
                      padding: 'var(--space-1) var(--space-3)',
                      background: getStatusBg(task.status),
                      color: getStatusColor(task.status),
                      fontSize: 'var(--body-xs)',
                      fontWeight: '600',
                      borderRadius: 'var(--radius-pill)',
                      textTransform: 'capitalize' as const
                    }}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                    {task.priority}
                  </TableCell>
                  <TableCell style={{ 
                    color: 'var(--text-secondary)',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {JSON.stringify(task.data).slice(0, 50)}...
                  </TableCell>
                  <TableCell style={{ color: 'var(--text-muted)', fontSize: 'var(--body-small)' }}>
                    {new Date(task.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
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
                        <DropdownMenuItem onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(task.data, null, 2))
                          toast.success('Task data copied to clipboard')
                        }}>
                          Copy Data
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          Delete Task
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>




    </div>
  )
}