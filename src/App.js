import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import MeetingManagement from './components/MeetingManagement';
import DocumentManagement from './components/DocumentManagement';
import Layout from './components/Layout';
import api from './services/api';

// Placeholder components for Phase 2 and beyond
const PlaceholderModule = ({ title, description, phase }) => (
  <div className="space-y-6">
    <div className="text-center py-16">
      <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
        <span className="text-3xl text-gray-400">🚧</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
        Coming in {phase}
      </div>
      <div className="mt-8 max-w-md mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
          <p className="text-sm text-blue-700">
            This module is part of our phased rollout. Check back soon for powerful new features!
          </p>
        </div>
      </div>
    </div>
  </div>
);

const NonprofitApp = () => {
  const [user, setUser] = useState(null);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check for existing authentication on app load
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          // Verify token is still valid
          await api.checkHealth();
          setUser(JSON.parse(userData));
          await loadInitialData();
        }
      } catch (err) {
        // Clear invalid auth data
        api.logout();
        console.log('Invalid auth data cleared');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const loadInitialData = async () => {
    try {
      setError('');
      const [dashData, meetingsData, documentsData] = await Promise.all([
        api.getDashboard().catch(() => ({})),
        api.getMeetings().catch(() => ({ meetings: [] })),
        api.getDocuments().catch(() => ({ documents: [] }))
      ]);

      setDashboardData(dashData);
      setMeetings(meetingsData.meetings || []);
      setDocuments(documentsData.documents || []);
    } catch (err) {
      setError('Failed to load application data');
      console.error('Initial data load error:', err);
    }
  };

  const handleLogin = async (userData) => {
    setUser(userData);
    setLoading(true);
    try {
      await loadInitialData();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setDashboardData(null);
    setMeetings([]);
    setDocuments([]);
    setActiveModule('dashboard');
    setError('');
  };

  const handleNavigate = (module) => {
    setActiveModule(module);
  };

  const handleMeetingsUpdate = (updatedMeetings) => {
    setMeetings(updatedMeetings);
    // Refresh dashboard data to update stats
    api.getDashboard().then(setDashboardData).catch(console.error);
  };

  const handleDocumentsUpdate = (updatedDocuments) => {
    setDocuments(updatedDocuments);
    // Refresh dashboard data to update stats
    api.getDashboard().then(setDashboardData).catch(console.error);
  };

  const renderActiveModule = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading {activeModule}...</p>
          </div>
        </div>
      );
    }

    switch (activeModule) {
      case 'dashboard':
        return (
          <Dashboard 
            dashboardData={dashboardData} 
            onNavigate={handleNavigate}
          />
        );
      case 'meetings':
        return (
          <MeetingManagement 
            meetings={meetings}
            onMeetingsUpdate={handleMeetingsUpdate}
          />
        );
      case 'documents':
        return (
          <DocumentManagement 
            documents={documents}
            onDocumentsUpdate={handleDocumentsUpdate}
          />
        );
      case 'board':
        return (
          <PlaceholderModule 
            title="Board Management"
            description="Comprehensive board member management, term tracking, and governance tools"
            phase="Phase 3"
          />
        );
      case 'compliance':
        return (
          <PlaceholderModule 
            title="Compliance Management"
            description="Automated compliance tracking, deadline monitoring, and regulatory reporting"
            phase="Phase 4"
          />
        );
      default:
        return (
          <Dashboard 
            dashboardData={dashboardData} 
            onNavigate={handleNavigate}
          />
        );
    }
  };

  // Show login form if not authenticated
  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // Show loading screen during initial data load
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Platform</h2>
          <p className="text-gray-600">Initializing your nonprofit management dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout
      activeModule={activeModule}
      onNavigate={handleNavigate}
      user={user}
      onLogout={handleLogout}
    >
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError('')}
                className="text-red-400 hover:text-red-600"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {renderActiveModule()}
    </Layout>
  );
};

export default NonprofitApp;