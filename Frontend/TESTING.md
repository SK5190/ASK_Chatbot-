# Frontend Testing Guide

## Testing the "New Chat" Button

The "New Chat" button now works with the existing backend API. Here's how to test it:

### 1. Start the Backend Server
```bash
cd Backend
npm run dev
```

### 2. Start the Frontend Server
```bash
cd Frontend
npm run dev
```

### 3. Test the Application

1. **Open** `http://localhost:5173` in your browser
2. **Register** a new account or **login** with existing credentials
3. **Click "New Chat"** button in the sidebar
4. **Type a message** in the input field
5. **Press Enter** to send the message

### Expected Behavior

- ✅ "New Chat" button clears the current chat and shows welcome screen
- ✅ Typing the first message creates a new chat via backend API
- ✅ Chat appears in the sidebar after creation
- ✅ Messages are saved locally and persist between sessions
- ✅ Socket.io connection works for real-time AI responses

## Backend API Usage

The frontend now only uses the existing backend endpoints:

### Available Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `POST /api/chat` - Create new chat

### cURL Commands for Testing

#### 1. Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": {
      "firstName": "Test",
      "lastName": "User"
    },
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

#### 2. Login User
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

#### 3. Create a Chat
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "My Test Chat"
  }'
```

## Local Storage Features

The frontend now includes local storage fallbacks:

- **Chat History**: Stored in `ask-bot-chats` key
- **Messages**: Stored in `ask-bot-messages` key
- **Persistence**: Data survives page refreshes and browser sessions
- **Offline Support**: Works even when backend is not available

## Troubleshooting

### Common Issues

1. **CORS Error**: Make sure backend has CORS configured for `http://localhost:5173`
2. **404 Errors**: Backend only has POST endpoints, GET endpoints are handled locally
3. **Socket Connection**: Ensure backend is running on port 3000
4. **Authentication**: Make sure to login before creating chats

### Debug Mode

Enable debug mode by setting `VITE_DEBUG=true` in your environment variables to see detailed logs.

## Features Working

- ✅ User Authentication (Login/Register)
- ✅ New Chat Creation (via backend API)
- ✅ Real-time Messaging (Socket.io)
- ✅ Chat Management (Local storage)
- ✅ Message Persistence (Local storage)
- ✅ Responsive Design
- ✅ Error Handling
- ✅ Loading States





