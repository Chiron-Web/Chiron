const mongoose = require('mongoose');

const NewsArticleSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  title: String,
  author: String,
  content: String,
  date: String,
  source: String,
  scrapedAt: { type: Date, default: Date.now },
  classifiedAt: Date,
  classification: {
    authenticity: String,
    news_type: String,
    status: String
  }
});

NewsArticleSchema.statics.paginateArticles = function (page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;
  return this.find()
    .sort({ scrapedAt: -1 }) // latest first
    .skip(skip)
    .limit(pageSize);
};


module.exports = mongoose.model('NewsArticle', NewsArticleSchema);
