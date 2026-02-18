const NewsArticle = require('../models/newsArticle');
const fetchGoogleHealthNewsRSS = require('../utils/rssFetcher');
const puppeteer = require('puppeteer');


// Call your classifier API
const classify = async (text) => {
    try {
      const res = await fetch(process.env.CLASSIFIER_URI ? `${process.env.CLASSIFIER_URI}/classify` : 'http://localhost:5000/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
  
      if (!res.ok) throw new Error('Classifier failed');
      return await res.json();
    } catch (err) {
      console.error('Classification error:', err.message);
      return null;
    }
  };

async function fetchAndStoreArticles() {
    const articles = await fetchGoogleHealthNewsRSS();
  
    for (const article of articles) {
      const exists = await NewsArticle.findOne({ url: article.link });
      if (exists) continue;
  
      console.log('Scraping via API:', article.link);
  
      let scraped;
      try {
        const res = await fetch(process.env.SCRAPER_URI ? `${process.env.SCRAPER_URI}/scrape` : 'http://localhost:4000/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: article.link })
        });
  
        if (!res.ok) throw new Error(`Scraper API failed for ${article.link}`);
        scraped = await res.json();
      } catch (err) {
        console.warn(`Failed to fetch from scraper API: ${err.message}`);
        continue;
      }
  
      if (!scraped || !scraped.content) continue;

      const existsWithNewUrl = await NewsArticle.findOne({ url: scraped.url });
      console.log("here is the image url: ", scraped.imageUrl);
      if (existsWithNewUrl) {
        console.log("We are now at the latest news");
        break;
      };
  
      const classification = await classify(scraped.content);
      if (!classification || classification.status !== 'success') {
        console.warn('Skipping due to failed classification:', article.link);
        continue;
      }
  
      await NewsArticle.create({
        url: scraped.url,
        imageUrl: scraped.imageUrl,
        title: scraped.title || article.title,
        author: scraped.author,
        content: scraped.content,
        date: scraped.date || article.pubDate,
        source: article.source,
        scrapedAt: new Date(),
        classifiedAt: new Date(),
        classification
      });
  
      console.log('Stored and classified:', article.title);
    }
}

const getPaginatedArticles = async (req, res) => {
  const page = parseInt(req.query.page || '1');
  const pageSize = parseInt(req.query.pageSize || '10');

  try {
    const articles = await NewsArticle.paginateArticles(page, pageSize);
    res.json({ success: true, page, pageSize, articles });
  } catch (err) {
    console.error('Pagination error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch articles' });
  }
};
  
module.exports = { fetchAndStoreArticles, getPaginatedArticles };
