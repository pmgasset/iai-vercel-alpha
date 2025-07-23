import React from 'react';
import { 
  Calendar, 
  Users, 
  FileText, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Activity
} from 'lucide-react';

const Dashboard = ({ dashboardData, onNavigate }) => {
  const stats = dashboardData?.stats || {};
  const organization = dashboardData?.organization || {};
  const upcomingMeetings = dashboardData?.upcomingMeetings || [];
  const recentActivities = dashboardData?.recentActivities || [];

  const StatCard = ({ title, value, icon: Icon, color, description, onClick }) => (
    <div 
      className={`bg-${color}-50 p-6 rounded-xl border border-${color}-100 card-hover cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium text-${color}-600`}>{title}</p>
          <p className={`text-3xl font-bold text-${color}-900 mt-1`}>{value}</p>
          {description && (
            <p className={`text-xs text-${color}-600 mt-1`}>{description}</p>
          )}
        </div>
        <div className={`p-3 bg-${color}-100 rounded-full`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    return timeString ? `${formattedDate} at ${timeString}` : formattedDate;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {organization.name || 'IntegrateAI Inc.'}
            </h1>
            <p className="text-gray-600 mt-1">
              {organization.mission || 'Nonprofit Management Dashboard'}
            </p>
            {organization.ein && (
              <p className="text-sm text-gray-500 mt-1">
                EIN: {organization.ein} • Est. {new Date(organization.formation_date).getFullYear()}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Next Meeting"
          value={stats.nextMeeting ? formatDate(stats.nextMeeting.scheduled_date) : 'None'}
          icon={Calendar}
          color="blue"
          description={stats.nextMeeting ? stats.nextMeeting.title : 'No upcoming meetings'}
          onClick={() => onNavigate('meetings')}
        />
        <StatCard
          title="Active Directors"
          value={stats.activeDirectors || '0'}
          icon={Users}
          color="green"
          description="Board members serving"
          onClick={() => onNavigate('board')}
        />
        <StatCard
          title="Documents"
          value={stats.totalDocuments || '0'}
          icon={FileText}
          color="yellow"
          description="In document library"
          onClick={() => onNavigate('documents')}
        />
        <StatCard
          title="Compliance"
          value={`${stats.compliancePercentage || 0}%`}
          icon={CheckCircle}
          color="purple"
          description="On-time filings"
          onClick={() => onNavigate('compliance')}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Meetings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Upcoming Meetings
              </h3>
              <button
                onClick={() => onNavigate('meetings')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all
              </button>
            </div>
          </div>
          <div className="p-6">
            {upcomingMeetings.length > 0 ? (
              <div className="space-y-4">
                {upcomingMeetings.slice(0, 3).map((meeting) => (
                  <div key={meeting.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {meeting.title}
                      </h4>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDateTime(meeting.scheduled_date, meeting.scheduled_time)}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          meeting.meeting_type === 'regular' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {meeting.meeting_type}
                        </span>
                        {meeting.quorum_met !== undefined && (
                          <span className={`flex items-center text-xs ${
                            meeting.quorum_met ? 'text-green-600' : 'text-amber-600'
                          }`}>
                            {meeting.quorum_met ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <AlertCircle className="h-3 w-3 mr-1" />
                            )}
                            {meeting.quorum_met ? 'Quorum met' : 'Quorum needed'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">No upcoming meetings scheduled</p>
                <button
                  onClick={() => onNavigate('meetings')}
                  className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Schedule a meeting
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-600" />
              Recent Activity
            </h3>
          </div>
          <div className="p-6">
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.slice(0, 5).map((activity, index) => (
                  <div key={activity.id || index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Activity className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.user_name && `${activity.user_name} • `}
                        {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('meetings')}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
          >
            <Calendar className="h-6 w-6 text-gray-400 group-hover:text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900 group-hover:text-blue-900">Schedule Meeting</h4>
            <p className="text-sm text-gray-500 mt-1">Create new board meeting</p>
          </button>
          <button
            onClick={() => onNavigate('documents')}
            className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group"
          >
            <FileText className="h-6 w-6 text-gray-400 group-hover:text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900 group-hover:text-green-900">Upload Document</h4>
            <p className="text-sm text-gray-500 mt-1">Add to document library</p>
          </button>
          <button
            onClick={() => onNavigate('compliance')}
            className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors group"
          >
            <CheckCircle className="h-6 w-6 text-gray-400 group-hover:text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900 group-hover:text-purple-900">Check Compliance</h4>
            <p className="text-sm text-gray-500 mt-1">Review deadlines</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;