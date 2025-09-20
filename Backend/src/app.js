const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express')
const app = express()

//Routes
const authRoutes = require('./routes/auth.routes')
const chatRoutes = require('./routes/chat.routes')

//CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

//Using middlewares
app.use(express.json())
app.use(cookieParser())

//Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

//Using routes
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)



module.exports = app;