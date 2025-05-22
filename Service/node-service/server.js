require('dotenv').config();
const mongoose = require('mongoose');
// const cron = require('node-cron');
const express = require('express');
const router = express.Router();
const path = require('path');
const cors = require('cors');
const app = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to MongoDB');
  app.use('/api/news', require('./routes/newsRoutes'));
});


// Start server
app.listen(port, () => {
  console.log(`BACKEND server running on ${port}`);
});

