const express = require('express');
const cors = require('cors');
require('dotenv').config();

const FirebaseSingleton = require('./config/db');
const OpenAIAPISingleton = require('./third_party/chatgpt')

const app = express();
const PORT = process.env.PORT || 5000;

FirebaseSingleton.getInstance().getDatabase();
OpenAIAPISingleton.getInstance();

// Init Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', require('./routes/user'));
app.use('/api/ai', require('./routes/ai_chat'));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
