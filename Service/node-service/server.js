const path = require('path');
const mongoose = require('mongoose');
// const cron = require('node-cron');
const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});

const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to MongoDB');
  app.use('/news', require('./routes/newsRoutes'));
  app.use("/", (req, res) => {
    res.send("Welcome to the Chiron backend service!");
  });
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
});


// Start server
app.listen(port, () => {
  console.log(`BACKEND server running on ${port}`);
});

