// cron-server/index.js
const path = require('path');
const mongoose = require('mongoose');
const cron = require('node-cron');
const { fetchAndStoreArticles } = require('../controllers/newsController');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB from CRON server');

  // Initial run
  fetchAndStoreArticles();

  // Schedule to run every hour
  cron.schedule('0 * * * *', fetchAndStoreArticles);
});
