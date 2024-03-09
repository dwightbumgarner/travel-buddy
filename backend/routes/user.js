const express = require('express');
const {
  register,
  signin,
  getUsrByToken,
  editUsernameByToken,
} = require('../controllers/user');
const { verifyAuthentication } = require('../middlewares/auth');

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', signin);
userRouter.get('/info', verifyAuthentication, getUsrByToken);
userRouter.post('/edit_name', verifyAuthentication, editUsernameByToken);

module.exports = userRouter;
