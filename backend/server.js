const express = require('express');
const cors = require('cors');
require('dotenv').config();

const FirebaseSingleton = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

const db = FirebaseSingleton.getInstance().getDatabase();

// Init Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
