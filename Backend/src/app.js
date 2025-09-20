const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express')
const app = express()
const path = require('path')

//Routes
const authRoutes = require('./routes/auth.routes')
const chatRoutes = require('./routes/chat.routes')

//CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://ask-chatbot.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

//Using middlewares
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))

//Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

//Using routes
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)

app.get('*name', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})



module.exports = app;