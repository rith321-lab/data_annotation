import { useState, useEffect } from 'react'
import { apiClient } from '../api/client'

// Hook for fetching data with loading and error states
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await apiCall()
        if (isMounted) {
          setData(result)
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.detail || err.message || 'An error occurred')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, dependencies)

  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiCall()
      setData(result)
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch }
}

// Hook for projects
export function useProjects() {
  return useApi(() => apiClient.getProjects())
}

// Hook for current user
export function useCurrentUser() {
  return useApi(() => apiClient.getCurrentUser())
}

// Hook for project stats
export function useProjectStats(projectId: string) {
  return useApi(() => apiClient.getTaskStats(projectId), [projectId])
}

// Authentication hook
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token')
      if (token) {
        try {
          const userData = await apiClient.getCurrentUser()
          setUser(userData)
          setIsAuthenticated(true)
        } catch (error) {
          // Token might be expired
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          setIsAuthenticated(false)
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      await apiClient.login(email, password)
      const userData = await apiClient.getCurrentUser()
      setUser(userData)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      }
    }
  }

  const logout = () => {
    apiClient.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  return {
    isAuthenticated,
    loading,
    user,
    login,
    logout
  }
}

// Mock data fallback for development
export function useMockData<T>(mockData: T, apiCall?: () => Promise<T>) {
  const [data, setData] = useState<T>(mockData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = async () => {
    if (apiCall) {
      try {
        setLoading(true)
        setError(null)
        const result = await apiCall()
        setData(result)
      } catch (err: any) {
        setError(err.response?.data?.detail || err.message || 'An error occurred')
        // Fall back to mock data on error
        setData(mockData)
      } finally {
        setLoading(false)
      }
    }
  }

  return { data, loading, error, refetch }
}
