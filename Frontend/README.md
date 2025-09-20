# Ask-Bot Frontend

A modern, responsive React frontend for the Ask-Bot AI chatbot application. Built with React, Tailwind CSS, and Socket.io for real-time communication.

## Features

- 🔐 **Authentication**: User registration and login with JWT tokens
- 💬 **Real-time Chat**: Socket.io integration for instant AI responses
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🎨 **Modern UI**: Clean, professional interface with smooth animations
- 💾 **Chat Management**: Create, edit, and delete chat conversations
- 🔄 **Auto-save**: Conversations are automatically saved
- ⚡ **Fast Performance**: Optimized with React hooks and context

## Tech Stack

- **React 19** - Frontend framework
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Vite** - Build tool

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 3000

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Backend API Endpoints

The frontend communicates with the following backend endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Chat Management
- `POST /api/chat` - Create new chat
- `GET /api/chat` - Get user's chats
- `GET /api/chat/:id` - Get specific chat
- `GET /api/chat/:id/messages` - Get chat messages

### Socket Events
- `ai-message` - Send message to AI
- `ai-response` - Receive AI response

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── chat/
│   │   ├── ChatInterface.jsx
│   │   ├── ChatSidebar.jsx
│   │   ├── MessageList.jsx
│   │   └── MessageInput.jsx
│   ├── Dashboard.jsx
│   └── ProtectedRoute.jsx
├── contexts/
│   └── AuthContext.jsx
├── services/
│   ├── api.js
│   └── socket.js
├── App.jsx
├── main.jsx
└── index.css
```

## Key Components

### AuthContext
Manages user authentication state and provides login/register/logout functions.

### Dashboard
Main application layout with sidebar and chat interface.

### ChatInterface
Handles real-time messaging with AI using Socket.io.

### ChatSidebar
Displays chat history and allows chat management.

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

## Features in Detail

### Authentication
- Secure JWT-based authentication
- Automatic token management with cookies
- Protected routes
- Form validation and error handling

### Chat Interface
- Real-time messaging with Socket.io
- Auto-scrolling message list
- Message formatting (bold, italic, code)
- Typing indicators
- Responsive design

### Chat Management
- Create new chats
- Edit chat titles
- Delete chats
- Chat history sidebar
- Auto-save functionality

## Styling

The application uses Tailwind CSS for styling with:
- Custom color scheme
- Responsive breakpoints
- Smooth animations
- Modern UI components
- Dark/light mode ready (can be extended)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project uses ESLint for code quality and consistency. Run `npm run lint` to check for issues.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.