import { useState, useEffect } from 'react'
import { apiClient } from '../api/client'

// Icons
const ListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
)

const FireIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l1.5 5.5L18 9l-4.5 1.5L12 16l-1.5-5.5L6 9l4.5-1.5L12 2z"/>
    <path d="M8.5 14.5L7 20l3-5.5M15.5 14.5L17 20l-3-5.5"/>
  </svg>
)

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)

const TagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
)

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
)

const PauseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="6" y="4" width="4" height="16"/>
    <rect x="14" y="4" width="4" height="16"/>
  </svg>
)

interface Task {
  id: string
  project_id: string
  external_id?: string
  data: {
    image_url?: string
    question?: string
    options?: string[]
    [key: string]: any
  }
  task_metadata: {
    name?: string
    [key: string]: any
  }
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'paused' | 'completed' | 'cancelled'
  is_gold_standard: boolean
  required_responses: number
  completed_responses: number
  created_at: string
  updated_at?: string
}

interface TaskFilter {
  priority?: string
  type?: string
  project?: string
  status?: string
}

export const TaskQueue = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTasksAndProjects()
  }, [])

  const loadTasksAndProjects = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load projects first
      console.log('Loading projects and tasks...')
      const projectsData = await apiClient.getProjects()
      setProjects(projectsData)

      // Load tasks for all projects
      const allTasks: Task[] = []
      for (const project of projectsData) {
        try {
          const projectTasks = await apiClient.getProjectTasks(project.id)
          allTasks.push(...projectTasks)
        } catch (err) {
          console.warn(`Failed to load tasks for project ${project.id}:`, err)
        }
      }

      console.log('Loaded tasks:', allTasks)
      setTasks(allTasks)
    } catch (err: any) {
      console.error('Failed to load tasks:', err)
      setError(err.message || 'Failed to load tasks')
      // Fallback to mock data
      setTasks([
        {
          id: '1',
          project_id: '1',
          external_id: null,
          data: {
            image_url: 'https://example.com/cat.jpg',
            question: 'What animal is in this image?',
            options: ['Cat', 'Dog', 'Bird', 'Other']
          },
          task_metadata: {
            name: 'Classify Cat Image'
          },
          priority: 'medium',
          status: 'pending',
          is_gold_standard: false,
          required_responses: 3,
          completed_responses: 0,
          created_at: '2024-01-15T10:00:00Z'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const [filter, setFilter] = useState<TaskFilter>({})
  const [sortBy, setSortBy] = useState<'priority' | 'deadline' | 'reward'>('priority')
  const [currentTask, setCurrentTask] = useState<Task | null>(tasks[0])
  const [timeSpent, setTimeSpent] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  // Timer for current task
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isTimerRunning && currentTask) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isTimerRunning, currentTask])

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return { text: '#dc2626', bg: '#fef2f2', border: '#fecaca' }
      case 'high': return { text: '#ea580c', bg: '#fff7ed', border: '#fed7aa' }
      case 'medium': return { text: '#d97706', bg: '#fef3c7', border: '#fde68a' }
      case 'low': return { text: '#059669', bg: '#ecfdf5', border: '#bbf7d0' }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null
    const date = new Date(deadline)
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}d ${hours % 24}h`
    if (hours > 0) return `${hours}h`
    return 'Overdue'
  }

  const startTask = (task: Task) => {
    setCurrentTask(task)
    setTimeSpent(0)
    setIsTimerRunning(true)
    setTasks(tasks.map(t => 
      t.id === task.id ? { ...t, status: 'in_progress' } : t
    ))
  }

  const pauseTask = () => {
    setIsTimerRunning(false)
    if (currentTask) {
      setTasks(tasks.map(t => 
        t.id === currentTask.id ? { ...t, status: 'paused' } : t
      ))
    }
  }

  const completeTask = () => {
    if (currentTask) {
      setTasks(tasks.map(t => 
        t.id === currentTask.id ? { ...t, status: 'completed', completedCount: t.totalCount } : t
      ))
      setCurrentTask(null)
      setIsTimerRunning(false)
      setTimeSpent(0)
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filter.priority && task.priority !== filter.priority) return false
    if (filter.type && task.type !== filter.type) return false
    if (filter.project && task.projectId !== filter.project) return false
    if (filter.status && task.status !== filter.status) return false
    return true
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    if (sortBy === 'deadline') {
      if (!a.deadline) return 1
      if (!b.deadline) return -1
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    }
    if (sortBy === 'reward') {
      return b.reward - a.reward
    }
    return 0
  })

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
            margin: '0 0 0.5rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <ListIcon />
            Task Queue
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '1rem',
            margin: 0
          }}>
            Manage and prioritize your annotation tasks
          </p>
        </div>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'right'
        }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
            Total Earnings Today
          </p>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#059669', margin: 0 }}>
            $12.45
          </p>
        </div>
      </div>

      {/* Current Task */}
      {currentTask && (
        <div style={{
          backgroundColor: '#f3e8ff',
          border: '2px solid #a855f7',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.5rem'
          }}>
            <div>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#581c87',
                margin: '0 0 0.5rem 0'
              }}>
                Current Task
              </h2>
              <p style={{
                fontSize: '1rem',
                color: '#7c3aed',
                margin: '0 0 0.25rem 0',
                fontWeight: '500'
              }}>
                {currentTask.title}
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: '#8b5cf6',
                margin: 0
              }}>
                {currentTask.projectName}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '2rem',
                fontFamily: 'monospace',
                fontWeight: '700',
                color: '#581c87',
                margin: '0 0 0.25rem 0'
              }}>
                {formatTime(timeSpent)}
              </div>
              <p style={{
                fontSize: '0.875rem',
                color: '#8b5cf6',
                margin: 0
              }}>
                Est. {currentTask.estimatedTime}min
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '0.875rem', color: '#581c87' }}>
                Progress: <span style={{ fontWeight: '500' }}>
                  {currentTask.completedCount} / {currentTask.totalCount}
                </span>
              </div>
              <div style={{
                width: '200px',
                height: '8px',
                backgroundColor: '#c4b5fd',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(currentTask.completedCount / currentTask.totalCount) * 100}%`,
                  height: '100%',
                  backgroundColor: '#7c3aed',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {isTimerRunning ? (
                <button
                  onClick={pauseTask}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <PauseIcon />
                  Pause
                </button>
              ) : (
                <button
                  onClick={() => setIsTimerRunning(true)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <PlayIcon />
                  Resume
                </button>
              )}
              <button
                onClick={completeTask}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Complete Task
              </button>
              <button
                onClick={() => window.open(`/annotate/${currentTask.id}`, '_blank')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Open Interface
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Sort */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <select
              value={filter.priority || ''}
              onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem',
                backgroundColor: 'white'
              }}
            >
              <option value="">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filter.type || ''}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem',
                backgroundColor: 'white'
              }}
            >
              <option value="">All Types</option>
              <option value="image_classification">Image Classification</option>
              <option value="text_classification">Text Classification</option>
              <option value="named_entity_recognition">NER</option>
              <option value="quality_review">Quality Review</option>
            </select>

            <select
              value={filter.status || ''}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem',
                backgroundColor: 'white'
              }}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem',
                backgroundColor: 'white'
              }}
            >
              <option value="priority">Priority</option>
              <option value="deadline">Deadline</option>
              <option value="reward">Reward</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '3rem',
          color: '#6b7280'
        }}>
          Loading tasks...
        </div>
      )}

      {/* Error state */}
      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#dc2626',
          marginBottom: '1rem'
        }}>
          Error: {error}
        </div>
      )}

      {/* Task List */}
      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sortedTasks.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#6b7280'
            }}>
              No tasks found. Tasks will appear here when projects have annotation work available.
            </div>
          ) : (
            sortedTasks.map((task) => {
          const priorityColor = getPriorityColor(task.priority)

          return (
            <div key={task.id} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              padding: '1.5rem',
              transition: 'box-shadow 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.75rem'
                  }}>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: '500',
                      color: '#111827',
                      margin: 0
                    }}>
                      {task.task_metadata?.name || `Task ${task.id.slice(0, 8)}`}
                    </h3>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      borderRadius: '9999px',
                      backgroundColor: priorityColor.bg,
                      color: priorityColor.text,
                      border: `1px solid ${priorityColor.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      textTransform: 'capitalize'
                    }}>
                      {task.priority === 'urgent' && <FireIcon />}
                      {task.priority}
                    </span>
                    {task.deadline && (
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <ClockIcon />
                        {formatDeadline(task.deadline)}
                      </span>
                    )}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginBottom: '1rem'
                  }}>
                    <span>Project: {task.project_id.slice(0, 8)}...</span>
                    <span>•</span>
                    <span>{task.data.question ? 'Question' : 'Data Task'}</span>
                    <span>•</span>
                    <span>Responses: {task.completed_responses}/{task.required_responses}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <TagIcon />
                      {task.is_gold_standard ? 'Gold Standard' : 'Regular Task'}
                    </span>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      borderRadius: '4px'
                    }}>
                      Priority: {task.priority}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#111827',
                      margin: '0 0 0.25rem 0'
                    }}>
                      {task.completed_responses} / {task.required_responses}
                    </p>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      margin: 0
                    }}>
                      responses
                    </p>
                  </div>

                  {task.status === 'pending' && (
                    <button
                      onClick={() => startTask(task)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#7c3aed',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <PlayIcon />
                      Start
                    </button>
                  )}

                  {task.status === 'in_progress' && task.id !== currentTask?.id && (
                    <button
                      onClick={() => setCurrentTask(task)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Continue
                    </button>
                  )}

                  {task.status === 'paused' && (
                    <button
                      onClick={() => {
                        setCurrentTask(task)
                        setIsTimerRunning(true)
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#d97706',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Resume
                    </button>
                  )}

                  {task.status === 'completed' && (
                    <span style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#ecfdf5',
                      color: '#059669',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>
                      ✓ Completed
                    </span>
                  )}
                </div>
              </div>

              {task.completedCount > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(task.completedCount / task.totalCount) * 100}%`,
                      height: '100%',
                      backgroundColor: '#7c3aed',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              )}
            </div>
          )
        }))}
        </div>
      )}


    </div>
  )
}