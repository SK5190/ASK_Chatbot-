import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ChatSidebar from './chat/ChatSidebar';
import ChatInterface from './chat/ChatInterface';
import { Menu, X, Bot, Sun, Moon } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentChat, setCurrentChat] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNewChat = (newChat) => {
    console.log('Dashboard: handleNewChat called with chat:', newChat);
    if (newChat) {
      // Set the new chat as current
      setCurrentChat(newChat);
      
      // Trigger refresh to update sidebar
      setRefreshTrigger(prev => prev + 1);
      
      console.log('New chat set as current:', newChat);
    }
  };

  const handleSelectChat = (chat) => {
    setCurrentChat(chat);
  };

  const handleChatCreated = (chat) => {
    setCurrentChat(chat);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className={`h-screen flex transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className={`absolute inset-0 opacity-75 ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-600'
          }`}></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
      `}>
        <ChatSidebar 
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          currentChat={currentChat}
          refreshTrigger={refreshTrigger}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`shadow-sm px-4 py-3 flex items-center justify-between transition-colors duration-200 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } border-b`}>
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className={`lg:hidden p-2 rounded-md transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="flex items-center ml-2">
              <Bot className={`h-8 w-8 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <h1 className={`ml-2 text-xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Ask-Bot</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                console.log('Toggle button clicked, current theme:', isDarkMode);
                toggleTheme();
              }}
              className={`p-2 rounded-md transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-700' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <div className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Welcome, {user?.fullName?.firstName}! (Dark mode: {isDarkMode ? 'ON' : 'OFF'})
            </div>
            <button
              onClick={logout}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition duration-150 ease-in-out ${
                isDarkMode 
                  ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' 
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Chat Interface */}
        <main className="flex-1 overflow-hidden">
          <ChatInterface 
            currentChat={currentChat}
            onChatCreated={handleChatCreated}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
