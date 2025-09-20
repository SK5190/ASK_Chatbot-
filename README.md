# ASK_Chatbot 🤖

A modern, full-stack AI-powered chatbot application built with React, Node.js, and Socket.io. This project provides a seamless chat interface with AI capabilities, user authentication, and real-time messaging.

## ✨ Features

### 🔐 Authentication System
- **User Registration & Login** - Secure user authentication with JWT tokens
- **Protected Routes** - Route protection for authenticated users only
- **Form Validation** - Client-side and server-side validation
- **Password Security** - Secure password handling with bcrypt

### 💬 Chat Interface
- **Real-time Messaging** - Instant message delivery using Socket.io
- **AI Integration** - Powered by AI services for intelligent responses
- **Chat History** - Persistent chat sessions and message history
- **Vector Search** - Advanced vector-based search capabilities
- **Message Management** - Create, read, and manage chat conversations

### 🎨 Modern UI/UX
- **Dark/Light Theme** - Toggle between dark and light modes
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Modern Components** - Built with React and Tailwind CSS
- **Smooth Animations** - Enhanced user experience with transitions
- **Accessibility** - WCAG compliant design patterns

### 🔧 Technical Features
- **RESTful API** - Well-structured backend API endpoints
- **Database Integration** - MongoDB for data persistence
- **Error Handling** - Comprehensive error handling and logging
- **Code Organization** - Clean, modular code structure
- **Environment Configuration** - Secure environment variable management

## 🏗️ Project Structure

```
ASK_Chatbot/
├── Backend/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Custom middlewares
│   │   ├── service/        # Business logic services
│   │   ├── sockets/        # Socket.io configuration
│   │   └── db/            # Database connection
│   ├── package.json
│   └── server.js
├── Frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── auth/      # Authentication components
│   │   │   └── chat/      # Chat interface components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom React hooks
│   │   └── config/        # Configuration files
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ASK_Chatbot.git
   cd ASK_Chatbot
   ```

2. **Install Backend Dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../Frontend
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` files in both Backend and Frontend directories:
   
   **Backend/.env:**
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   AI_API_KEY=your_ai_service_api_key
   NODE_ENV=development
   ```
   
   **Frontend/.env:**
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_SOCKET_URL=http://localhost:5000
   ```

5. **Start the Application**
   
   **Start Backend:**
   ```bash
   cd Backend
   npm start
   ```
   
   **Start Frontend (in a new terminal):**
   ```bash
   cd Frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Chat Endpoints
- `GET /api/chat/conversations` - Get user conversations
- `POST /api/chat/conversations` - Create new conversation
- `GET /api/chat/conversations/:id/messages` - Get conversation messages
- `POST /api/chat/conversations/:id/messages` - Send message

### WebSocket Events
- `message` - Real-time message delivery
- `typing` - Typing indicators
- `user_online` - User online status

## 🛠️ Technologies Used

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.io** - Real-time bidirectional communication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password security
- **CORS Protection** - Cross-origin request security
- **Input Validation** - Server-side validation
- **Environment Variables** - Secure configuration management
- **Protected Routes** - Route-level security

## 🎯 Key Features Explained

### Real-time Communication
The application uses Socket.io for real-time messaging, ensuring instant message delivery and typing indicators.

### AI Integration
Built with AI service integration for intelligent responses and vector-based search capabilities.

### Modern UI/UX
- Responsive design that works on all devices
- Dark/light theme toggle
- Smooth animations and transitions
- Accessibility-first design

### Scalable Architecture
- Modular component structure
- Separation of concerns
- Clean code organization
- Easy to maintain and extend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Socket.io for real-time capabilities
- MongoDB for the flexible database solution

## 📞 Support

If you have any questions or need help, please open an issue or contact the development team.

---

**Happy Chatting! 🚀**
