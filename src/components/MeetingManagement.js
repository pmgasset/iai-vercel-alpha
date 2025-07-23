import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Users, 
  MapPin, 
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Video
} from 'lucide-react';
import api from '../services/api';

const MeetingManagement = ({ meetings: initialMeetings, onMeetingsUpdate }) => {
  const [meetings, setMeetings] = useState(initialMeetings || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNewMeetingModal, setShowNewMeetingModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (initialMeetings) {
      setMeetings(initialMeetings);
    }
  }, [initialMeetings]);

  const loadMeetings = async () => {
    setLoading(true);
    try {
      const response = await api.getMeetings({ status: filter !== 'all' ? filter : undefined });
      setMeetings(response.meetings || []);
      if (onMeetingsUpdate) {
        onMeetingsUpdate(response.meetings || []);
      }
    } catch (err) {
      setError('Failed to load meetings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async (meetingData) => {
    try {
      setLoading(true);
      await api.createMeeting(meetingData);
      await loadMeetings();
      setShowNewMeetingModal(false);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date, time) => {
    const meetingDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let dateStr;
    if (meetingDate.toDateString() === today.toDateString()) {
      dateStr = 'Today';
    } else if (meetingDate.toDateString() === tomorrow.toDateString()) {
      dateStr = 'Tomorrow';
    } else {
      dateStr = meetingDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: meetingDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
    
    return `${dateStr} at ${time}`;
  };

  const getMeetingStatusColor = (meeting) => {
    const meetingDate = new Date(meeting.scheduled_date);
    const now = new Date();
    
    if (meeting.status === 'completed') return 'green';
    if (meeting.status === 'cancelled') return 'red';
    if (meetingDate < now) return 'yellow';
    return 'blue';
  };

  const getMeetingStatusText = (meeting) => {
    const meetingDate = new Date(meeting.scheduled_date);
    const now = new Date();
    
    if (meeting.status === 'completed') return 'Completed';
    if (meeting.status === 'cancelled') return 'Cancelled';
    if (meetingDate < now && meeting.status === 'scheduled') return 'Overdue';
    return 'Scheduled';
  };

  const filteredMeetings = meetings.filter(meeting => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') {
      const meetingDate = new Date(meeting.scheduled_date);
      return meetingDate >= new Date() && meeting.status === 'scheduled';
    }
    return meeting.status === filter;
  });

  const NewMeetingModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      meeting_type: 'regular',
      scheduled_date: '',
      scheduled_time: '',
      location: '',
      meeting_url: ''
    });
    const [formError, setFormError] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormError('');

      // Validate required fields
      if (!formData.title || !formData.scheduled_date || !formData.scheduled_time) {
        setFormError('Please fill in all required fields');
        return;
      }

      // Validate 48-hour notice for special meetings
      if (formData.meeting_type === 'special') {
        const meetingDateTime = new Date(`${formData.scheduled_date}T${formData.scheduled_time}`);
        const now = new Date();
        const hoursUntilMeeting = (meetingDateTime - now) / (1000 * 60 * 60);
        
        if (hoursUntilMeeting < 48) {
          setFormError('Special meetings require at least 48 hours notice per bylaws Section 2.10');
          return;
        }
      }

      await handleCreateMeeting(formData);
    };

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    if (!showNewMeetingModal) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Schedule New Meeting</h3>
            
            {formError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <span className="text-sm text-red-700">{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Regular Board Meeting"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Type
                </label>
                <select 
                  name="meeting_type"
                  value={formData.meeting_type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="regular">Regular Meeting</option>
                  <option value="special">Special Meeting (48hr notice required)</option>
                  <option value="committee">Committee Meeting</option>
                  <option value="annual">Annual Meeting</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="scheduled_date"
                    required
                    value={formData.scheduled_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    name="scheduled_time"
                    required
                    value={formData.scheduled_time}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Conference Room A or 123 Main St"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting URL (Optional)
                </label>
                <input
                  type="url"
                  name="meeting_url"
                  value={formData.meeting_url}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://zoom.us/j/..."
                />
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewMeetingModal(false);
                    setFormError('');
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Creating...' : 'Schedule Meeting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Meeting Management</h2>
          <p className="text-gray-600 mt-1">Schedule and manage board meetings</p>
        </div>
        <button
          onClick={() => setShowNewMeetingModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule Meeting</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Meetings' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'scheduled', label: 'Scheduled' },
            { key: 'completed', label: 'Completed' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Meetings List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {filter === 'all' ? 'All Meetings' : 
             filter === 'upcoming' ? 'Upcoming Meetings' :
             filter.charAt(0).toUpperCase() + filter.slice(1) + ' Meetings'}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredMeetings.length})
            </span>
          </h3>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredMeetings.length > 0 ? (
            <div className="space-y-4">
              {filteredMeetings.map((meeting) => {
                const statusColor = getMeetingStatusColor(meeting);
                const statusText = getMeetingStatusText(meeting);
                
                return (
                  <div
                    key={meeting.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                    onClick={() => setSelectedMeeting(meeting)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{meeting.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            meeting.meeting_type === 'regular' 
                              ? 'bg-blue-100 text-blue-800' 
                              : meeting.meeting_type === 'special'
                              ? 'bg-orange-100 text-orange-800'
                              : meeting.meeting_type === 'annual'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {meeting.meeting_type}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
                            {statusText}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDateTime(meeting.scheduled_date, meeting.scheduled_time)}
                          </div>
                          
                          {meeting.location && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {meeting.location}
                            </div>
                          )}
                          
                          {meeting.meeting_url && (
                            <div className="flex items-center">
                              <Video className="h-4 w-4 mr-1" />
                              <a 
                                href={meeting.meeting_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Join Online
                              </a>
                            </div>
                          )}
                        </div>

                        {meeting.created_by_name && (
                          <p className="text-xs text-gray-500 mt-2">
                            Created by {meeting.created_by_name}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle edit
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' ? 'No meetings found' : `No ${filter} meetings`}
              </h3>
              <p className="text-gray-500 mb-6">
                {filter === 'all' 
                  ? 'Get started by scheduling your first meeting'
                  : `No meetings match the ${filter} filter`
                }
              </p>
              {filter === 'all' && (
                <button
                  onClick={() => setShowNewMeetingModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Schedule First Meeting
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Meeting Details Modal */}
      {selectedMeeting && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedMeeting.title}</h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedMeeting.meeting_type === 'regular' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {selectedMeeting.meeting_type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getMeetingStatusColor(selectedMeeting)}-100 text-${getMeetingStatusColor(selectedMeeting)}-800`}>
                      {getMeetingStatusText(selectedMeeting)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMeeting(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-5 w-5" />
                    <span>{formatDateTime(selectedMeeting.scheduled_date, selectedMeeting.scheduled_time)}</span>
                  </div>
                  
                  {selectedMeeting.location && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="h-5 w-5" />
                      <span>{selectedMeeting.location}</span>
                    </div>
                  )}
                </div>

                {selectedMeeting.meeting_url && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Video className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Online Meeting</span>
                    </div>
                    <a 
                      href={selectedMeeting.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm mt-1 block"
                    >
                      {selectedMeeting.meeting_url}
                    </a>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Meeting Details</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Duration: {selectedMeeting.duration_minutes || 120} minutes</p>
                    <p>Quorum Required: {selectedMeeting.quorum_required || 2} members</p>
                    {selectedMeeting.created_by_name && (
                      <p>Organized by: {selectedMeeting.created_by_name}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setSelectedMeeting(null)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Edit Meeting
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <NewMeetingModal />
    </div>
  );
};

export default MeetingManagement;