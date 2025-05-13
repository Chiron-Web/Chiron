require('dotenv').config();
const mongoose = require('mongoose');
// const cron = require('node-cron');
const express = require('express');
const router = express.Router();
const path = require('path');
const cors = require('cors');
const app = express();
const { fetchAndStoreArticles, getPaginatedArticles } = require('./controllers/newsController');
const port = 6000;

// Middleware
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  app.use('/api/news', require('./routes/newsRoutes'));

  // fetchAndStoreArticles(); // Run once
  // // Every hour
  // cron.schedule('0 * * * *', fetchAndStoreArticles);


});


// Start server
app.listen(port, () => {
  console.log(`BACKEND server running on http://localhost:${port}`);
});

