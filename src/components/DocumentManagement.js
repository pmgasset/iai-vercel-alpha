import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Search, 
  Download, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  Calendar,
  User,
  FolderOpen,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';

const DocumentManagement = ({ documents: initialDocuments, onDocumentsUpdate }) => {
  const [documents, setDocuments] = useState(initialDocuments || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    if (initialDocuments) {
      setDocuments(initialDocuments);
    }
  }, [initialDocuments]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (searchTerm) params.search = searchTerm;
      
      const response = await api.getDocuments(params);
      setDocuments(response.documents || []);
      if (onDocumentsUpdate) {
        onDocumentsUpdate(response.documents || []);
      }
    } catch (err) {
      setError('Failed to load documents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm !== '' || categoryFilter !== 'all') {
        loadDocuments();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, categoryFilter]);

  const handleUploadDocument = async (documentData) => {
    try {
      setLoading(true);
      await api.uploadDocument(documentData);
      await loadDocuments();
      setShowUploadModal(false);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) return '📄';
    if (fileType?.includes('image')) return '🖼️';
    if (fileType?.includes('document') || fileType?.includes('word')) return '📝';
    if (fileType?.includes('spreadsheet') || fileType?.includes('excel')) return '📊';
    return '📎';
  };

  const categories = [
    { key: 'all', label: 'All Documents' },
    { key: 'legal', label: 'Legal' },
    { key: 'minutes', label: 'Minutes' },
    { key: 'financial', label: 'Financial' },
    { key: 'policies', label: 'Policies' },
    { key: 'forms', label: 'Forms' },
    { key: 'other', label: 'Other' }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = !searchTerm || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const UploadDocumentModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      category: 'other',
      file_name: '',
      file_size: 0,
      file_type: ''
    });
    const [formError, setFormError] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormError('');

      if (!formData.title || !formData.file_name) {
        setFormError('Please fill in all required fields');
        return;
      }

      await handleUploadDocument(formData);
    };

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFormData({
          ...formData,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          title: formData.title || file.name.replace(/\.[^/.]+$/, "")
        });
      }
    };

    if (!showUploadModal) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Upload Document</h3>
            
            {formError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <span className="text-sm text-red-700">{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File *
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported: PDF, Word, Excel, PowerPoint, Text, Images
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Board Meeting Minutes - January 2025"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="legal">Legal Documents</option>
                  <option value="minutes">Meeting Minutes</option>
                  <option value="financial">Financial Records</option>
                  <option value="policies">Policies & Procedures</option>
                  <option value="forms">Forms & Applications</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Optional description of the document..."
                />
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
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
                  {loading ? 'Uploading...' : 'Upload Document'}
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
          <h2 className="text-2xl font-bold text-gray-900">Document Management</h2>
          <p className="text-gray-600 mt-1">Organize and manage organizational documents</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(({ key, label }) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Documents List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {categoryFilter === 'all' ? 'All Documents' : 
             categories.find(c => c.key === categoryFilter)?.label + ' Documents'}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredDocuments.length})
            </span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredDocuments.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          <span className="text-2xl">{getFileIcon(doc.file_type)}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {doc.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatFileSize(doc.file_size)} • {doc.file_type?.split('/')[1]?.toUpperCase() || 'File'}
                          </div>
                          {doc.description && (
                            <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                              {doc.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        doc.category === 'legal' ? 'bg-red-100 text-red-800' :
                        doc.category === 'minutes' ? 'bg-blue-100 text-blue-800' :
                        doc.category === 'financial' ? 'bg-green-100 text-green-800' :
                        doc.category === 'policies' ? 'bg-purple-100 text-purple-800' :
                        doc.category === 'forms' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      v{doc.version}
                      {doc.is_current_version && (
                        <span className="ml-1 text-xs text-green-600">(current)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(doc.updated_at).toLocaleDateString()}
                      </div>
                      {doc.uploaded_by_name && (
                        <div className="text-xs text-gray-500">
                          by {doc.uploaded_by_name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View document"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Download document"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                          title="Edit document"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete document"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || categoryFilter !== 'all' ? 'No documents found' : 'No documents uploaded'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm 
                  ? `No documents match "${searchTerm}"`
                  : categoryFilter !== 'all'
                  ? `No documents in the ${categories.find(c => c.key === categoryFilter)?.label} category`
                  : 'Upload your first document to get started'
                }
              </p>
              {!searchTerm && categoryFilter === 'all' && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload First Document
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <UploadDocumentModal />
    </div>
  );
};

export default DocumentManagement;