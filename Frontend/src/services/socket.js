import { io } from 'socket.io-client';
import { config } from '../config/config';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(config.SOCKET_URL, {
        withCredentials: true,
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('Connected to server');
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        this.isConnected = false;
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  sendMessage(messagePayload) {
    if (this.socket && this.isConnected) {
      this.socket.emit('ai-message', messagePayload);
    } else {
      console.error('Socket not connected');
    }
  }

  onAIResponse(callback) {
    if (this.socket) {
      this.socket.on('ai-response', callback);
    }
  }

  offAIResponse(callback) {
    if (this.socket) {
      this.socket.off('ai-response', callback);
    }
  }

  getSocket() {
    return this.socket;
  }
}

export default new SocketService();
