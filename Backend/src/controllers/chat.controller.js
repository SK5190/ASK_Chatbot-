const chatModel = require('../models/chat.model');
const messageModel = require('../models/message.model');
const { create } = require('../models/user.model');

async function createChat(req, res){
    const {title} = req.body;
    const user = req.user;

    const chat = await chatModel.create({
        user: user._id,
        title
    })

    res.status(201).json({
        message: "Chat created successfully",
        chat:{
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            user: chat.user
        }
    })
}

async function deleteChat(req, res){
    try {
        const { chatId } = req.params;
        const user = req.user;

        // Find the chat and verify ownership
        const chat = await chatModel.findOne({ _id: chatId, user: user._id });
        
        if (!chat) {
            return res.status(404).json({
                message: "Chat not found or you don't have permission to delete it"
            });
        }

        // Delete the chat
        await chatModel.findByIdAndDelete(chatId);

        res.status(200).json({
            message: "Chat deleted successfully",
            chatId: chatId
        });
    } catch (error) {
        console.error('Error deleting chat:', error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function updateChat(req, res){
    try {
        const { chatId } = req.params;
        const { title } = req.body;
        const user = req.user;

        // Validate title
        if (!title || title.trim().length === 0) {
            return res.status(400).json({
                message: "Title is required and cannot be empty"
            });
        }

        // Find the chat and verify ownership
        const chat = await chatModel.findOne({ _id: chatId, user: user._id });
        
        if (!chat) {
            return res.status(404).json({
                message: "Chat not found or you don't have permission to update it"
            });
        }

        // Update the chat title
        const updatedChat = await chatModel.findByIdAndUpdate(
            chatId,
            { 
                title: title.trim(),
                lastActivity: new Date()
            },
            { new: true }
        );

        res.status(200).json({
            message: "Chat updated successfully",
            chat: {
                _id: updatedChat._id,
                title: updatedChat.title,
                lastActivity: updatedChat.lastActivity,
                user: updatedChat.user
            }
        });
    } catch (error) {
        console.error('Error updating chat:', error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function getChats(req, res){
    try {
        const user = req.user;
        
        // Get all chats for the user, sorted by lastActivity (newest first)
        const chats = await chatModel.find({ user: user._id })
            .sort({ lastActivity: -1 })
            .select('_id title lastActivity user createdAt updatedAt');

        res.status(200).json({
            message: "Chats retrieved successfully",
            chats: chats
        });
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function getChatMessages(req, res){
    try {
        const { chatId } = req.params;
        const user = req.user;

        // Verify chat ownership
        const chat = await chatModel.findOne({ _id: chatId, user: user._id });
        if (!chat) {
            return res.status(404).json({
                message: "Chat not found or you don't have permission to access it"
            });
        }

        // Get all messages for the chat, sorted by createdAt (oldest first)
        const messages = await messageModel.find({ chat: chatId })
            .sort({ createdAt: 1 })
            .select('_id content role createdAt updatedAt');

        res.status(200).json({
            message: "Messages retrieved successfully",
            chat: {
                _id: chat._id,
                title: chat.title,
                lastActivity: chat.lastActivity
            },
            messages: messages
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
    createChat,
    deleteChat,
    updateChat,
    getChats,
    getChatMessages
}