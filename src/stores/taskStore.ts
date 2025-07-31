import { create } from 'zustand'
import { apiClient } from '../api/client'

interface Task {
  id: string
  project_id: string
  external_id?: string
  data: Record<string, any>
  metadata?: Record<string, any>
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'rejected'
  priority: number
  batch_id?: string
  assigned_to?: string
  created_at: string
  updated_at?: string
  completed_at?: string
}

interface TaskStats {
  total_tasks: number
  pending_tasks: number
  assigned_tasks: number
  in_progress_tasks: number
  completed_tasks: number
  rejected_tasks: number
  completion_rate: number
  average_completion_time?: number
}

interface TaskState {
  tasks: Task[]
  currentTask: Task | null
  taskStats: TaskStats | null
  isLoading: boolean
  error: string | null

  // Actions
  fetchProjectTasks: (projectId: string) => Promise<void>
  fetchTaskStats: (projectId: string) => Promise<void>
  fetchTask: (taskId: string) => Promise<void>
  createTask: (projectId: string, data: any) => Promise<Task>
  createTasksBulk: (projectId: string, tasks: any[]) => Promise<Task[]>
  uploadTasksCSV: (projectId: string, file: File) => Promise<any>
  updateTask: (taskId: string, data: any) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
  clearError: () => void
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  currentTask: null,
  taskStats: null,
  isLoading: false,
  error: null,

  fetchProjectTasks: async (projectId: string) => {
    set({ isLoading: true, error: null })
    try {
      const tasks = await apiClient.getTasks(projectId, {})
      set({ tasks, isLoading: false })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to fetch tasks', 
        isLoading: false 
      })
    }
  },

  fetchTaskStats: async (projectId: string) => {
    try {
      const taskStats = await apiClient.getTaskStats(projectId)
      set({ taskStats })
    } catch (error: any) {
      console.error('Failed to fetch task stats:', error)
    }
  },

  fetchTask: async (taskId: string) => {
    set({ isLoading: true, error: null })
    try {
      const task = await apiClient.getTask(taskId)
      set({ currentTask: task, isLoading: false })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to fetch task', 
        isLoading: false 
      })
    }
  },

  createTask: async (projectId: string, data: any) => {
    set({ isLoading: true, error: null })
    try {
      const task = await apiClient.createTask(projectId, data)
      const { tasks } = get()
      set({ 
        tasks: [...tasks, task],
        isLoading: false 
      })
      return task
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to create task', 
        isLoading: false 
      })
      throw error
    }
  },

  createTasksBulk: async (projectId: string, tasks: any[]) => {
    set({ isLoading: true, error: null })
    try {
      const newTasks = await apiClient.createTasksBulk(projectId, tasks)
      const { tasks: existingTasks } = get()
      set({ 
        tasks: [...existingTasks, ...newTasks],
        isLoading: false 
      })
      return newTasks
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to create tasks', 
        isLoading: false 
      })
      throw error
    }
  },

  uploadTasksCSV: async (projectId: string, file: File) => {
    set({ isLoading: true, error: null })
    try {
      const result = await apiClient.uploadTasksCsv(projectId, file)
      // Refresh tasks after upload
      await get().fetchProjectTasks(projectId)
      set({ isLoading: false })
      return result
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to upload CSV', 
        isLoading: false 
      })
      throw error
    }
  },

  updateTask: async (taskId: string, data: any) => {
    set({ isLoading: true, error: null })
    try {
      const updatedTask = await apiClient.updateTask(taskId, data)
      const { tasks } = get()
      set({ 
        tasks: tasks.map(t => t.id === taskId ? updatedTask : t),
        currentTask: updatedTask,
        isLoading: false 
      })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to update task', 
        isLoading: false 
      })
      throw error
    }
  },

  deleteTask: async (taskId: string) => {
    set({ isLoading: true, error: null })
    try {
      await apiClient.deleteTask(taskId)
      const { tasks } = get()
      set({ 
        tasks: tasks.filter(t => t.id !== taskId),
        isLoading: false 
      })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to delete task', 
        isLoading: false 
      })
      throw error
    }
  },

  clearError: () => set({ error: null })
})) 