const express = require('express');
const cors = require('cors');
require('dotenv').config();

const FirebaseSingleton = require('./third_party/db');
const GCPLandmarkSingleton = require('./third_party/google_lens');

const app = express();
const PORT = process.env.PORT || 5000;

FirebaseSingleton.getInstance().getDatabase();
GCPLandmarkSingleton.getInstance();

// Init Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', require('./routes/user'));
app.use('/api/landmark', require('./routes/landmark_detection'));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
