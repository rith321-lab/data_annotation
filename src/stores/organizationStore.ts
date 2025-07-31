import { create } from 'zustand'
import { apiClient } from '../api/client'

interface Organization {
  id: string
  name: string
  slug: string
  description?: string
  subscription_tier: string
  subscription_status: string
  max_projects: number
  max_tasks_per_month: number
  max_workers: number
  user_count: number
  project_count: number
  active_projects: number
  created_at: string
  updated_at?: string
}

interface OrganizationMember {
  id: string
  email: string
  full_name: string
  role: string
  joined_at: string
  is_active: boolean
}

interface Team {
  id: string
  name: string
  description?: string
  can_create_projects: boolean
  can_manage_workers: boolean
  is_active: boolean
  organization_id: string
}

interface OrganizationState {
  organization: Organization | null
  members: OrganizationMember[]
  teams: Team[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchOrganization: () => Promise<void>
  createOrganization: (data: any) => Promise<void>
  updateOrganization: (data: any) => Promise<void>
  fetchMembers: () => Promise<void>
  fetchTeams: () => Promise<void>
  inviteUser: (data: { email: string; team_id: string; role: string }) => Promise<void>
  removeUser: (userId: string) => Promise<void>
  createTeam: (data: any) => Promise<void>
  updateTeam: (teamId: string, data: any) => Promise<void>
  deleteTeam: (teamId: string) => Promise<void>
  clearError: () => void
}

export const useOrganizationStore = create<OrganizationState>((set, get) => ({
  organization: null,
  members: [],
  teams: [],
  isLoading: false,
  error: null,

  fetchOrganization: async () => {
    set({ isLoading: true, error: null })
    try {
      const organization = await apiClient.getCurrentOrganization()
      set({ organization, isLoading: false })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to fetch organization', 
        isLoading: false 
      })
    }
  },

  createOrganization: async (data: any) => {
    set({ isLoading: true, error: null })
    try {
      const organization = await apiClient.createOrganization(data)
      set({ organization, isLoading: false })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to create organization', 
        isLoading: false 
      })
      throw error
    }
  },

  updateOrganization: async (data: any) => {
    set({ isLoading: true, error: null })
    try {
      const organization = await apiClient.updateOrganization(data)
      set({ organization, isLoading: false })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to update organization', 
        isLoading: false 
      })
      throw error
    }
  },

  fetchMembers: async () => {
    set({ isLoading: true, error: null })
    try {
      const members = await apiClient.getOrganizationMembers()
      set({ members, isLoading: false })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to fetch members', 
        isLoading: false 
      })
    }
  },

  fetchTeams: async () => {
    set({ isLoading: true, error: null })
    try {
      const teams = await apiClient.getOrganizationTeams()
      set({ teams, isLoading: false })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to fetch teams', 
        isLoading: false 
      })
    }
  },

  inviteUser: async (data: { email: string; team_id: string; role: string }) => {
    set({ isLoading: true, error: null })
    try {
      await apiClient.inviteUserToOrganization(data)
      // Refresh members list
      await get().fetchMembers()
      set({ isLoading: false })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to invite user', 
        isLoading: false 
      })
      throw error
    }
  },

  removeUser: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      await apiClient.removeUserFromOrganization(userId)
      const { members } = get()
      set({ 
        members: members.filter(member => member.id !== userId),
        isLoading: false 
      })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to remove user', 
        isLoading: false 
      })
      throw error
    }
  },

  createTeam: async (data: any) => {
    set({ isLoading: true, error: null })
    try {
      await apiClient.createTeam(data)
      // Refresh teams list
      await get().fetchTeams()
      set({ isLoading: false })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to create team', 
        isLoading: false 
      })
      throw error
    }
  },

  updateTeam: async (teamId: string, data: any) => {
    set({ isLoading: true, error: null })
    try {
      await apiClient.updateTeam(teamId, data)
      // Refresh teams list
      await get().fetchTeams()
      set({ isLoading: false })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to update team', 
        isLoading: false 
      })
      throw error
    }
  },

  deleteTeam: async (teamId: string) => {
    set({ isLoading: true, error: null })
    try {
      await apiClient.deleteTeam(teamId)
      const { teams } = get()
      set({ 
        teams: teams.filter(team => team.id !== teamId),
        isLoading: false 
      })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to delete team', 
        isLoading: false 
      })
      throw error
    }
  },

  clearError: () => set({ error: null })
})) 