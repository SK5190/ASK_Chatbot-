import React from 'react';
import { Bot, User } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const MessageList = ({ messages }) => {
  const { isDarkMode } = useTheme();
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessage = (content) => {
    // Simple markdown-like formatting
    const codeClass = isDarkMode 
      ? 'bg-gray-700 px-1 py-0.5 rounded text-sm text-white' 
      : 'bg-gray-100 px-1 py-0.5 rounded text-sm text-gray-900';
    
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, `<code class="${codeClass}">$1</code>`)
      .replace(/\n/g, '<br>');
  };

  if (messages.length === 0) {
    return (
      <div className={`h-full flex items-center justify-center ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <div className="text-center">
          <Bot className={`h-12 w-12 mx-auto mb-4 ${
            isDarkMode ? 'text-gray-600' : 'text-gray-300'
          }`} />
          <p>No messages yet. Start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 space-y-6">
      {messages.map((message) => (
        <div
          key={message._id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`flex max-w-3xl ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 ${
                message.role === 'user' ? 'ml-3' : 'mr-3'
              }`}
            >
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                message.role === 'user'
                  ? isDarkMode 
                    ? 'bg-blue-700 text-white' 
                    : 'bg-blue-600 text-white'
                  : isDarkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-100 text-gray-600'
              }`}
            >
              {message.role === 'user' ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </div>
            </div>

            {/* Message Content */}
            <div
              className={`flex-1 ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? isDarkMode 
                      ? 'bg-blue-700 text-white' 
                      : 'bg-blue-600 text-white'
                    : isDarkMode 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div
                  className={`prose prose-sm max-w-none ${
                    isDarkMode ? 'prose-invert' : ''
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: formatMessage(message.content)
                  }}
                />
              </div>
              <div
                className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                } ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                {formatTime(message.createdAt)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;

