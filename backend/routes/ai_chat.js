const express = require('express');
const {
    chatWithAI,
} = require('../controllers/ai_chat');
const { verifyAuthentication } = require('../middlewares/auth');

const aiRouter = express.Router();

aiRouter.post('/chat', verifyAuthentication, chatWithAI);

module.exports = aiRouter;
