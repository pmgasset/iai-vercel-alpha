import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import MeetingManagement from './components/MeetingManagement';
import DocumentManagement from './components/DocumentManagement';
import BoardManagement from './components/BoardManagement';
import ComplianceManagement from './components/ComplianceManagement';
import Layout from './components/Layout';
import api from './services/api';

const NonprofitApp = () => {
  const [user, setUser] = useState(null);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);
  const [complianceData, setComplianceData] = useState([]);
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
      const [dashData, meetingsData, documentsData, boardData, complianceDataResult] = await Promise.all([
        api.getDashboard().catch(() => ({})),
        api.getMeetings().catch(() => ({ meetings: [] })),
        api.getDocuments().catch(() => ({ documents: [] })),
        api.getBoardMembers().catch(() => ({ members: [] })),
        api.getComplianceStatus().catch(() => ({ compliance: [] }))
      ]);

      setDashboardData(dashData);
      setMeetings(meetingsData.meetings || []);
      setDocuments(documentsData.documents || []);
      setBoardMembers(boardData.members || []);
      setComplianceData(complianceDataResult.compliance || []);
    } catch (err) {
      setError('Failed to load application data');
      console.error('Data loading error:', err);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      setError('');
      const response = await api.login(credentials);
      
      if (response.user && response.token) {
        setUser(response.user);
        await loadInitialData();
        return { success: true };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setDashboardData(null);
    setMeetings([]);
    setDocuments([]);
    setBoardMembers([]);
    setComplianceData([]);
    setActiveModule('dashboard');
  };

  const handleNavigate = (module) => {
    setActiveModule(module);
  };

  const handleMeetingsUpdate = (updatedMeetings) => {
    setMeetings(updatedMeetings);
    // Refresh dashboard data to reflect changes
    loadInitialData();
  };

  const handleDocumentsUpdate = (updatedDocuments) => {
    setDocuments(updatedDocuments);
    // Refresh dashboard data to reflect changes
    loadInitialData();
  };

  const handleBoardUpdate = (updatedBoard) => {
    setBoardMembers(updatedBoard);
    // Refresh dashboard data to reflect changes
    loadInitialData();
  };

  const handleComplianceUpdate = (updatedCompliance) => {
    setComplianceData(updatedCompliance);
    // Refresh dashboard data to reflect changes
    loadInitialData();
  };

  const renderActiveModule = () => {
    switch (activeModule) {
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
          <BoardManagement 
            boardMembers={boardMembers}
            onBoardUpdate={handleBoardUpdate}
          />
        );
      case 'compliance':
        return (
          <ComplianceManagement 
            complianceData={complianceData}
            onComplianceUpdate={handleComplianceUpdate}
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
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {renderActiveModule()}
    </Layout>
  );
};

export default NonprofitApp;