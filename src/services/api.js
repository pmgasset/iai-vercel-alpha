/**
 * API Service for Nonprofit Management Platform
 * Handles all communication with the Cloudflare Workers backend
 */

class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'https://nonprofit-management-api.your-account.workers.dev';
    this.token = localStorage.getItem('auth_token');
    
    // Request interceptor setup
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Add any global request/response interceptors here
    console.log('API Service initialized with base URL:', this.baseURL);
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('auth_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.getToken() && { 'Authorization': `Bearer ${this.getToken()}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle different response types
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      if (!response.ok) {
        // Handle specific HTTP status codes
        if (response.status === 401) {
          this.setToken(null);
          window.location.reload();
          return;
        }
        
        const errorMessage = data?.error || data || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', {
        url,
        method: options.method || 'GET',
        error: error.message
      });
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Please check your internet connection');
      }
      
      throw error;
    }
  }

  // Authentication methods
  async login(email, password) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.setToken(data.token);
    
    // Store user data for offline access
    if (data.user) {
      localStorage.setItem('user_data', JSON.stringify(data.user));
    }
    
    return data;
  }

  logout() {
    this.setToken(null);
    // Clear all stored data
    localStorage.clear();
  }

  // Organization & Dashboard methods
  async getDashboard() {
    return this.request('/api/dashboard');
  }

  async getOrganization() {
    return this.request('/api/organization');
  }

  // Meeting management methods
  async getMeetings(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/meetings${query ? `?${query}` : ''}`);
  }

  async getMeeting(id) {
    return this.request(`/api/meetings/${id}`);
  }

  async createMeeting(meetingData) {
    return this.request('/api/meetings', {
      method: 'POST',
      body: JSON.stringify(meetingData),
    });
  }

  async updateMeeting(id, meetingData) {
    return this.request(`/api/meetings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(meetingData),
    });
  }

  async deleteMeeting(id) {
    return this.request(`/api/meetings/${id}`, {
      method: 'DELETE',
    });
  }

  // Document management methods
  async getDocuments(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/documents${query ? `?${query}` : ''}`);
  }

  async getDocument(id) {
    return this.request(`/api/documents/${id}`);
  }

  async uploadDocument(documentData) {
    return this.request('/api/documents', {
      method: 'POST',
      body: JSON.stringify(documentData),
    });
  }

  async updateDocument(id, documentData) {
    return this.request(`/api/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(documentData),
    });
  }

  async deleteDocument(id) {
    return this.request(`/api/documents/${id}`, {
      method: 'DELETE',
    });
  }

  // User management methods
  async getUsers() {
    return this.request('/api/users');
  }

  async getUser(id) {
    return this.request(`/api/users/${id}`);
  }

  async updateUser(id, userData) {
    return this.request(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Board management methods
  async getBoardMembers() {
    return this.request('/api/board');
  }

  async addBoardMember(memberData) {
    return this.request('/api/board', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  }

  // Compliance methods
  async getComplianceStatus() {
    return this.request('/api/compliance');
  }

  async getDeadlines() {
    return this.request('/api/compliance/deadlines');
  }

  // Utility methods
  async checkHealth() {
    return this.request('/api/health');
  }

  async getActivity(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/activity${query ? `?${query}` : ''}`);
  }

  // File upload helper (for future use)
  async uploadFile(file, category = 'general') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    return this.request('/api/upload', {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        ...(this.getToken() && { 'Authorization': `Bearer ${this.getToken()}` }),
      },
      body: formData,
    });
  }

  // Search functionality
  async search(query, type = 'all') {
    return this.request('/api/search', {
      method: 'POST',
      body: JSON.stringify({ query, type }),
    });
  }
}

// Create and export a singleton instance
const api = new ApiService();
export default api;

// Also export the class for testing
export { ApiService };