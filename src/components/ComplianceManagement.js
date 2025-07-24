import React, { useState } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Calendar, 
  FileText, 
  Clock,
  Bell,
  Shield,
  Download,
  Upload,
  Eye,
  Edit3,
  Plus,
  Search,
  Filter,
  ExternalLink,
  XCircle,
  Users,
  Target
} from 'lucide-react';

const ComplianceManagement = ({ complianceData = [], onComplianceUpdate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample compliance data - replace with actual API calls
  const [deadlines, setDeadlines] = useState([
    {
      id: 1,
      title: 'IRS Form 990 Filing',
      description: 'Annual tax return for tax-exempt organizations',
      dueDate: '2025-11-15',
      category: 'federal',
      status: 'pending',
      priority: 'high',
      responsible: 'David Park',
      estimatedHours: 40,
      documents: ['Financial Statements', 'Board Minutes', 'Program Reports'],
      notes: 'Annual filing deadline based on fiscal year end',
      completedDate: null,
      recurringPattern: 'yearly'
    },
    {
      id: 2,
      title: 'Illinois Annual Report',
      description: 'State annual report and fee payment',
      dueDate: '2025-08-31',
      category: 'state',
      status: 'in_progress',
      priority: 'medium',
      responsible: 'Emily Rodriguez',
      estimatedHours: 8,
      documents: ['Articles of Incorporation', 'Current Bylaws'],
      notes: 'Due by August 31st annually',
      completedDate: null,
      recurringPattern: 'yearly'
    },
    {
      id: 3,
      title: 'Board Meeting Minutes Review',
      description: 'Quarterly review and filing of board meeting minutes',
      dueDate: '2025-07-30',
      category: 'governance',
      status: 'overdue',
      priority: 'high',
      responsible: 'Emily Rodriguez',
      estimatedHours: 4,
      documents: ['Q2 Board Minutes', 'Committee Minutes'],
      notes: 'Required quarterly review per Section 5.01',
      completedDate: null,
      recurringPattern: 'quarterly'
    },
    {
      id: 4,
      title: 'Financial Audit Preparation',
      description: 'Prepare documents for annual independent audit',
      dueDate: '2025-09-15',
      category: 'financial',
      status: 'pending',
      priority: 'high',
      responsible: 'David Park',
      estimatedHours: 60,
      documents: ['Financial Records', 'Bank Statements', 'Receipts'],
      notes: 'Independent audit required per board resolution',
      completedDate: null,
      recurringPattern: 'yearly'
    },
    {
      id: 5,
      title: 'Charitable Solicitation Registration',
      description: 'Illinois charitable solicitation permit renewal',
      dueDate: '2025-12-31',
      category: 'state',
      status: 'completed',
      priority: 'medium',
      responsible: 'Sarah Johnson',
      estimatedHours: 6,
      documents: ['Fundraising Records', 'Financial Reports'],
      notes: 'Completed early for 2025',
      completedDate: '2025-07-15',
      recurringPattern: 'yearly'
    }
  ]);

  const [complianceAreas, setComplianceAreas] = useState([
    {
      id: 1,
      name: 'Federal Tax Compliance',
      description: 'IRS forms, tax-exempt status maintenance',
      requirements: [
        'Annual Form 990 filing',
        'Maintain tax-exempt purpose',
        'Private benefit restrictions',
        'Political activity limitations'
      ],
      lastReview: '2024-12-15',
      nextReview: '2025-12-15',
      status: 'compliant',
      riskLevel: 'low'
    },
    {
      id: 2,
      name: 'State Registration',
      description: 'Illinois Secretary of State compliance',
      requirements: [
        'Annual report filing',
        'Registered agent maintenance',
        'Corporate address updates',
        'Charitable solicitation permit'
      ],
      lastReview: '2025-01-10',
      nextReview: '2026-01-10',
      status: 'compliant',
      riskLevel: 'low'
    },
    {
      id: 3,
      name: 'Governance Requirements',
      description: 'Bylaws, board meetings, corporate records',
      requirements: [
        'Regular board meetings',
        'Meeting minute documentation',
        'Bylaw compliance',
        'Conflict of interest policies'
      ],
      lastReview: '2025-06-01',
      nextReview: '2025-09-01',
      status: 'attention_needed',
      riskLevel: 'medium'
    },
    {
      id: 4,
      name: 'Financial Oversight',
      description: 'Budget management, audit requirements',
      requirements: [
        'Annual budget approval',
        'Financial controls',
        'Audit preparation',
        'Board financial reporting'
      ],
      lastReview: '2025-03-15',
      nextReview: '2025-06-15',
      status: 'compliant',
      riskLevel: 'low'
    }
  ]);

  const [auditTrail, setAuditTrail] = useState([
    {
      id: 1,
      action: 'Form 990 Draft Completed',
      user: 'David Park',
      timestamp: '2025-07-20T14:30:00Z',
      category: 'document',
      details: 'Initial draft of 2024 Form 990 completed and ready for review'
    },
    {
      id: 2,
      action: 'Board Meeting Minutes Filed',
      user: 'Emily Rodriguez',
      timestamp: '2025-07-18T09:15:00Z',
      category: 'governance',
      details: 'June 2025 board meeting minutes approved and filed'
    },
    {
      id: 3,
      action: 'Compliance Deadline Added',
      user: 'Sarah Johnson',
      timestamp: '2025-07-15T16:45:00Z',
      category: 'deadline',
      details: 'Added quarterly board review deadline for Q3 2025'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in_progress': return 'text-blue-600 bg-blue-50';
      case 'overdue': return 'text-red-600 bg-red-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredDeadlines = deadlines.filter(deadline => {
    const matchesSearch = deadline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deadline.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || deadline.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const upcomingDeadlines = deadlines
    .filter(d => d.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const ComplianceMetrics = () => {
    const totalDeadlines = deadlines.length;
    const completedDeadlines = deadlines.filter(d => d.status === 'completed').length;
    const overdueDeadlines = deadlines.filter(d => d.status === 'overdue').length;
    const upcomingCount = deadlines.filter(d => {
      const daysUntil = getDaysUntilDue(d.dueDate);
      return daysUntil <= 30 && d.status !== 'completed';
    }).length;

    return (
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-600">Total Deadlines</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalDeadlines}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm text-gray-600">Completed</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{completedDeadlines}</p>
          <p className="text-xs text-gray-500">{Math.round((completedDeadlines/totalDeadlines)*100)}% completion rate</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-sm text-gray-600">Overdue</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{overdueDeadlines}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <span className="text-sm text-gray-600">Due Soon</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{upcomingCount}</p>
          <p className="text-xs text-gray-500">Next 30 days</p>
        </div>
      </div>
    );
  };

  const DeadlineCard = ({ deadline }) => {
    const daysUntil = getDaysUntilDue(deadline.dueDate);
    const isOverdue = daysUntil < 0 && deadline.status !== 'completed';
    const isDueSoon = daysUntil <= 7 && daysUntil >= 0 && deadline.status !== 'completed';

    return (
      <div className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${
        isOverdue ? 'border-red-200 bg-red-50' : isDueSoon ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'
      }`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{deadline.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{deadline.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deadline.status)}`}>
              {deadline.status.replace('_', ' ').toUpperCase()}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(deadline.priority)}`}>
              {deadline.priority.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="text-gray-500">Due Date</p>
            <p className="font-medium flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(deadline.dueDate).toLocaleDateString()}</span>
            </p>
            {daysUntil >= 0 && deadline.status !== 'completed' && (
              <p className={`text-xs ${isDueSoon ? 'text-yellow-600' : 'text-gray-500'}`}>
                {daysUntil} days remaining
              </p>
            )}
            {isOverdue && (
              <p className="text-xs text-red-600">
                {Math.abs(daysUntil)} days overdue
              </p>
            )}
          </div>
          <div>
            <p className="text-gray-500">Responsible</p>
            <p className="font-medium flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{deadline.responsible}</span>
            </p>
            <p className="text-xs text-gray-500">{deadline.estimatedHours}h estimated</p>
          </div>
        </div>

        {deadline.documents && deadline.documents.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Required Documents:</p>
            <div className="flex flex-wrap gap-2">
              {deadline.documents.map((doc, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                  {doc}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <span className="text-xs text-gray-500 capitalize">{deadline.category} compliance</span>
          <div className="flex space-x-2">
            <button className="text-blue-600 hover:text-blue-800 text-sm">
              <Eye className="h-4 w-4" />
            </button>
            <button className="text-gray-600 hover:text-gray-800 text-sm">
              <Edit3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ComplianceAreaCard = ({ area }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{area.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{area.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            area.status === 'compliant' ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50'
          }`}>
            {area.status === 'compliant' ? 'Compliant' : 'Attention Needed'}
          </span>
          <span className={`text-sm font-medium ${getRiskColor(area.riskLevel)}`}>
            {area.riskLevel.toUpperCase()} RISK
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm font-medium text-gray-700">Key Requirements:</p>
        <ul className="text-sm text-gray-600 space-y-1">
          {area.requirements.map((req, index) => (
            <li key={index} className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Last Review</p>
          <p className="font-medium">{new Date(area.lastReview).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-gray-500">Next Review</p>
          <p className="font-medium">{new Date(area.nextReview).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );

  const AddDeadlineModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      dueDate: '',
      category: 'federal',
      priority: 'medium',
      responsible: '',
      estimatedHours: '',
      notes: '',
      recurringPattern: 'none'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const newDeadline = {
        id: Date.now(),
        ...formData,
        status: 'pending',
        documents: [],
        completedDate: null
      };
      setDeadlines([...deadlines, newDeadline]);
      onComplianceUpdate && onComplianceUpdate([...deadlines, newDeadline]);
      setShowAddModal(false);
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        category: 'federal',
        priority: 'medium',
        responsible: '',
        estimatedHours: '',
        notes: '',
        recurringPattern: 'none'
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-90vh overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Add Compliance Deadline</h3>
            <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="federal">Federal</option>
                  <option value="state">State</option>
                  <option value="governance">Governance</option>
                  <option value="financial">Financial</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
                <input
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({...formData, estimatedHours: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsible Person</label>
                <input
                  type="text"
                  required
                  value={formData.responsible}
                  onChange={(e) => setFormData({...formData, responsible: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recurring Pattern</label>
                <select
                  value={formData.recurringPattern}
                  onChange={(e) => setFormData({...formData, recurringPattern: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">One-time</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Deadline
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Management</h1>
          <p className="text-gray-600 mt-1">Monitor deadlines, track requirements, and maintain audit trails</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Deadline</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('deadlines')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'deadlines'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Deadlines
          </button>
          <button
            onClick={() => setActiveTab('areas')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'areas'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Compliance Areas
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'audit'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Audit Trail
          </button>
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <ComplianceMetrics />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Deadlines */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
                <Bell className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {upcomingDeadlines.map(deadline => {
                  const daysUntil = getDaysUntilDue(deadline.dueDate);
                  const isOverdue = daysUntil < 0;
                  const isDueSoon = daysUntil <= 7 && daysUntil >= 0;

                  return (
                    <div key={deadline.id} className={`p-3 rounded-lg border ${
                      isOverdue ? 'border-red-200 bg-red-50' : 
                      isDueSoon ? 'border-yellow-200 bg-yellow-50' : 
                      'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{deadline.title}</p>
                          <p className="text-sm text-gray-600">{new Date(deadline.dueDate).toLocaleDateString()}</p>
                        </div>
                        <span className={`text-xs font-medium ${
                          isOverdue ? 'text-red-600' :
                          isDueSoon ? 'text-yellow-600' : 'text-gray-600'
                        }`}>
                          {isOverdue ? `${Math.abs(daysUntil)} days overdue` :
                           isDueSoon ? `${daysUntil} days left` : `${daysUntil} days`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Compliance Status Overview */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Compliance Status</h3>
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {complianceAreas.map(area => (
                  <div key={area.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        area.status === 'compliant' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="font-medium text-gray-900">{area.name}</span>
                    </div>
                    <span className={`text-xs font-medium ${getRiskColor(area.riskLevel)}`}>
                      {area.riskLevel.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Download className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Generate Report</span>
              </button>
              <button className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Upload className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Upload Document</span>
              </button>
              <button className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium">Schedule Review</span>
              </button>
              <button className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <ExternalLink className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium">IRS Portal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deadlines Tab */}
      {activeTab === 'deadlines' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search deadlines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Deadlines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeadlines.map(deadline => (
              <DeadlineCard key={deadline.id} deadline={deadline} />
            ))}
          </div>
        </div>
      )}

      {/* Compliance Areas Tab */}
      {activeTab === 'areas' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Compliance Areas</h2>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add Area</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complianceAreas.map(area => (
              <ComplianceAreaCard key={area.id} area={area} />
            ))}
          </div>

          {/* Compliance Guidelines */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Compliance Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Bylaw Compliance</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Regular board meetings with 48-hour notice requirement</li>
                  <li>• Quorum verification before meeting activation</li>
                  <li>• Meeting record retention per Article 5 requirements</li>
                  <li>• Three-year term enforcement with staggered transitions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Financial Compliance</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Officer salary tracking per Section 4.12</li>
                  <li>• Loan prohibition enforcement per Section 4.10</li>
                  <li>• Bond requirement tracking per Section 4.11</li>
                  <li>• Annual budget approval and monitoring</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Trail Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Audit Trail</h2>
            <div className="flex space-x-2">
              <button className="text-gray-600 hover:text-gray-800 p-2 border border-gray-300 rounded-lg">
                <Download className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-gray-800 p-2 border border-gray-300 rounded-lg">
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              <p className="text-sm text-gray-600 mt-1">Complete activity logging for transparency and audit purposes</p>
            </div>
            <div className="divide-y divide-gray-200">
              {auditTrail.map(entry => (
                <div key={entry.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      entry.category === 'document' ? 'bg-blue-100' :
                      entry.category === 'governance' ? 'bg-green-100' :
                      entry.category === 'deadline' ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}>
                      {entry.category === 'document' && <FileText className="h-4 w-4 text-blue-600" />}
                      {entry.category === 'governance' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {entry.category === 'deadline' && <Clock className="h-4 w-4 text-yellow-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{entry.action}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{entry.details}</p>
                      <p className="text-xs text-gray-500 mt-1">by {entry.user}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Settings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Settings</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Retention Policy</h4>
                <p className="text-sm text-gray-600 mb-2">Audit logs are retained for 7 years per compliance requirements</p>
                <button className="text-blue-600 hover:text-blue-800 text-sm">Configure retention →</button>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Export Options</h4>
                <p className="text-sm text-gray-600 mb-2">Export audit trails for external audits and reviews</p>
                <button className="text-blue-600 hover:text-blue-800 text-sm">Export options →</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Deadline Modal */}
      {showAddModal && <AddDeadlineModal />}
    </div>
  );
};

export default ComplianceManagement;