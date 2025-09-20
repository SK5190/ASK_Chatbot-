// Configuration file for the frontend application
export const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',
  
  // Debug mode
  DEBUG: import.meta.env.VITE_DEBUG === 'true' || false,
  
  // App Configuration
  APP_NAME: 'Ask-Bot',
  VERSION: '1.0.0',
  
  // UI Configuration
  MAX_MESSAGE_LENGTH: 2000,
  MAX_CHAT_TITLE_LENGTH: 100,
  MESSAGES_PER_PAGE: 50,
  
  // Socket Configuration
  SOCKET_RECONNECT_ATTEMPTS: 5,
  SOCKET_RECONNECT_DELAY: 1000,
};

export default config;

