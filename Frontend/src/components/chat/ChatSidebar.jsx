import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, Trash2, Edit3 } from 'lucide-react';
import { chatAPI } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingSpinner from '../LoadingSpinner';
import useLocalStorage from '../../hooks/useLocalStorage';

const ChatSidebar = ({ onNewChat, onSelectChat, currentChat, refreshTrigger }) => {
  console.log('ChatSidebar rendering with props:', { onNewChat, onSelectChat, currentChat, refreshTrigger });
  const { isDarkMode } = useTheme();
  const [localChats, setLocalChats] = useLocalStorage('ask-bot-chats', []);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingChat, setEditingChat] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [updatingChat, setUpdatingChat] = useState(null);
  const [deletingChat, setDeletingChat] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchChats();
  }, []);

  // Refresh chats when local storage changes
  useEffect(() => {
    setChats(localChats);
  }, [localChats]);

  // Refresh chats when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger) {
      fetchChats();
    }
  }, [refreshTrigger]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      
      // First try to fetch from API
      const response = await chatAPI.getChats();
      
      if (response.data && response.data.chats) {
        const apiChats = response.data.chats;
        setChats(apiChats);
        setLocalChats(apiChats); // Update localStorage with API data
        console.log('Chats loaded from API:', apiChats.length);
      } else {
        // Fallback to localStorage if API fails
        console.log('API failed, using localStorage fallback');
        setChats(localChats);
      }
    } catch (error) {
      console.error('Error fetching chats from API:', error);
      // Fallback to localStorage
      console.log('Using localStorage fallback due to API error');
      setChats(localChats);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    console.log('New Chat button clicked!');
    setShowNewChatModal(true);
    setNewChatTitle('');
  };

  const handleCreateNewChat = async () => {
    if (!newChatTitle.trim()) {
      alert('Please enter a chat title');
      return;
    }

    try {
      // Create chat via API
      const response = await chatAPI.createChat(newChatTitle.trim());
      const newChat = response.data.chat;
      
      // Add to local storage
      const updatedChats = [newChat, ...localChats];
      setLocalChats(updatedChats);
      
      // Close modal and call parent handler
      setShowNewChatModal(false);
      setNewChatTitle('');
      
      if (onNewChat) {
        onNewChat(newChat);
      }
      
      console.log('New chat created:', newChat);
    } catch (error) {
      console.error('Error creating new chat:', error);
      alert('Failed to create new chat. Please try again.');
    }
  };

  const handleCancelNewChat = () => {
    setShowNewChatModal(false);
    setNewChatTitle('');
  };

  const handleSelectChat = (chat) => {
    onSelectChat(chat);
  };

  const handleEditChat = (chat, e) => {
    e.stopPropagation();
    setEditingChat(chat._id);
    setEditTitle(chat.title);
    setError(''); // Clear any previous errors
  };

  const handleCancelEdit = () => {
    setEditingChat(null);
    setEditTitle('');
    setError('');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      setError('Chat title cannot be empty');
      return;
    }

    setUpdatingChat(editingChat);
    setError('');

    try {
      // Update chat title on backend
      const response = await chatAPI.updateChat(editingChat, editTitle.trim());
      
      if (response.data && response.data.chat) {
        const updatedChats = chats.map(chat => 
          chat._id === editingChat 
            ? { 
                ...chat, 
                title: response.data.chat.title, 
                lastActivity: response.data.chat.lastActivity 
              }
            : chat
        );

        // Update local state
        setChats(updatedChats);
        setLocalChats(updatedChats);
        setEditingChat(null);
        setEditTitle('');
        
        console.log('Chat title updated successfully');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating chat title:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update chat title. Please try again.';
      setError(errorMessage);
    } finally {
      setUpdatingChat(null);
    }
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    
    // More professional confirmation dialog
    const chatToDelete = chats.find(chat => chat._id === chatId);
    const chatTitle = chatToDelete ? chatToDelete.title : 'this chat';
    
    if (!window.confirm(`Are you sure you want to delete "${chatTitle}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingChat(chatId);
    setError('');

    try {
      // Delete chat from backend
      const response = await chatAPI.deleteChat(chatId);
      
      if (response.data) {
        const updatedChats = chats.filter(chat => chat._id !== chatId);

        // Update local state
        setChats(updatedChats);
        setLocalChats(updatedChats);
        
        // If this was the current chat, clear it
        if (currentChat && currentChat._id === chatId) {
          onSelectChat(null);
        }
        
        console.log('Chat deleted successfully');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete chat. Please try again.';
      setError(errorMessage);
    } finally {
      setDeletingChat(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`h-full flex flex-col transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <button
          onClick={handleNewChat}
          className={`w-full flex items-center justify-center px-4 py-3 text-white rounded-lg transition duration-150 ease-in-out cursor-pointer ${
            isDarkMode 
              ? 'bg-blue-700 hover:bg-blue-600' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          type="button"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Chat
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className={`mx-4 mt-4 p-3 rounded-lg border ${
          isDarkMode 
            ? 'bg-red-900/20 border-red-800 text-red-400' 
            : 'bg-red-50 border-red-200 text-red-600'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-sm">{error}</span>
            <button
              onClick={() => setError('')}
              className={`ml-2 text-lg leading-none ${
                isDarkMode ? 'hover:text-red-300' : 'hover:text-red-500'
              }`}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4">
            <LoadingSpinner text="Loading chats..." />
          </div>
        ) : chats.length === 0 ? (
          <div className={`p-4 text-center ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <MessageSquare className={`h-12 w-12 mx-auto mb-3 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-300'
            }`} />
            <p>No chats yet</p>
            <p className="text-sm">Start a new conversation!</p>
          </div>
        ) : (
          <div className="p-2">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => handleSelectChat(chat)}
                className={`group relative p-3 rounded-lg cursor-pointer transition duration-150 ease-in-out ${
                  currentChat && currentChat._id === chat._id
                    ? isDarkMode 
                      ? 'bg-blue-900/30 border border-blue-700' 
                      : 'bg-blue-50 border border-blue-200'
                    : isDarkMode 
                      ? 'hover:bg-gray-700' 
                      : 'hover:bg-gray-50'
                }`}
              >
                {editingChat === chat._id ? (
                  <form onSubmit={handleSaveEdit} className="relative">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      disabled={updatingChat === chat._id}
                      className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                        isDarkMode 
                          ? 'border-gray-600 bg-gray-700 text-white' 
                          : 'border-gray-300 bg-white text-gray-900'
                      }`}
                      autoFocus
                      onBlur={(e) => {
                        // Only save if the new target is not a button or the input itself
                        if (!e.relatedTarget || e.relatedTarget.type !== 'button') {
                          handleSaveEdit(e);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          handleCancelEdit();
                        }
                      }}
                    />
                    {updatingChat === chat._id && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                  </form>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-sm font-medium truncate ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {chat.title}
                        </h3>
                        <p className={`text-xs mt-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {formatDate(chat.lastActivity)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <button
                          onClick={(e) => handleEditChat(chat, e)}
                          disabled={updatingChat === chat._id || deletingChat === chat._id}
                          className={`p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed ${
                            isDarkMode 
                              ? 'text-gray-400 hover:text-gray-300' 
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                          title="Edit chat title"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteChat(chat._id, e)}
                          disabled={updatingChat === chat._id || deletingChat === chat._id}
                          className={`p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed ${
                            isDarkMode 
                              ? 'text-gray-400 hover:text-red-400' 
                              : 'text-gray-400 hover:text-red-600'
                          }`}
                          title="Delete chat"
                        >
                          {deletingChat === chat._id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-500"></div>
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className={`fixed inset-0 flex items-center justify-center z-50 ${
          isDarkMode ? 'bg-black bg-opacity-70' : 'bg-black bg-opacity-50'
        }`}>
          <div className={`rounded-lg p-6 w-96 max-w-md mx-4 transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Create New Chat
            </h3>
            <div className="mb-4">
              <label htmlFor="chatTitle" className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Chat Title
              </label>
              <input
                id="chatTitle"
                type="text"
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
                placeholder="Enter chat title..."
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateNewChat();
                  } else if (e.key === 'Escape') {
                    handleCancelNewChat();
                  }
                }}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelNewChat}
                className={`px-4 py-2 text-sm font-medium rounded-md transition duration-150 ease-in-out ${
                  isDarkMode 
                    ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' 
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewChat}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md transition duration-150 ease-in-out ${
                  isDarkMode 
                    ? 'bg-blue-700 hover:bg-blue-600' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Create Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
