import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load token from localStorage
    this.token = localStorage.getItem('access_token');

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Don't try to refresh tokens for login/register endpoints
        const isAuthEndpoint = error.config?.url?.includes('/auth/login') || 
                              error.config?.url?.includes('/auth/register');
        
        if (error.response?.status === 401 && !isAuthEndpoint) {
          // Only try to refresh token if this is not a login/register request
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken && !error.config._retry) {
            error.config._retry = true; // Prevent infinite retry loops
            try {
              const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
                refresh_token: refreshToken,
              });
              this.setTokens(response.data.access_token, response.data.refresh_token);
              // Retry original request
              error.config.headers.Authorization = `Bearer ${this.token}`;
              return this.client.request(error.config);
            } catch (refreshError) {
              this.clearTokens();
              // Only redirect if we're not already on login page
              if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
              }
            }
          } else if (!refreshToken) {
            // No refresh token available, go to login
            this.clearTokens();
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.token = accessToken;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  clearTokens() {
    this.token = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const formData = new FormData();
    formData.append('username', email); // OAuth2 uses username field
    formData.append('password', password);
    
    const response = await this.client.post('/api/v1/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    this.setTokens(response.data.access_token, response.data.refresh_token);
    return response.data;
  }

  async register(data: {
    email: string;
    username: string;
    password: string;
    full_name?: string;
  }) {
    const response = await this.client.post('/api/v1/auth/register', data);
    return response.data;
  }

  async logout() {
    this.clearTokens();
  }

  // User endpoints
  async getCurrentUser() {
    const response = await this.client.get('/api/v1/users/me');
    return response.data;
  }

  async updateCurrentUser(data: any) {
    const response = await this.client.put('/api/v1/users/me', data);
    return response.data;
  }

  // Project endpoints
  async getProjects(params?: { skip?: number; limit?: number; status?: string }) {
    const response = await this.client.get('/api/v1/projects', { params });
    return response.data;
  }

  async getProject(projectId: string) {
    const response = await this.client.get(`/api/v1/projects/${projectId}`);
    return response.data;
  }

  async createProject(data: any) {
    const response = await this.client.post('/api/v1/projects', data);
    return response.data;
  }

  async updateProject(projectId: string, data: any) {
    const response = await this.client.put(`/api/v1/projects/${projectId}`, data);
    return response.data;
  }

  async deleteProject(projectId: string) {
    const response = await this.client.delete(`/api/v1/projects/${projectId}`);
    return response.data;
  }

  async launchProject(projectId: string) {
    const response = await this.client.post(`/api/v1/projects/${projectId}/launch`);
    return response.data;
  }

  async pauseProject(projectId: string) {
    const response = await this.client.post(`/api/v1/projects/${projectId}/pause`);
    return response.data;
  }

  async resumeProject(projectId: string) {
    const response = await this.client.post(`/api/v1/projects/${projectId}/resume`);
    return response.data;
  }

  // Task endpoints
  async getTasks(projectId: string, params?: { 
    skip?: number; 
    limit?: number; 
    status?: string;
    batch_id?: string;
  }) {
    const response = await this.client.get(`/api/v1/projects/${projectId}/tasks`, { params });
    return response.data;
  }

  async getTask(taskId: string) {
    const response = await this.client.get(`/api/v1/tasks/${taskId}`);
    return response.data;
  }

  async createTask(projectId: string, data: any) {
    const response = await this.client.post(`/api/v1/projects/${projectId}/tasks`, data);
    return response.data;
  }

  async createTasksBulk(projectId: string, tasks: any[]) {
    const response = await this.client.post(`/api/v1/projects/${projectId}/tasks/bulk`, {
      tasks,
    });
    return response.data;
  }

  async uploadTasksCsv(projectId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await this.client.post(
      `/api/v1/projects/${projectId}/tasks/csv`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async getTaskStats(projectId: string) {
    const response = await this.client.get(`/api/v1/projects/${projectId}/tasks/stats`);
    return response.data;
  }

  async updateTask(taskId: string, data: any) {
    const response = await this.client.put(`/api/v1/tasks/${taskId}`, data);
    return response.data;
  }

  async deleteTask(taskId: string) {
    const response = await this.client.delete(`/api/v1/tasks/${taskId}`);
    return response.data;
  }

  // Question endpoints
  async addQuestion(projectId: string, data: any) {
    const response = await this.client.post(`/api/v1/projects/${projectId}/questions`, data);
    return response.data;
  }

  // Organization endpoints
  async createOrganization(data: any) {
    const response = await this.client.post('/api/v1/organizations', data);
    return response.data;
  }

  async getCurrentOrganization() {
    const response = await this.client.get('/api/v1/organizations/me');
    return response.data;
  }

  async updateOrganization(data: any) {
    const response = await this.client.put('/api/v1/organizations/me', data);
    return response.data;
  }

  async getOrganizationMembers() {
    const response = await this.client.get('/api/v1/organizations/members');
    return response.data;
  }

  async inviteUserToOrganization(data: { email: string; team_id: string; role: string }) {
    const response = await this.client.post('/api/v1/organizations/invite', data);
    return response.data;
  }

  async removeUserFromOrganization(userId: string) {
    const response = await this.client.delete(`/api/v1/organizations/members/${userId}`);
    return response.data;
  }

  async getOrganization(organizationId: string) {
    const response = await this.client.get(`/api/v1/organizations/${organizationId}`);
    return response.data;
  }

  // Team endpoints
  async getOrganizationTeams() {
    const response = await this.client.get('/api/v1/teams/');
    return response.data;
  }

  async createTeam(data: any) {
    const response = await this.client.post('/api/v1/teams/', data);
    return response.data;
  }

  async getTeam(teamId: string) {
    const response = await this.client.get(`/api/v1/teams/${teamId}`);
    return response.data;
  }

  async updateTeam(teamId: string, data: any) {
    const response = await this.client.put(`/api/v1/teams/${teamId}`, data);
    return response.data;
  }

  async deleteTeam(teamId: string) {
    const response = await this.client.delete(`/api/v1/teams/${teamId}`);
    return response.data;
  }

  async getTeamMembers(teamId: string) {
    const response = await this.client.get(`/api/v1/teams/${teamId}/members`);
    return response.data;
  }

  async addTeamMember(teamId: string, data: { user_id: string; role: string }) {
    const response = await this.client.post(`/api/v1/teams/${teamId}/members`, data);
    return response.data;
  }

  async updateTeamMember(teamId: string, memberId: string, data: { role: string }) {
    const response = await this.client.put(`/api/v1/teams/${teamId}/members/${memberId}`, data);
    return response.data;
  }

  async removeTeamMember(teamId: string, memberId: string) {
    const response = await this.client.delete(`/api/v1/teams/${teamId}/members/${memberId}`);
    return response.data;
  }
}

export const apiClient = new ApiClient();