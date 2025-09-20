import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { chatAPI } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import socketService from '../../services/socket';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import LoadingSpinner from '../LoadingSpinner';
import useLocalStorage from '../../hooks/useLocalStorage';

const ChatInterface = ({ currentChat, onChatCreated }) => {
  const { isDarkMode } = useTheme();
  const [localMessages, setLocalMessages] = useLocalStorage('ask-bot-messages', {});
  const [localChats, setLocalChats] = useLocalStorage('ask-bot-chats', []);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [chatTitle, setChatTitle] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Connect to socket when component mounts
    socketService.connect();
    
    // Set up AI response listener
    socketService.onAIResponse(handleAIResponse);

    return () => {
      socketService.offAIResponse(handleAIResponse);
    };
  }, []);

  useEffect(() => {
    console.log('ChatInterface: currentChat changed to:', currentChat);
    if (currentChat) {
      loadChatMessages(currentChat._id);
      setChatTitle(currentChat.title);
    } else {
      setMessages([]);
      setChatTitle('');
    }
  }, [currentChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


  const loadChatMessages = async (chatId) => {
    try {
      setLoading(true);
      
      // First try to fetch from API
      const response = await chatAPI.getChatMessages(chatId);
      
      if (response.data && response.data.messages) {
        const apiMessages = response.data.messages;
        setMessages(apiMessages);
        
        // Update localStorage with API data
        setLocalMessages(prev => ({
          ...prev,
          [chatId]: apiMessages
        }));
        
        console.log('Messages loaded from API:', apiMessages.length);
      } else {
        // Fallback to localStorage if API fails
        console.log('API failed, using localStorage fallback');
        const localChatMessages = localMessages[chatId] || [];
        setMessages(localChatMessages);
      }
    } catch (error) {
      console.error('Error loading messages from API:', error);
      // Fallback to localStorage
      console.log('Using localStorage fallback due to API error');
      const localChatMessages = localMessages[chatId] || [];
      setMessages(localChatMessages);
    } finally {
      setLoading(false);
    }
  };

  const handleAIResponse = (response) => {
    const newMessage = {
      _id: Date.now().toString(),
      content: response.content,
      role: 'model',
      createdAt: new Date().toISOString(),
      chat: response.chat
    };
    
    setMessages(prev => {
      const updatedMessages = [...prev, newMessage];
      // Update local storage
      setLocalMessages(prevStorage => ({
        ...prevStorage,
        [response.chat]: updatedMessages
      }));
      return updatedMessages;
    });
    setSending(false);
  };

  const handleSendMessage = async (content) => {
    if (!content.trim() || sending) return;

    let chatId = currentChat?._id;

    // If no current chat, create a new one using the existing backend endpoint
    if (!chatId) {
      try {
        const response = await chatAPI.createChat('New Chat');
        chatId = response.data.chat._id;
        setChatTitle(response.data.chat.title);
        onChatCreated(response.data.chat);
        
        // Add the new chat to local storage
        const newChat = {
          _id: response.data.chat._id,
          title: response.data.chat.title,
          lastActivity: response.data.chat.lastActivity,
          user: response.data.chat.user
        };
        setLocalChats(prev => [newChat, ...prev]);
      } catch (error) {
        console.error('Error creating chat:', error);
        // If backend fails, create a temporary chat for better UX
        const tempChat = {
          _id: `temp_${Date.now()}`,
          title: 'New Chat',
          lastActivity: new Date().toISOString(),
          user: 'temp'
        };
        chatId = tempChat._id;
        setChatTitle(tempChat.title);
        onChatCreated(tempChat);
        
        // Add to local storage
        setLocalChats(prev => [tempChat, ...prev]);
      }
    }

    // Add user message to UI
    const userMessage = {
      _id: Date.now().toString(),
      content,
      role: 'user',
      createdAt: new Date().toISOString(),
      chat: chatId
    };

    setMessages(prev => {
      const updatedMessages = [...prev, userMessage];
      // Update local storage
      setLocalMessages(prevStorage => ({
        ...prevStorage,
        [chatId]: updatedMessages
      }));
      return updatedMessages;
    });
    setSending(true);

    // Send message via socket
    socketService.sendMessage({
      chat: chatId,
      content
    });
  };

  if (!currentChat && messages.length === 0) {
    return (
      <div className={`h-full flex items-center justify-center transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center max-w-md mx-auto px-4">
          <div className={`mx-auto h-20 w-20 rounded-full flex items-center justify-center mb-6 ${
            isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'
          }`}>
            <Bot className={`h-10 w-10 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
          </div>
          <h2 className={`text-2xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome to Ask-Bot
          </h2>
          <p className={`mb-8 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Click "New Chat" to start a conversation. I'm here to help you with any questions you might have!
          </p>
          <div className={`space-y-2 text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <p>• Ask me anything you'd like to know</p>
            <p>• I can help with explanations, creative tasks, and more</p>
            <p>• Your conversations are saved automatically</p>
          </div>
        </div>
      </div>
    );
  }

  // Show welcome screen for new chat that's been created but has no messages yet
  if (currentChat && messages.length === 0) {
    return (
      <div className={`h-full flex flex-col transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Chat Header */}
        <div className={`px-6 py-4 border-b ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
          <h2 className={`text-lg font-semibold truncate ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {chatTitle}
          </h2>
        </div>

        {/* Welcome Content */}
        <div className={`flex-1 flex items-center justify-center ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          <div className="text-center max-w-md mx-auto px-4">
            <div className={`mx-auto h-20 w-20 rounded-full flex items-center justify-center mb-6 ${
              isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'
            }`}>
              <Bot className={`h-10 w-10 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              New Chat Started!
            </h2>
            <p className={`mb-8 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              I'm ready to help you! Type your message below to start our conversation.
            </p>
            <div className={`space-y-2 text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <p>• Ask me anything you'd like to know</p>
              <p>• I can help with explanations, creative tasks, and more</p>
              <p>• This conversation will be saved automatically</p>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className={`border-t ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
          <MessageInput 
            onSendMessage={handleSendMessage}
            disabled={sending}
          />
          {sending && (
            <div className={`px-6 py-3 text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span>Ask-Bot is typing...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      {/* Chat Header */}
      {currentChat && (
        <div className={`px-6 py-4 border-b ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
          <h2 className={`text-lg font-semibold truncate ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {chatTitle}
          </h2>
        </div>
      )}

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner text="Loading messages..." />
          </div>
        ) : (
          <>
            <MessageList messages={messages} />
            {sending && (
              <div className="px-6 py-4">
                <div className={`flex items-center space-x-3 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <Bot className={`h-4 w-4 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`} />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm">Ask-Bot is typing...</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className={`border-t ${
        isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <MessageInput 
          onSendMessage={handleSendMessage}
          disabled={sending}
        />
        {sending && (
          <div className={`px-6 py-3 text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span>Ask-Bot is typing...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
