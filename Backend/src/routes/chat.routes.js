const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const chatController = require('../controllers/chat.controller')

const router = express.Router();

// Get all chats for the authenticated user
router.get('/', authMiddleware.authUser, chatController.getChats)

// Create a new chat
router.post('/', authMiddleware.authUser, chatController.createChat)

// Get messages for a specific chat
router.get('/:chatId/messages', authMiddleware.authUser, chatController.getChatMessages)

// Delete a chat by ID
router.delete('/:chatId', authMiddleware.authUser, chatController.deleteChat)

// Update a chat title by ID
router.patch('/:chatId', authMiddleware.authUser, chatController.updateChat)




module.exports = router;