import { useState, useEffect } from 'react'

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
  projectId: string
  projectName: string
  title: string
  type: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  deadline?: string
  estimatedTime: number // in minutes
  assignedTo?: string
  status: 'pending' | 'in_progress' | 'paused' | 'completed'
  tags: string[]
  reward: number
  completedCount: number
  totalCount: number
}

interface TaskFilter {
  priority?: string
  type?: string
  project?: string
  status?: string
}

export const TaskQueue = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      projectId: '1',
      projectName: 'Image Classification',
      title: 'Classify product images - Batch A23',
      type: 'image_classification',
      priority: 'urgent',
      deadline: '2024-01-26T18:00:00',
      estimatedTime: 45,
      assignedTo: 'current_user',
      status: 'in_progress',
      tags: ['quality_check', 'client_priority'],
      reward: 0.05,
      completedCount: 234,
      totalCount: 500
    },
    {
      id: '2',
      projectId: '2',
      projectName: 'Sentiment Analysis',
      title: 'Analyze customer reviews - Q1 2024',
      type: 'text_classification',
      priority: 'high',
      deadline: '2024-01-27T12:00:00',
      estimatedTime: 60,
      status: 'pending',
      tags: ['nlp', 'customer_feedback'],
      reward: 0.03,
      completedCount: 0,
      totalCount: 1000
    },
    {
      id: '3',
      projectId: '3',
      projectName: 'Medical NER',
      title: 'Extract medical entities from clinical notes',
      type: 'named_entity_recognition',
      priority: 'medium',
      estimatedTime: 90,
      status: 'pending',
      tags: ['medical', 'specialized'],
      reward: 0.08,
      completedCount: 0,
      totalCount: 200
    },
    {
      id: '4',
      projectId: '1',
      projectName: 'Image Classification',
      title: 'Quality review - Previous annotations',
      type: 'quality_review',
      priority: 'low',
      estimatedTime: 30,
      status: 'pending',
      tags: ['review', 'quality_assurance'],
      reward: 0.04,
      completedCount: 0,
      totalCount: 100
    }
  ])

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
      case 'urgent': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ListIcon />
            Task Queue
          </h1>
          <p className="text-gray-600">Manage and prioritize your annotation tasks</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Earnings Today</p>
            <p className="text-xl font-bold text-green-600">$12.45</p>
          </div>
        </div>
      </div>

      {/* Current Task */}
      {currentTask && (
        <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-purple-900">Current Task</h2>
              <p className="text-purple-700">{currentTask.title}</p>
              <p className="text-sm text-purple-600">{currentTask.projectName}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-purple-900">
                {formatTime(timeSpent)}
              </div>
              <p className="text-sm text-purple-600">
                Est. {currentTask.estimatedTime}min
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                Progress: <span className="font-medium">{currentTask.completedCount} / {currentTask.totalCount}</span>
              </div>
              <div className="w-48 bg-purple-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${(currentTask.completedCount / currentTask.totalCount) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isTimerRunning ? (
                <button
                  onClick={pauseTask}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 flex items-center gap-2"
                >
                  <PauseIcon />
                  Pause
                </button>
              ) : (
                <button
                  onClick={() => setIsTimerRunning(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
                >
                  <PlayIcon />
                  Resume
                </button>
              )}
              <button
                onClick={completeTask}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Complete Task
              </button>
              <button
                onClick={() => window.open(`/annotate/${currentTask.id}`, '_blank')}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Open Interface
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Sort */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <select
              value={filter.priority || ''}
              onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
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
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
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
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="priority">Priority</option>
              <option value="deadline">Deadline</option>
              <option value="reward">Reward</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {sortedTasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                    {task.priority === 'urgent' && <FireIcon />}
                    {task.priority}
                  </span>
                  {task.deadline && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <ClockIcon />
                      {formatDeadline(task.deadline)}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span>{task.projectName}</span>
                  <span>•</span>
                  <span>{task.type.replace(/_/g, ' ')}</span>
                  <span>•</span>
                  <span>~{task.estimatedTime} min</span>
                  <span>•</span>
                  <span className="text-green-600 font-medium">${task.reward}/item</span>
                </div>

                <div className="flex items-center gap-2">
                  {task.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded flex items-center gap-1">
                      <TagIcon />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <p className="text-sm font-medium">{task.completedCount} / {task.totalCount}</p>
                  <p className="text-xs text-gray-500">items</p>
                </div>
                
                {task.status === 'pending' && (
                  <button
                    onClick={() => startTask(task)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2"
                  >
                    <PlayIcon />
                    Start
                  </button>
                )}
                
                {task.status === 'in_progress' && task.id !== currentTask?.id && (
                  <button
                    onClick={() => setCurrentTask(task)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                  >
                    Resume
                  </button>
                )}
                
                {task.status === 'completed' && (
                  <span className="px-4 py-2 bg-green-100 text-green-800 rounded-md">
                    ✓ Completed
                  </span>
                )}
              </div>
            </div>

            {task.completedCount > 0 && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${(task.completedCount / task.totalCount) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedTasks.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <ListIcon />
          <p className="mt-4 text-gray-600">No tasks match your current filters</p>
          <button
            onClick={() => setFilter({})}
            className="mt-4 text-purple-600 hover:text-purple-800"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}