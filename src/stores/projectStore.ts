import { create } from 'zustand';
import { apiClient } from '../api/client';

export interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string;
  instructions: string;
  project_type: string;
  status: string;
  payment_per_response: number;
  max_responses_per_task: number;
  min_responses_per_task: number;
  consensus_threshold: number;
  total_tasks: number;
  completed_tasks: number;
  total_responses: number;
  created_at: string;
  updated_at?: string;
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  
  fetchProjects: () => Promise<void>;
  fetchProject: (projectId: string) => Promise<void>;
  createProject: (data: any) => Promise<Project>;
  updateProject: (projectId: string, data: any) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  launchProject: (projectId: string) => Promise<void>;
  pauseProject: (projectId: string) => Promise<void>;
  resumeProject: (projectId: string) => Promise<void>;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const projects = await apiClient.getProjects();
      set({ projects, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to fetch projects', 
        isLoading: false 
      });
    }
  },

  fetchProject: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const project = await apiClient.getProject(projectId);
      set({ currentProject: project, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to fetch project', 
        isLoading: false 
      });
    }
  },

  createProject: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const project = await apiClient.createProject(data);
      const { projects } = get();
      set({ 
        projects: [...projects, project],
        isLoading: false 
      });
      return project;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to create project', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateProject: async (projectId: string, data: any) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProject = await apiClient.updateProject(projectId, data);
      const { projects } = get();
      set({ 
        projects: projects.map(p => p.id === projectId ? updatedProject : p),
        currentProject: updatedProject,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to update project', 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteProject: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.deleteProject(projectId);
      const { projects } = get();
      set({ 
        projects: projects.filter(p => p.id !== projectId),
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to delete project', 
        isLoading: false 
      });
      throw error;
    }
  },

  launchProject: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.launchProject(projectId);
      const { projects } = get();
      set({ 
        projects: projects.map(p => p.id === projectId ? response.project : p),
        currentProject: response.project,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to launch project', 
        isLoading: false 
      });
      throw error;
    }
  },

  pauseProject: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.pauseProject(projectId);
      const { projects } = get();
      set({ 
        projects: projects.map(p => p.id === projectId ? response.project : p),
        currentProject: response.project,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to pause project', 
        isLoading: false 
      });
      throw error;
    }
  },

  resumeProject: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.resumeProject(projectId);
      const { projects } = get();
      set({ 
        projects: projects.map(p => p.id === projectId ? response.project : p),
        currentProject: response.project,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to resume project', 
        isLoading: false 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));