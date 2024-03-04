const express = require('express');
const {
    getAccessForums,
    addComment,
    addOrUpdateForumRating,
} = require('../controllers/forum');
const { verifyAuthentication } = require('../middlewares/auth');

const forumRouter = express.Router();

forumRouter.get('/forum', verifyAuthentication, getAccessForums);
forumRouter.post('/comment', verifyAuthentication, addComment);
forumRouter.post('/rate', verifyAuthentication, addOrUpdateForumRating);

module.exports = forumRouter;
