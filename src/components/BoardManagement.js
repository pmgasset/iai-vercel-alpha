import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit3, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  AlertCircle, 
  Clock, 
  Award, 
  FileText, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  MoreVertical,
  UserPlus,
  Building,
  Shield
} from 'lucide-react';

const BoardManagement = ({ boardMembers = [], onBoardUpdate }) => {
  const [activeTab, setActiveTab] = useState('directors');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Sample data - replace with actual API calls
  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'President',
      type: 'officer',
      email: 'sarah.johnson@integrateai.org',
      phone: '(555) 123-4567',
      address: '123 Main St, Springfield, IL',
      termStart: '2024-01-15',
      termEnd: '2027-01-15',
      status: 'active',
      committees: ['Executive', 'Strategic Planning'],
      qualifications: ['MBA Finance', '15 years nonprofit experience'],
      notes: 'Elected unanimously in 2024 board meeting'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Vice President',
      type: 'officer',
      email: 'michael.chen@integrateai.org',
      phone: '(555) 987-6543',
      address: '456 Oak Ave, Springfield, IL',
      termStart: '2024-01-15',
      termEnd: '2027-01-15',
      status: 'active',
      committees: ['Technology', 'Governance'],
      qualifications: ['CTO Experience', 'PhD Computer Science'],
      notes: 'Strong technical background in AI/ML'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Secretary',
      type: 'officer',
      email: 'emily.rodriguez@integrateai.org',
      phone: '(555) 456-7890',
      address: '789 Pine St, Springfield, IL',
      termStart: '2023-06-01',
      termEnd: '2026-06-01',
      status: 'active',
      committees: ['Governance', 'Communications'],
      qualifications: ['JD Law Degree', 'Corporate Secretary Experience'],
      notes: 'Responsible for meeting minutes and records'
    },
    {
      id: 4,
      name: 'David Park',
      role: 'Treasurer',
      type: 'officer',
      email: 'david.park@integrateai.org',
      phone: '(555) 321-0987',
      address: '321 Elm St, Springfield, IL',
      termStart: '2023-06-01',
      termEnd: '2026-06-01',
      status: 'active',
      committees: ['Finance', 'Audit'],
      qualifications: ['CPA', '12 years financial management'],
      notes: 'Oversees all financial operations and reporting'
    },
    {
      id: 5,
      name: 'Dr. Amanda Foster',
      role: 'Director',
      type: 'director',
      email: 'amanda.foster@university.edu',
      phone: '(555) 654-3210',
      address: '987 University Way, Springfield, IL',
      termStart: '2022-12-01',
      termEnd: '2025-12-01',
      status: 'active',
      committees: ['Strategic Planning', 'Research'],
      qualifications: ['PhD Education', 'University Professor'],
      notes: 'Academic representative with AI ethics expertise'
    }
  ]);

  const [committees, setCommittees] = useState([
    {
      id: 1,
      name: 'Executive Committee',
      description: 'Primary governance and strategic oversight',
      members: ['Sarah Johnson', 'Michael Chen', 'Emily Rodriguez'],
      chair: 'Sarah Johnson',
      meetingFrequency: 'Monthly',
      nextMeeting: '2025-08-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Finance Committee',
      description: 'Financial oversight and budget management',
      members: ['David Park', 'Sarah Johnson', 'Dr. Amanda Foster'],
      chair: 'David Park',
      meetingFrequency: 'Quarterly',
      nextMeeting: '2025-09-30',
      status: 'active'
    },
    {
      id: 3,
      name: 'Technology Committee',
      description: 'Technical strategy and innovation oversight',
      members: ['Michael Chen', 'Dr. Amanda Foster'],
      chair: 'Michael Chen',
      meetingFrequency: 'Bi-monthly',
      nextMeeting: '2025-08-30',
      status: 'active'
    }
  ]);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === 'all' || member.type === filterRole;
    return matchesSearch && matchesFilter;
  });

  const getTermStatus = (termEnd) => {
    const endDate = new Date(termEnd);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'expired', label: 'Expired', color: 'text-red-600 bg-red-50' };
    if (diffDays < 90) return { status: 'expiring', label: `${diffDays} days left`, color: 'text-yellow-600 bg-yellow-50' };
    return { status: 'active', label: 'Active', color: 'text-green-600 bg-green-50' };
  };

  const handleAddMember = (memberData) => {
    const newMember = {
      id: Date.now(),
      ...memberData,
      status: 'active'
    };
    setMembers([...members, newMember]);
    onBoardUpdate && onBoardUpdate([...members, newMember]);
    setShowAddModal(false);
  };

  const AddMemberModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      role: '',
      type: 'director',
      email: '',
      phone: '',
      address: '',
      termStart: '',
      termEnd: '',
      committees: [],
      qualifications: '',
      notes: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      handleAddMember({
        ...formData,
        committees: formData.committees.filter(c => c.trim()),
        qualifications: formData.qualifications.split(',').map(q => q.trim()).filter(q => q)
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-90vh overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Add Board Member</h3>
            <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  <option value="President">President</option>
                  <option value="Vice President">Vice President</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Treasurer">Treasurer</option>
                  <option value="Director">Director</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Term Start</label>
                <input
                  type="date"
                  required
                  value={formData.termStart}
                  onChange={(e) => setFormData({...formData, termStart: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Term End</label>
                <input
                  type="date"
                  required
                  value={formData.termEnd}
                  onChange={(e) => setFormData({...formData, termEnd: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications (comma-separated)</label>
              <textarea
                value={formData.qualifications}
                onChange={(e) => setFormData({...formData, qualifications: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="MBA Finance, 10 years experience, etc."
              />
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
                Add Member
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const MemberCard = ({ member }) => {
    const termStatus = getTermStatus(member.termEnd);
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
              <p className="text-blue-600 font-medium">{member.role}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${termStatus.color}`}>
              {termStatus.label}
            </span>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>{member.email}</span>
          </div>
          {member.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>{member.phone}</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Term: {new Date(member.termStart).toLocaleDateString()} - {new Date(member.termEnd).toLocaleDateString()}</span>
          </div>
        </div>

        {member.committees && member.committees.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Committees:</p>
            <div className="flex flex-wrap gap-2">
              {member.committees.map((committee, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                  {committee}
                </span>
              ))}
            </div>
          </div>
        )}

        {member.qualifications && member.qualifications.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Qualifications:</p>
            <div className="flex flex-wrap gap-2">
              {member.qualifications.map((qual, index) => (
                <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                  {qual}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const CommitteeCard = ({ committee }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{committee.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{committee.description}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          committee.status === 'active' ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50'
        }`}>
          {committee.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Chair</p>
          <p className="font-medium">{committee.chair}</p>
        </div>
        <div>
          <p className="text-gray-500">Meeting Frequency</p>
          <p className="font-medium">{committee.meetingFrequency}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Members ({committee.members.length}):</p>
        <div className="flex flex-wrap gap-2">
          {committee.members.map((member, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
              {member}
            </span>
          ))}
        </div>
      </div>

      {committee.nextMeeting && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <div className="flex items-center space-x-2 text-blue-700">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">
              Next Meeting: {new Date(committee.nextMeeting).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Board Management</h1>
          <p className="text-gray-600 mt-1">Manage board members, officers, and committees</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <UserPlus className="h-5 w-5" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('directors')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'directors'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Board Members
          </button>
          <button
            onClick={() => setActiveTab('committees')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'committees'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Committees
          </button>
          <button
            onClick={() => setActiveTab('succession')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'succession'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Succession Planning
          </button>
        </nav>
      </div>

      {/* Board Members Tab */}
      {activeTab === 'directors' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search board members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="officer">Officers</option>
              <option value="director">Directors</option>
            </select>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">Officers</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {members.filter(m => m.type === 'officer').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">Directors</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {members.filter(m => m.type === 'director').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <span className="text-sm text-gray-600">Expiring Soon</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {members.filter(m => {
                  const termStatus = getTermStatus(m.termEnd);
                  return termStatus.status === 'expiring';
                }).length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-gray-600">Committees</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{committees.length}</p>
            </div>
          </div>

          {/* Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map(member => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      )}

      {/* Committees Tab */}
      {activeTab === 'committees' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Committee Management</h2>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>New Committee</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {committees.map(committee => (
              <CommitteeCard key={committee.id} committee={committee} />
            ))}
          </div>
        </div>
      )}

      {/* Succession Planning Tab */}
      {activeTab === 'succession' && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Succession Planning</h2>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Upcoming Term Expirations</h3>
            
            <div className="space-y-4">
              {members
                .filter(m => {
                  const termStatus = getTermStatus(m.termEnd);
                  return termStatus.status === 'expiring' || termStatus.status === 'expired';
                })
                .map(member => {
                  const termStatus = getTermStatus(member.termEnd);
                  return (
                    <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Clock className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${termStatus.color}`}>
                          {termStatus.label}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Expires: {new Date(member.termEnd).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
            
            {members.filter(m => {
              const termStatus = getTermStatus(m.termEnd);
              return termStatus.status === 'expiring' || termStatus.status === 'expired';
            }).length === 0 && (
              <p className="text-gray-500 text-center py-8">No upcoming term expirations</p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Succession Guidelines</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>• <strong>Three-year term enforcement:</strong> All directors serve staggered three-year terms per bylaw requirements</p>
              <p>• <strong>Vacancy management:</strong> Interim appointments must be confirmed at next board meeting per Section 2.08</p>
              <p>• <strong>Director qualification verification:</strong> All new directors must meet qualification requirements</p>
              <p>• <strong>Committee continuity:</strong> Committee assignments reviewed during succession transitions</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && <AddMemberModal />}
    </div>
  );
};

export default BoardManagement;