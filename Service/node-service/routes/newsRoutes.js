const express = require('express');
const router = express.Router();
const { getPaginatedArticles } = require('../controllers/newsController');

router.get('/articles', getPaginatedArticles);

module.exports = router;
