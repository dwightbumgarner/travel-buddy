const express = require('express');
const {
    chatWithAI,
    endChat,
} = require('../controllers/ai_chat');
const { verifyAuthentication } = require('../middlewares/auth');

const aiRouter = express.Router();

aiRouter.post('/chat', chatWithAI);
aiRouter.post('/end', endChat);

module.exports = aiRouter;