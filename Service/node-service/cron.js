// cron-server/index.js
const mongoose = require('mongoose');
const cron = require('node-cron');
const { fetchAndStoreArticles } = require('./controllers/newsController');
const cors = require('cors');
const express = require('express');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});
console.log("MONGODB_URI in CRON server:", process.env.MONGODB_URI);
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
