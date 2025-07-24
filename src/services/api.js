// API Service for IntegrateAI Nonprofit Management Platform
// Updated to include Board Management and Compliance endpoints

class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || '/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Get authentication token from localStorage
  getToken() {
    return localStorage.getItem('auth_token');
  }

  // Set authentication token in localStorage
  setToken(token) {
    localStorage.setItem('auth_token', token);
  }

  // Clear authentication data
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  // Generic request method with error handling
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
        ...(this.getToken() && { 'Authorization': `Bearer ${this.getToken()}` }),
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
          throw new Error('Authentication required');
        }
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setToken(response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      // Continue with logout even if request fails
      console.warn('Logout request failed:', error);
    } finally {
      this.logout();
    }
  }

  // Dashboard methods
  async getDashboard() {
    return this.request('/dashboard');
  }

  // Meeting management methods
  async getMeetings(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/meetings${query ? `?${query}` : ''}`);
  }

  async getMeeting(id) {
    return this.request(`/meetings/${id}`);
  }

  async createMeeting(meetingData) {
    return this.request('/meetings', {
      method: 'POST',
      body: JSON.stringify(meetingData),
    });
  }

  async updateMeeting(id, meetingData) {
    return this.request(`/meetings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(meetingData),
    });
  }

  async deleteMeeting(id) {
    return this.request(`/meetings/${id}`, {
      method: 'DELETE',
    });
  }

  // Document management methods
  async getDocuments(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/documents${query ? `?${query}` : ''}`);
  }

  async getDocument(id) {
    return this.request(`/documents/${id}`);
  }

  async uploadDocument(documentData) {
    return this.request('/documents', {
      method: 'POST',
      body: JSON.stringify(documentData),
    });
  }

  async updateDocument(id, documentData) {
    return this.request(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(documentData),
    });
  }

  async deleteDocument(id) {
    return this.request(`/documents/${id}`, {
      method: 'DELETE',
    });
  }

  // Board management methods
  async getBoardMembers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/board${query ? `?${query}` : ''}`);
  }

  async getBoardMember(id) {
    return this.request(`/board/${id}`);
  }

  async addBoardMember(memberData) {
    return this.request('/board', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  }

  async updateBoardMember(id, memberData) {
    return this.request(`/board/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    });
  }

  async deleteBoardMember(id) {
    return this.request(`/board/${id}`, {
      method: 'DELETE',
    });
  }

  // Committee management methods
  async getCommittees() {
    return this.request('/board/committees');
  }

  async getCommittee(id) {
    return this.request(`/board/committees/${id}`);
  }

  async createCommittee(committeeData) {
    return this.request('/board/committees', {
      method: 'POST',
      body: JSON.stringify(committeeData),
    });
  }

  async updateCommittee(id, committeeData) {
    return this.request(`/board/committees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(committeeData),
    });
  }

  async deleteCommittee(id) {
    return this.request(`/board/committees/${id}`, {
      method: 'DELETE',
    });
  }

  // Term and succession management
  async getTermExpirations() {
    return this.request('/board/terms/expiring');
  }

  async updateTerms(id, termData) {
    return this.request(`/board/${id}/terms`, {
      method: 'PUT',
      body: JSON.stringify(termData),
    });
  }

  // Compliance management methods
  async getComplianceStatus() {
    return this.request('/compliance');
  }

  async getDeadlines(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/compliance/deadlines${query ? `?${query}` : ''}`);
  }

  async getDeadline(id) {
    return this.request(`/compliance/deadlines/${id}`);
  }

  async createDeadline(deadlineData) {
    return this.request('/compliance/deadlines', {
      method: 'POST',
      body: JSON.stringify(deadlineData),
    });
  }

  async updateDeadline(id, deadlineData) {
    return this.request(`/compliance/deadlines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(deadlineData),
    });
  }

  async deleteDeadline(id) {
    return this.request(`/compliance/deadlines/${id}`, {
      method: 'DELETE',
    });
  }

  async markDeadlineComplete(id, completionData) {
    return this.request(`/compliance/deadlines/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify(completionData),
    });
  }

  // Compliance areas management
  async getComplianceAreas() {
    return this.request('/compliance/areas');
  }

  async getComplianceArea(id) {
    return this.request(`/compliance/areas/${id}`);
  }

  async updateComplianceArea(id, areaData) {
    return this.request(`/compliance/areas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(areaData),
    });
  }

  // Audit trail methods
  async getAuditTrail(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/compliance/audit${query ? `?${query}` : ''}`);
  }

  async createAuditEntry(entryData) {
    return this.request('/compliance/audit', {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
  }

  // Form generation and compliance reporting
  async generateComplianceReport(type, params = {}) {
    return this.request('/compliance/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ type, params }),
    });
  }

  async getComplianceReports() {
    return this.request('/compliance/reports');
  }

  async downloadForm(formType, params = {}) {
    return this.request('/compliance/forms/download', {
      method: 'POST',
      body: JSON.stringify({ formType, params }),
    });
  }

  // User management methods
  async getUsers() {
    return this.request('/users');
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Utility methods
  async checkHealth() {
    return this.request('/health');
  }

  async getActivity(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/activity${query ? `?${query}` : ''}`);
  }

  // File upload helper
  async uploadFile(file, category = 'general', metadata = {}) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('metadata', JSON.stringify(metadata));

    return this.request('/upload', {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        ...(this.getToken() && { 'Authorization': `Bearer ${this.getToken()}` }),
      },
      body: formData,
    });
  }

  // Search functionality
  async search(query, type = 'all', filters = {}) {
    return this.request('/search', {
      method: 'POST',
      body: JSON.stringify({ query, type, filters }),
    });
  }

  // Notification methods
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'POST',
    });
  }

  async getNotificationSettings() {
    return this.request('/notifications/settings');
  }

  async updateNotificationSettings(settings) {
    return this.request('/notifications/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Analytics and reporting
  async getAnalytics(type, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/analytics/${type}${query ? `?${query}` : ''}`);
  }

  async exportData(type, format = 'json', params = {}) {
    return this.request('/export', {
      method: 'POST',
      body: JSON.stringify({ type, format, params }),
    });
  }

  // Integration methods (for future use)
  async getIntegrations() {
    return this.request('/integrations');
  }

  async configureIntegration(type, config) {
    return this.request(`/integrations/${type}`, {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }
}

// Create and export a singleton instance
const api = new ApiService();
export default api;

// Also export the class for testing
export { ApiService };