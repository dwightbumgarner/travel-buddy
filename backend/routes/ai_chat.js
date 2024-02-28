const express = require('express');
const {
    chatWithAI,
} = require('../controllers/ai_chat');

const aiRouter = express.Router();

aiRouter.post('/chat', chatWithAI);

module.exports = aiRouter;