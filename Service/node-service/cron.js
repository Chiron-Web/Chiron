// cron-server/index.js
require('dotenv').config();
const mongoose = require('mongoose');
const cron = require('node-cron');
const { fetchAndStoreArticles } = require('./controllers/newsController');
const cors = require('cors');
const express = require('express');
const app = express();

// Middleware
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to MongoDB from CRON server');

  // Initial run
  fetchAndStoreArticles();

  // Schedule to run every hour
  cron.schedule('0 * * * *', fetchAndStoreArticles);
});
