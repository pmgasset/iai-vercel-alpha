import React, { useState } from 'react';
import { 
  Home, 
  Calendar, 
  FileText, 
  Users, 
  CheckCircle, 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Layout = ({ children, activeModule, onNavigate, user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, description: 'Overview & stats' },
    { id: 'meetings', label: 'Meetings', icon: Calendar, description: 'Schedule & manage' },
    { id: 'documents', label: 'Documents', icon: FileText, description: 'File library' },
    { id: 'board', label: 'Board', icon: Users, description: 'Member management' },
    { id: 'compliance', label: 'Compliance', icon: CheckCircle, description: 'Deadlines & reports' },
  ];

  const NavigationItem = ({ item, mobile = false }) => {
    const Icon = item.icon;
    const isActive = activeModule === item.id;

    return (
      <button
        onClick={() => {
          onNavigate(item.id);
          if (mobile) setSidebarOpen(false);
        }}
        className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
          isActive 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'text-gray-700 hover:bg-gray-100'
        } ${mobile ? 'mb-1' : ''}`}
      >
        <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : 'text-gray-500'}`} />
        <div className="flex-1">
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="px-4 mb-8">
                <h1 className="text-xl font-bold text-gray-900">IntegrateAI Inc.</h1>
                <p className="text-sm text-gray-600">Nonprofit Management</p>
              </div>
              <nav className="px-4 space-y-1">
                {navigationItems.map((item) => (
                  <NavigationItem key={item.id} item={item} mobile={true} />
                ))}
              </nav>
            </div>
            
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center w-full">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.position || 'Administrator'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <div className="hidden sm:flex items-center space-x-4">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="border border-gray-300 rounded-lg px-3 py-2 w-96 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || 'Admin'}
                </span>
                <button
                  onClick={onLogout}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="sm:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout; className={`font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}>
            {item.label}
          </div>
          <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
            {item.description}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex-1 flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">IntegrateAI Inc.</h1>
            <p className="text-sm text-gray-600 mt-1">Nonprofit Management</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <NavigationItem key={item.id} item={item} />
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.position || user?.role || 'Administrator'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-gray-600 opacity-75" onClick={() => setSidebarOpen(false)} />
          <div