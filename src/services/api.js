/**
 * API Service for IntegrateAI Nonprofit Management Platform
 * Enhanced with comprehensive error handling and logging
 */

class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'https://nonprofit-management-api.traveldata.workers.dev';
    this.token = localStorage.getItem('auth_token');
    this.requestId = 0;
    
    // Setup interceptors and logging
    this.setupLogging();
    console.log(`🔗 API Service initialized with base URL: ${this.baseURL}`);
  }

  setupLogging() {
    // Enhanced logging for debugging
    this.logRequest = (method, url, requestId, body = null) => {
      console.group(`🌐 API Request #${requestId}: ${method} ${url}`);
      console.log('📤 Request URL:', url);
      console.log('🔑 Has Token:', !!this.getToken());
      if (body) {
        console.log('📦 Request Body:', body);
      }
      console.log('⏰ Timestamp:', new Date().toISOString());
      console.groupEnd();
    };

    this.logResponse = (requestId, response, data) => {
      console.group(`📨 API Response #${requestId}: ${response.status} ${response.statusText}`);
      console.log('✅ Status:', response.status);
      console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));
      console.log('📥 Response Data:', data);
      console.log('⏱️ Duration:', performance.now());
      console.groupEnd();
    };

    this.logError = (requestId, error, url) => {
      console.group(`❌ API Error #${requestId}: ${url}`);
      console.error('🚨 Error:', error.message);
      console.error('📍 URL:', url);
      console.error('🔍 Full Error:', error);
      console.error('⏰ Timestamp:', new Date().toISOString());
      console.groupEnd();
    };
  }

  getToken() {
    return this.token || localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
      console.log('🔐 Auth token set successfully');
    } else {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      console.log('🚪 Auth token cleared');
    }
  }

  // Clear authentication data
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.token = null;
    console.log('🚪 User logged out, tokens cleared');
  }

  // Enhanced request method with comprehensive error handling
  async request(endpoint, options = {}) {
    const requestId = ++this.requestId;
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId.toString(),
        ...options.headers,
        ...(this.getToken() && { 'Authorization': `Bearer ${this.getToken()}` }),
      },
    };

    // Log the request
    this.logRequest(options.method || 'GET', url, requestId, options.body);

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

      // Log successful response
      this.logResponse(requestId, response, data);
      
      if (!response.ok) {
        // Handle specific HTTP status codes with detailed logging
        if (response.status === 401) {
          console.warn('🔒 Authentication failed, clearing tokens');
          this.setToken(null);
          throw new Error('Authentication required - please log in again');
        }
        
        if (response.status === 403) {
          throw new Error('Access forbidden - insufficient permissions');
        }
        
        if (response.status === 404) {
          throw new Error(`Endpoint not found: ${endpoint}. Backend API may not be deployed yet.`);
        }
        
        if (response.status === 429) {
          throw new Error('Too many requests - please try again later');
        }
        
        if (response.status >= 500) {
          throw new Error(`Server error (${response.status}): The backend service is experiencing issues`);
        }
        
        const errorMessage = data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      
      return data;
    } catch (error) {
      // Enhanced error logging
      this.logError(requestId, error, url);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Network error: Unable to connect to ${this.baseURL}. Please check your internet connection and verify the API URL.`);
      }
      
      // Handle timeout errors
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - the server took too long to respond');
      }
      
      // Re-throw the error with context
      throw error;
    }
  }

  // Authentication methods with enhanced logging
  async login(credentials) {
    console.log('🔑 Attempting login for:', credentials.email);
    
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setToken(response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      console.log('✅ Login successful for user:', response.user.name);
    }
    
    return response;
  }

  async logoutUser() {
    console.log('🚪 Initiating logout process...');
    try {
      await this.request('/auth/logout', { method: 'POST' });
      console.log('✅ Server logout successful');
    } catch (error) {
      console.warn('⚠️ Server logout failed, continuing with local logout:', error.message);
    } finally {
      this.logout();
    }
  }

  // Health check with detailed logging
  async checkHealth() {
    console.log('🏥 Checking API health...');
    try {
      const health = await this.request('/health');
      console.log('✅ API health check passed:', health);
      return health;
    } catch (error) {
      console.error('❌ API health check failed:', error.message);
      throw error;
    }
  }

  // Dashboard methods
  async getDashboard() {
    console.log('📊 Fetching dashboard data...');
    return this.request('/dashboard');
  }

  // Meeting management methods
  async getMeetings(params = {}) {
    const query = new URLSearchParams(params).toString();
    console.log('📅 Fetching meetings with params:', params);
    return this.request(`/meetings${query ? `?${query}` : ''}`);
  }

  async getMeeting(id) {
    console.log('📅 Fetching meeting:', id);
    return this.request(`/meetings/${id}`);
  }

  async createMeeting(meetingData) {
    console.log('📅 Creating meeting:', meetingData.title);
    return this.request('/meetings', {
      method: 'POST',
      body: JSON.stringify(meetingData),
    });
  }

  async updateMeeting(id, meetingData) {
    console.log('📅 Updating meeting:', id);
    return this.request(`/meetings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(meetingData),
    });
  }

  async deleteMeeting(id) {
    console.log('📅 Deleting meeting:', id);
    return this.request(`/meetings/${id}`, {
      method: 'DELETE',
    });
  }

  // Document management methods
  async getDocuments(params = {}) {
    const query = new URLSearchParams(params).toString();
    console.log('📄 Fetching documents with params:', params);
    return this.request(`/documents${query ? `?${query}` : ''}`);
  }

  async getDocument(id) {
    console.log('📄 Fetching document:', id);
    return this.request(`/documents/${id}`);
  }

  async uploadDocument(documentData) {
    console.log('📄 Uploading document:', documentData.title);
    return this.request('/documents', {
      method: 'POST',
      body: JSON.stringify(documentData),
    });
  }

  async updateDocument(id, documentData) {
    console.log('📄 Updating document:', id);
    return this.request(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(documentData),
    });
  }

  async deleteDocument(id) {
    console.log('📄 Deleting document:', id);
    return this.request(`/documents/${id}`, {
      method: 'DELETE',
    });
  }

  // Board management methods
  async getBoardMembers(params = {}) {
    const query = new URLSearchParams(params).toString();
    console.log('👥 Fetching board members with params:', params);
    return this.request(`/board${query ? `?${query}` : ''}`);
  }

  async getBoardMember(id) {
    console.log('👥 Fetching board member:', id);
    return this.request(`/board/${id}`);
  }

  async addBoardMember(memberData) {
    console.log('👥 Adding board member:', memberData.name);
    return this.request('/board', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  }

  async updateBoardMember(id, memberData) {
    console.log('👥 Updating board member:', id);
    return this.request(`/board/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    });
  }

  async deleteBoardMember(id) {
    console.log('👥 Deleting board member:', id);
    return this.request(`/board/${id}`, {
      method: 'DELETE',
    });
  }

  // Committee management methods
  async getCommittees() {
    console.log('🏛️ Fetching committees...');
    return this.request('/board/committees');
  }

  async getCommittee(id) {
    console.log('🏛️ Fetching committee:', id);
    return this.request(`/board/committees/${id}`);
  }

  async createCommittee(committeeData) {
    console.log('🏛️ Creating committee:', committeeData.name);
    return this.request('/board/committees', {
      method: 'POST',
      body: JSON.stringify(committeeData),
    });
  }

  async updateCommittee(id, committeeData) {
    console.log('🏛️ Updating committee:', id);
    return this.request(`/board/committees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(committeeData),
    });
  }

  async deleteCommittee(id) {
    console.log('🏛️ Deleting committee:', id);
    return this.request(`/board/committees/${id}`, {
      method: 'DELETE',
    });
  }

  // Compliance management methods
  async getComplianceStatus() {
    console.log('⚖️ Fetching compliance status...');
    return this.request('/compliance');
  }

  async getDeadlines(params = {}) {
    const query = new URLSearchParams(params).toString();
    console.log('📋 Fetching compliance deadlines with params:', params);
    return this.request(`/compliance/deadlines${query ? `?${query}` : ''}`);
  }

  async getDeadline(id) {
    console.log('📋 Fetching deadline:', id);
    return this.request(`/compliance/deadlines/${id}`);
  }

  async createDeadline(deadlineData) {
    console.log('📋 Creating deadline:', deadlineData.title);
    return this.request('/compliance/deadlines', {
      method: 'POST',
      body: JSON.stringify(deadlineData),
    });
  }

  async updateDeadline(id, deadlineData) {
    console.log('📋 Updating deadline:', id);
    return this.request(`/compliance/deadlines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(deadlineData),
    });
  }

  async deleteDeadline(id) {
    console.log('📋 Deleting deadline:', id);
    return this.request(`/compliance/deadlines/${id}`, {
      method: 'DELETE',
    });
  }

  async markDeadlineComplete(id, completionData) {
    console.log('✅ Marking deadline complete:', id);
    return this.request(`/compliance/deadlines/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify(completionData),
    });
  }

  // Compliance areas management
  async getComplianceAreas() {
    console.log('📊 Fetching compliance areas...');
    return this.request('/compliance/areas');
  }

  async getComplianceArea(id) {
    console.log('📊 Fetching compliance area:', id);
    return this.request(`/compliance/areas/${id}`);
  }

  async updateComplianceArea(id, areaData) {
    console.log('📊 Updating compliance area:', id);
    return this.request(`/compliance/areas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(areaData),
    });
  }

  // Audit trail methods
  async getAuditTrail(params = {}) {
    const query = new URLSearchParams(params).toString();
    console.log('📜 Fetching audit trail with params:', params);
    return this.request(`/compliance/audit${query ? `?${query}` : ''}`);
  }

  async createAuditEntry(entryData) {
    console.log('📜 Creating audit entry:', entryData.action);
    return this.request('/compliance/audit', {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
  }

  // User management methods
  async getUsers() {
    console.log('👤 Fetching users...');
    return this.request('/users');
  }

  async getUser(id) {
    console.log('👤 Fetching user:', id);
    return this.request(`/users/${id}`);
  }

  async updateUser(id, userData) {
    console.log('👤 Updating user:', id);
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Activity tracking
  async getActivity(params = {}) {
    const query = new URLSearchParams(params).toString();
    console.log('📈 Fetching activity with params:', params);
    return this.request(`/activity${query ? `?${query}` : ''}`);
  }

  // File upload helper
  async uploadFile(file, category = 'general', metadata = {}) {
    console.log('📎 Uploading file:', file.name, 'Category:', category);
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
    console.log('🔍 Searching:', query, 'Type:', type);
    return this.request('/search', {
      method: 'POST',
      body: JSON.stringify({ query, type, filters }),
    });
  }

  // Debugging helpers
  getApiInfo() {
    return {
      baseURL: this.baseURL,
      hasToken: !!this.getToken(),
      tokenLength: this.getToken()?.length || 0,
      requestCount: this.requestId
    };
  }

  // Test connectivity
  async testConnection() {
    console.log('🧪 Testing API connection...');
    try {
      const start = performance.now();
      await this.checkHealth();
      const duration = performance.now() - start;
      console.log(`✅ Connection test passed in ${duration.toFixed(2)}ms`);
      return { success: true, duration };
    } catch (error) {
      console.error('❌ Connection test failed:', error.message);
      return { success: false, error: error.message };
    }
  }
}

// Create and export a singleton instance
const api = new ApiService();
export default api;

// Also export the class for testing
export { ApiService };