import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Users, 
  FileText, 
  Plus, 
  Edit3, 
  Save, 
  X, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Copy,
  Download,
  Upload,
  Search,
  Filter,
  MoreVertical,
  UserCheck,
  MessageSquare,
  Paperclip,
  Send,
  Star,
  Eye,
  EyeOff
} from 'lucide-react';

const EnhancedMeetingManagement = () => {
  const [currentView, setCurrentView] = useState('list'); // list, detail, agenda, minutes
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showNewMeetingModal, setShowNewMeetingModal] = useState(false);
  const [showAgendaWizard, setShowAgendaWizard] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Sample data - replace with actual API calls
  useEffect(() => {
    const sampleMeetings = [
      {
        id: 1,
        title: "Board Meeting - Q3 Review",
        meeting_type: "regular",
        scheduled_date: "2025-08-15",
        scheduled_time: "14:00",
        duration_minutes: 120,
        location: "Conference Room A",
        meeting_url: "https://meet.google.com/abc-defg-hij",
        status: "scheduled",
        quorum_required: 3,
        created_by_name: "David Park",
        description: "Quarterly review of organization activities and financial status",
        agenda: {
          id: 1,
          items: [
            { id: 1, title: "Call to Order", type: "procedural", duration: 5, presenter: "David Park", notes: "" },
            { id: 2, title: "Approval of Previous Minutes", type: "approval", duration: 10, presenter: "Emily Rodriguez", notes: "Minutes from June 15, 2025 meeting" },
            { id: 3, title: "Financial Report", type: "report", duration: 20, presenter: "Michael Chen", notes: "Q2 financial summary and budget review" },
            { id: 4, title: "Program Updates", type: "discussion", duration: 30, presenter: "Sarah Johnson", notes: "Review of current AI initiatives and partnerships" },
            { id: 5, title: "New Business", type: "discussion", duration: 45, presenter: "All", notes: "Strategic planning for Q4" },
            { id: 6, title: "Adjournment", type: "procedural", duration: 5, presenter: "David Park", notes: "" }
          ],
          created_by: "David Park",
          created_at: "2025-07-20T10:00:00Z"
        },
        minutes: {
          id: 1,
          attendees: ["David Park", "Emily Rodriguez", "Michael Chen", "Sarah Johnson"],
          absent: [],
          meeting_called_to_order: "2:02 PM",
          meeting_adjourned: null,
          quorum_met: true,
          items: [
            {
              agenda_item_id: 1,
              discussion: "Meeting called to order at 2:02 PM by President David Park.",
              decisions: [],
              action_items: [],
              votes: []
            },
            {
              agenda_item_id: 2,
              discussion: "Minutes from the previous meeting were reviewed.",
              decisions: ["Minutes approved unanimously"],
              action_items: [],
              votes: [{ motion: "Approve June 15, 2025 minutes", in_favor: 4, against: 0, abstain: 0, passed: true }]
            }
          ],
          notes: "",
          created_by: "Emily Rodriguez",
          last_updated: "2025-07-24T15:30:00Z"
        },
        attendees: [
          { id: 1, name: "David Park", role: "President", status: "confirmed" },
          { id: 2, name: "Emily Rodriguez", role: "Secretary", status: "confirmed" },
          { id: 3, name: "Michael Chen", role: "Treasurer", status: "confirmed" },
          { id: 4, name: "Sarah Johnson", role: "Director", status: "pending" }
        ]
      }
    ];
    setMeetings(sampleMeetings);
  }, []);

  const filteredMeetings = meetings.filter(meeting => {
    const matchesFilter = filter === 'all' || meeting.status === filter;
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const AgendaBuilder = ({ meeting, onSave, onCancel }) => {
    const [agendaItems, setAgendaItems] = useState(meeting?.agenda?.items || []);
    const [currentStep, setCurrentStep] = useState(0);
    
    const agendaTemplates = {
      regular: [
        { title: "Call to Order", type: "procedural", duration: 5 },
        { title: "Approval of Previous Minutes", type: "approval", duration: 10 },
        { title: "Financial Report", type: "report", duration: 20 },
        { title: "Committee Reports", type: "report", duration: 30 },
        { title: "Old Business", type: "discussion", duration: 20 },
        { title: "New Business", type: "discussion", duration: 30 },
        { title: "Adjournment", type: "procedural", duration: 5 }
      ],
      special: [
        { title: "Call to Order", type: "procedural", duration: 5 },
        { title: "Statement of Purpose", type: "procedural", duration: 10 },
        { title: "Special Business Item", type: "discussion", duration: 45 },
        { title: "Voting", type: "vote", duration: 15 },
        { title: "Adjournment", type: "procedural", duration: 5 }
      ],
      annual: [
        { title: "Call to Order", type: "procedural", duration: 5 },
        { title: "Approval of Previous Minutes", type: "approval", duration: 10 },
        { title: "Annual Reports", type: "report", duration: 45 },
        { title: "Election of Directors", type: "vote", duration: 30 },
        { title: "Other Business", type: "discussion", duration: 20 },
        { title: "Adjournment", type: "procedural", duration: 5 }
      ]
    };

    const addAgendaItem = () => {
      const newItem = {
        id: Date.now(),
        title: "",
        type: "discussion",
        duration: 15,
        presenter: "",
        notes: ""
      };
      setAgendaItems([...agendaItems, newItem]);
    };

    const updateAgendaItem = (id, field, value) => {
      setAgendaItems(items => items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      ));
    };

    const removeAgendaItem = (id) => {
      setAgendaItems(items => items.filter(item => item.id !== id));
    };

    const loadTemplate = (templateType) => {
      const template = agendaTemplates[templateType] || agendaTemplates.regular;
      const templatedItems = template.map((item, index) => ({
        id: Date.now() + index,
        ...item,
        presenter: "",
        notes: ""
      }));
      setAgendaItems(templatedItems);
      setCurrentStep(1);
    };

    const totalDuration = agendaItems.reduce((sum, item) => sum + (item.duration || 0), 0);

    if (currentStep === 0) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Agenda Wizard</h2>
              <p className="text-gray-600 mt-2">Create an agenda for your meeting using our templates or start from scratch.</p>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Choose a Template</h3>
              <div className="grid gap-4">
                {Object.entries(agendaTemplates).map(([type, template]) => (
                  <div key={type} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer"
                       onClick={() => loadTemplate(type)}>
                    <h4 className="font-medium text-gray-900 capitalize">{type} Meeting</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {template.length} items • ~{template.reduce((sum, item) => sum + item.duration, 0)} minutes
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      {template.slice(0, 3).map(item => item.title).join(" • ")}
                      {template.length > 3 && "..."}
                    </div>
                  </div>
                ))}
                
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer"
                     onClick={() => setCurrentStep(1)}>
                  <h4 className="font-medium text-gray-900">Start from Scratch</h4>
                  <p className="text-sm text-gray-600 mt-1">Create a custom agenda</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t">
              <button onClick={onCancel} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Build Agenda</h2>
                <p className="text-gray-600 mt-1">
                  {meeting?.title} • {new Date(meeting?.scheduled_date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-sm text-gray-600">
                Total Duration: {totalDuration} minutes
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {agendaItems.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-800">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Agenda item title"
                          value={item.title}
                          onChange={(e) => updateAgendaItem(item.id, 'title', e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <select
                          value={item.type}
                          onChange={(e) => updateAgendaItem(item.id, 'type', e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="procedural">Procedural</option>
                          <option value="approval">Approval</option>
                          <option value="report">Report</option>
                          <option value="discussion">Discussion</option>
                          <option value="vote">Vote</option>
                        </select>
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            placeholder="Minutes"
                            value={item.duration}
                            onChange={(e) => updateAgendaItem(item.id, 'duration', parseInt(e.target.value))}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-20"
                            min="1"
                          />
                          <button
                            onClick={() => removeAgendaItem(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Presenter"
                          value={item.presenter}
                          onChange={(e) => updateAgendaItem(item.id, 'presenter', e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Notes or description"
                          value={item.notes}
                          onChange={(e) => updateAgendaItem(item.id, 'notes', e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                onClick={addAgendaItem}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                <Plus className="h-5 w-5 mx-auto mb-2" />
                Add Agenda Item
              </button>
            </div>
          </div>
          
          <div className="flex justify-between p-6 border-t">
            <button
              onClick={() => setCurrentStep(0)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2 inline" />
              Back to Templates
            </button>
            <div className="space-x-3">
              <button onClick={onCancel} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button 
                onClick={() => onSave({ items: agendaItems })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Agenda
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MinutesEditor = ({ meeting, onSave, onCancel }) => {
    const [minutes, setMinutes] = useState(meeting?.minutes || {
      attendees: [],
      absent: [],
      meeting_called_to_order: "",
      meeting_adjourned: "",
      quorum_met: false,
      items: [],
      notes: ""
    });
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [newActionItem, setNewActionItem] = useState({ task: "", assignee: "", due_date: "" });

    const updateMinutesItem = (index, field, value) => {
      setMinutes(prev => ({
        ...prev,
        items: prev.items.map((item, i) => i === index ? { ...item, [field]: value } : item)
      }));
    };

    const addActionItem = (itemIndex) => {
      if (!newActionItem.task) return;
      
      const actionItem = {
        id: Date.now(),
        ...newActionItem,
        created_at: new Date().toISOString()
      };
      
      updateMinutesItem(itemIndex, 'action_items', [
        ...(minutes.items[itemIndex]?.action_items || []),
        actionItem
      ]);
      
      setNewActionItem({ task: "", assignee: "", due_date: "" });
    };

    const addVote = (itemIndex) => {
      const vote = {
        id: Date.now(),
        motion: "",
        in_favor: 0,
        against: 0,
        abstain: 0,
        passed: false
      };
      
      updateMinutesItem(itemIndex, 'votes', [
        ...(minutes.items[itemIndex]?.votes || []),
        vote
      ]);
    };

    const currentAgendaItem = meeting?.agenda?.items?.[currentItemIndex];
    const currentMinutesItem = minutes.items[currentItemIndex] || {
      agenda_item_id: currentAgendaItem?.id,
      discussion: "",
      decisions: [],
      action_items: [],
      votes: []
    };

    if (!currentAgendaItem) {
      return (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No agenda available for this meeting.</p>
          <button onClick={onCancel} className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-700">
            Go Back
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Meeting Minutes</h2>
                <p className="text-gray-600 mt-1">
                  {meeting.title} • {new Date(meeting.scheduled_date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-3">
                <button onClick={onCancel} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button 
                  onClick={() => onSave(minutes)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Minutes
                </button>
              </div>
            </div>
          </div>

          {/* Meeting Info */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Called to Order</label>
                <input
                  type="time"
                  value={minutes.meeting_called_to_order}
                  onChange={(e) => setMinutes(prev => ({ ...prev, meeting_called_to_order: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adjourned</label>
                <input
                  type="time"
                  value={minutes.meeting_adjourned}
                  onChange={(e) => setMinutes(prev => ({ ...prev, meeting_adjourned: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quorum Met</label>
                <select
                  value={minutes.quorum_met}
                  onChange={(e) => setMinutes(prev => ({ ...prev, quorum_met: e.target.value === 'true' }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Present</label>
                <p className="text-sm text-gray-600">{meeting.attendees?.filter(a => a.status === 'confirmed').length || 0} of {meeting.attendees?.length || 0}</p>
              </div>
            </div>
          </div>

          {/* Agenda Items Navigation */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Agenda Items</h3>
              <div className="text-sm text-gray-600">
                {currentItemIndex + 1} of {meeting.agenda.items.length}
              </div>
            </div>
            
            <div className="flex space-x-2 mb-4 overflow-x-auto">
              {meeting.agenda.items.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentItemIndex(index)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                    index === currentItemIndex
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}. {item.title}
                </button>
              ))}
            </div>

            {/* Current Agenda Item */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-900">{currentAgendaItem.title}</h4>
                <span className="text-sm text-blue-700">{currentAgendaItem.duration} min</span>
              </div>
              {currentAgendaItem.presenter && (
                <p className="text-sm text-blue-700">Presenter: {currentAgendaItem.presenter}</p>
              )}
              {currentAgendaItem.notes && (
                <p className="text-sm text-blue-600 mt-1">{currentAgendaItem.notes}</p>
              )}
            </div>
          </div>

          {/* Minutes Content */}
          <div className="p-6 space-y-6">
            {/* Discussion */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discussion & Notes</label>
              <textarea
                value={currentMinutesItem.discussion}
                onChange={(e) => updateMinutesItem(currentItemIndex, 'discussion', e.target.value)}
                placeholder="Record the discussion, key points, and any important details..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
              />
            </div>

            {/* Decisions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Decisions Made</label>
              <div className="space-y-2">
                {(currentMinutesItem.decisions || []).map((decision, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      value={decision}
                      onChange={(e) => {
                        const newDecisions = [...(currentMinutesItem.decisions || [])];
                        newDecisions[index] = e.target.value;
                        updateMinutesItem(currentItemIndex, 'decisions', newDecisions);
                      }}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Decision or resolution..."
                    />
                    <button
                      onClick={() => {
                        const newDecisions = (currentMinutesItem.decisions || []).filter((_, i) => i !== index);
                        updateMinutesItem(currentItemIndex, 'decisions', newDecisions);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newDecisions = [...(currentMinutesItem.decisions || []), ""];
                    updateMinutesItem(currentItemIndex, 'decisions', newDecisions);
                  }}
                  className="px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
                >
                  <Plus className="h-4 w-4 mr-1 inline" />
                  Add Decision
                </button>
              </div>
            </div>

            {/* Action Items */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Action Items</label>
              <div className="space-y-3">
                {(currentMinutesItem.action_items || []).map((action, index) => (
                  <div key={action.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{action.task}</p>
                        <p className="text-sm text-gray-600">Assigned to: {action.assignee}</p>
                        {action.due_date && <p className="text-sm text-gray-600">Due: {new Date(action.due_date).toLocaleDateString()}</p>}
                      </div>
                      <button className="text-red-600 hover:bg-red-50 p-1 rounded">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <input
                    value={newActionItem.task}
                    onChange={(e) => setNewActionItem(prev => ({ ...prev, task: e.target.value }))}
                    placeholder="Action item..."
                    className="md:col-span-2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    value={newActionItem.assignee}
                    onChange={(e) => setNewActionItem(prev => ({ ...prev, assignee: e.target.value }))}
                    placeholder="Assignee"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex space-x-2">
                    <input
                      type="date"
                      value={newActionItem.due_date}
                      onChange={(e) => setNewActionItem(prev => ({ ...prev, due_date: e.target.value }))}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={() => addActionItem(currentItemIndex)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Votes */}
            {currentAgendaItem.type === 'vote' || currentAgendaItem.type === 'approval' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Votes & Motions</label>
                <div className="space-y-3">
                  {(currentMinutesItem.votes || []).map((vote, index) => (
                    <div key={vote.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <input
                          value={vote.motion}
                          onChange={(e) => {
                            const newVotes = [...(currentMinutesItem.votes || [])];
                            newVotes[index] = { ...vote, motion: e.target.value };
                            updateMinutesItem(currentItemIndex, 'votes', newVotes);
                          }}
                          placeholder="Motion or proposal..."
                          className="md:col-span-2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">In Favor</label>
                          <input
                            type="number"
                            value={vote.in_favor}
                            onChange={(e) => {
                              const newVotes = [...(currentMinutesItem.votes || [])];
                              newVotes[index] = { ...vote, in_favor: parseInt(e.target.value) || 0 };
                              updateMinutesItem(currentItemIndex, 'votes', newVotes);
                            }}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Against</label>
                          <input
                            type="number"
                            value={vote.against}
                            onChange={(e) => {
                              const newVotes = [...(currentMinutesItem.votes || [])];
                              newVotes[index] = { ...vote, against: parseInt(e.target.value) || 0 };
                              updateMinutesItem(currentItemIndex, 'votes', newVotes);
                            }}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Abstain</label>
                          <input
                            type="number"
                            value={vote.abstain}
                            onChange={(e) => {
                              const newVotes = [...(currentMinutesItem.votes || [])];
                              newVotes[index] = { ...vote, abstain: parseInt(e.target.value) || 0 };
                              updateMinutesItem(currentItemIndex, 'votes', newVotes);
                            }}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                          />
                        </div>
                        <div className="flex items-end">
                          <select
                            value={vote.passed}
                            onChange={(e) => {
                              const newVotes = [...(currentMinutesItem.votes || [])];
                              newVotes[index] = { ...vote, passed: e.target.value === 'true' };
                              updateMinutesItem(currentItemIndex, 'votes', newVotes);
                            }}
                            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              vote.passed ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                            }`}
                          >
                            <option value="true">Passed</option>
                            <option value="false">Failed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => addVote(currentItemIndex)}
                    className="px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
                  >
                    <Plus className="h-4 w-4 mr-1 inline" />
                    Add Vote
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Navigation */}
          <div className="flex justify-between p-6 border-t">
            <button
              onClick={() => setCurrentItemIndex(Math.max(0, currentItemIndex - 1))}
              disabled={currentItemIndex === 0}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4 mr-2 inline" />
              Previous Item
            </button>
            <button
              onClick={() => setCurrentItemIndex(Math.min(meeting.agenda.items.length - 1, currentItemIndex + 1))}
              disabled={currentItemIndex === meeting.agenda.items.length - 1}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Item
              <ArrowRight className="h-4 w-4 ml-2 inline" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const MeetingDetailView = ({ meeting }) => {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
      { id: 'overview', label: 'Overview', icon: Eye },
      { id: 'agenda', label: 'Agenda', icon: FileText, disabled: !meeting.agenda },
      { id: 'minutes', label: 'Minutes', icon: Edit3, disabled: !meeting.minutes },
      { id: 'attendees', label: 'Attendees', icon: Users }
    ];

    return (
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={() => setCurrentView('list')}
                  className="text-blue-600 hover:text-blue-700 mb-2 flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Meetings
                </button>
                <h1 className="text-2xl font-bold text-gray-900">{meeting.title}</h1>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(meeting.scheduled_date).toLocaleDateString()} at {meeting.scheduled_time}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {meeting.duration_minutes} minutes
                  </div>
                  {meeting.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {meeting.location}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-3">
                {!meeting.agenda && (
                  <button
                    onClick={() => setShowAgendaWizard(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Agenda
                  </button>
                )}
                {meeting.agenda && !meeting.minutes && (
                  <button
                    onClick={() => setCurrentView('minutes')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Start Minutes
                  </button>
                )}
                <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => !tab.disabled && setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : tab.disabled
                        ? 'border-transparent text-gray-400 cursor-not-allowed'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    disabled={tab.disabled}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {activeTab === 'overview' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Meeting Details</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-700">Type</dt>
                      <dd className="text-sm text-gray-900 capitalize">{meeting.meeting_type}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-700">Status</dt>
                      <dd className="text-sm text-gray-900 capitalize">{meeting.status}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-700">Quorum Required</dt>
                      <dd className="text-sm text-gray-900">{meeting.quorum_required} members</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-700">Organized by</dt>
                      <dd className="text-sm text-gray-900">{meeting.created_by_name}</dd>
                    </div>
                    {meeting.description && (
                      <div>
                        <dt className="text-sm font-medium text-gray-700">Description</dt>
                        <dd className="text-sm text-gray-900">{meeting.description}</dd>
                      </div>
                    )}
                  </dl>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600">
                        {meeting.attendees?.length || 0}
                      </div>
                      <div className="text-sm text-blue-600">Attendees</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600">
                        {meeting.agenda?.items?.length || 0}
                      </div>
                      <div className="text-sm text-green-600">Agenda Items</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-600">
                        {meeting.minutes?.items?.reduce((acc, item) => acc + (item.action_items?.length || 0), 0) || 0}
                      </div>
                      <div className="text-sm text-purple-600">Action Items</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-orange-600">
                        {meeting.minutes?.items?.reduce((acc, item) => acc + (item.votes?.length || 0), 0) || 0}
                      </div>
                      <div className="text-sm text-orange-600">Votes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'agenda' && meeting.agenda && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Meeting Agenda</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAgendaWizard(true)}
                    className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
                  >
                    <Edit3 className="h-4 w-4 mr-2 inline" />
                    Edit Agenda
                  </button>
                  <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download className="h-4 w-4 mr-2 inline" />
                    Export
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {meeting.agenda.items.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-800">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.title}</h4>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.type === 'procedural' ? 'bg-gray-100 text-gray-800' :
                              item.type === 'report' ? 'bg-blue-100 text-blue-800' :
                              item.type === 'discussion' ? 'bg-green-100 text-green-800' :
                              item.type === 'vote' ? 'bg-purple-100 text-purple-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {item.type}
                            </span>
                            <span>{item.duration} minutes</span>
                            {item.presenter && <span>Presenter: {item.presenter}</span>}
                          </div>
                          {item.notes && (
                            <p className="text-sm text-gray-600 mt-2">{item.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'minutes' && meeting.minutes && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Meeting Minutes</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setCurrentView('minutes')}
                    className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
                  >
                    <Edit3 className="h-4 w-4 mr-2 inline" />
                    Edit Minutes
                  </button>
                  <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download className="h-4 w-4 mr-2 inline" />
                    Export
                  </button>
                </div>
              </div>
              
              {/* Meeting Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Called to Order</div>
                    <div className="text-lg font-semibold">{meeting.minutes.meeting_called_to_order || 'Not recorded'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Adjourned</div>
                    <div className="text-lg font-semibold">{meeting.minutes.meeting_adjourned || 'In progress'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Quorum</div>
                    <div className={`text-lg font-semibold ${meeting.minutes.quorum_met ? 'text-green-600' : 'text-red-600'}`}>
                      {meeting.minutes.quorum_met ? 'Met' : 'Not Met'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Attendees</div>
                    <div className="text-lg font-semibold">{meeting.minutes.attendees.length}</div>
                  </div>
                </div>
              </div>

              {/* Minutes Items */}
              <div className="space-y-6">
                {meeting.minutes.items.map((item, index) => {
                  const agendaItem = meeting.agenda.items.find(ai => ai.id === item.agenda_item_id);
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        {index + 1}. {agendaItem?.title || 'Agenda Item'}
                      </h4>
                      
                      {item.discussion && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Discussion</h5>
                          <p className="text-sm text-gray-900">{item.discussion}</p>
                        </div>
                      )}
                      
                      {item.decisions && item.decisions.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Decisions</h5>
                          <ul className="list-disc list-inside text-sm text-gray-900 space-y-1">
                            {item.decisions.map((decision, i) => (
                              <li key={i}>{decision}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {item.action_items && item.action_items.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Action Items</h5>
                          <div className="space-y-2">
                            {item.action_items.map((action) => (
                              <div key={action.id} className="bg-blue-50 rounded p-3">
                                <div className="font-medium text-sm">{action.task}</div>
                                <div className="text-xs text-gray-600">
                                  Assigned to: {action.assignee}
                                  {action.due_date && ` • Due: ${new Date(action.due_date).toLocaleDateString()}`}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {item.votes && item.votes.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Votes</h5>
                          <div className="space-y-2">
                            {item.votes.map((vote) => (
                              <div key={vote.id} className="bg-gray-50 rounded p-3">
                                <div className="font-medium text-sm mb-1">{vote.motion}</div>
                                <div className="text-xs text-gray-600">
                                  In Favor: {vote.in_favor} • Against: {vote.against} • Abstain: {vote.abstain}
                                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                                    vote.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {vote.passed ? 'Passed' : 'Failed'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'attendees' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Meeting Attendees</h3>
              <div className="space-y-3">
                {meeting.attendees?.map((attendee) => (
                  <div key={attendee.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-800">
                          {attendee.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{attendee.name}</h4>
                        <p className="text-sm text-gray-600">{attendee.role}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      attendee.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      attendee.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {attendee.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const NewMeetingModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      meeting_type: 'regular',
      scheduled_date: '',
      scheduled_time: '',
      duration_minutes: 120,
      location: '',
      meeting_url: '',
      description: '',
      quorum_required: 3
    });
    const [formError, setFormError] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormError('');

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
          setFormError('Special meetings require 48-hour notice per bylaws');
          return;
        }
      }

      const newMeeting = {
        id: Date.now(),
        ...formData,
        status: 'scheduled',
        created_by_name: 'Current User',
        attendees: []
      };

      setMeetings(prev => [...prev, newMeeting]);
      setShowNewMeetingModal(false);
      setFormData({
        title: '',
        meeting_type: 'regular',
        scheduled_date: '',
        scheduled_time: '',
        duration_minutes: 120,
        location: '',
        meeting_url: '',
        description: '',
        quorum_required: 3
      });
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (!showNewMeetingModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Schedule New Meeting</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {formError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">{formError}</p>
              </div>
            )}
            
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
                placeholder="Enter meeting title"
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
                Duration (minutes)
              </label>
              <input
                type="number"
                name="duration_minutes"
                value={formData.duration_minutes}
                onChange={handleChange}
                min="15"
                max="480"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
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
                placeholder="Conference room, address, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Online Meeting URL
              </label>
              <input
                type="url"
                name="meeting_url"
                value={formData.meeting_url}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Meeting purpose and details..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quorum Required
              </label>
              <input
                type="number"
                name="quorum_required"
                value={formData.quorum_required}
                onChange={handleChange}
                min="1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowNewMeetingModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Schedule Meeting
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Render based on current view
  if (currentView === 'agenda' && selectedMeeting) {
    return (
      <AgendaBuilder
        meeting={selectedMeeting}
        onSave={(agenda) => {
          setMeetings(prev => prev.map(m => 
            m.id === selectedMeeting.id 
              ? { ...m, agenda: { ...agenda, created_by: "Current User", created_at: new Date().toISOString() } }
              : m
          ));
          setCurrentView('detail');
          setShowAgendaWizard(false);
        }}
        onCancel={() => {
          setCurrentView('detail');
          setShowAgendaWizard(false);
        }}
      />
    );
  }

  if (currentView === 'minutes' && selectedMeeting) {
    return (
      <MinutesEditor
        meeting={selectedMeeting}
        onSave={(minutes) => {
          setMeetings(prev => prev.map(m => 
            m.id === selectedMeeting.id 
              ? { ...m, minutes: { ...minutes, created_by: "Current User", last_updated: new Date().toISOString() } }
              : m
          ));
          setCurrentView('detail');
        }}
        onCancel={() => setCurrentView('detail')}
      />
    );
  }

  if (currentView === 'detail' && selectedMeeting) {
    return (
      <>
        <MeetingDetailView meeting={selectedMeeting} />
        {showAgendaWizard && (
          <AgendaBuilder
            meeting={selectedMeeting}
            onSave={(agenda) => {
              setMeetings(prev => prev.map(m => 
                m.id === selectedMeeting.id 
                  ? { ...m, agenda: { ...agenda, created_by: "Current User", created_at: new Date().toISOString() } }
                  : m
              ));
              setShowAgendaWizard(false);
            }}
            onCancel={() => setShowAgendaWizard(false)}
          />
        )}
      </>
    );
  }

  // Main list view
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meeting Management</h1>
          <p className="text-gray-600 mt-1">Schedule meetings, build agendas, and record minutes</p>
        </div>
        <button
          onClick={() => setShowNewMeetingModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Meeting
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search meetings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Meetings</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Meetings List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {filter === 'all' ? 'All Meetings' : 
             filter === 'scheduled' ? 'Scheduled Meetings' :
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
                const meetingDate = new Date(meeting.scheduled_date);
                const now = new Date();
                const isOverdue = meetingDate < now && meeting.status === 'scheduled';
                
                return (
                  <div
                    key={meeting.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedMeeting(meeting);
                      setCurrentView('detail');
                    }}
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
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            meeting.status === 'completed' ? 'bg-green-100 text-green-800' :
                            meeting.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            isOverdue ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {meeting.status === 'completed' ? 'Completed' :
                             meeting.status === 'cancelled' ? 'Cancelled' :
                             isOverdue ? 'Overdue' : 'Scheduled'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {meetingDate.toLocaleDateString()} at {meeting.scheduled_time}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {meeting.duration_minutes} min
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
                              Online
                            </div>
                          )}
                        </div>

                        {meeting.description && (
                          <p className="text-sm text-gray-600 mb-2">{meeting.description}</p>
                        )}

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Quorum: {meeting.quorum_required} required</span>
                          {meeting.agenda && (
                            <span className="flex items-center text-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Agenda ready
                            </span>
                          )}
                          {meeting.minutes && (
                            <span className="flex items-center text-blue-600">
                              <FileText className="h-3 w-3 mr-1" />
                              Minutes recorded
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!meeting.agenda && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMeeting(meeting);
                              setShowAgendaWizard(true);
                              setCurrentView('agenda');
                            }}
                            className="px-3 py-1 text-xs text-blue-600 border border-blue-300 rounded hover:bg-blue-50"
                          >
                            Create Agenda
                          </button>
                        )}
                        {meeting.agenda && !meeting.minutes && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMeeting(meeting);
                              setCurrentView('minutes');
                            }}
                            className="px-3 py-1 text-xs text-green-600 border border-green-300 rounded hover:bg-green-50"
                          >
                            Start Minutes
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add dropdown menu functionality here
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by scheduling your first meeting'}
              </p>
              <button
                onClick={() => setShowNewMeetingModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Schedule Meeting
              </button>
            </div>
          )}
        </div>
      </div>

      <NewMeetingModal />
    </div>
  );
};

export default EnhancedMeetingManagement;