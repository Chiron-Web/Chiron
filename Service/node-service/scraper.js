const express = require('express');
const puppeteer = require('puppeteer');
const Papa = require('papaparse');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Load selector config
const selectorsJSON = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'article_selectors.json'), 'utf-8')
);

// Clean-up selectors for ads, popups, etc.
const selectorsToRemove = [
  '.entry-title', '.em-mod-video', '.anchortext', '.module.ad',
  '.emb-center-well-ad', '.up-show', '.bg-gray-50.border-t.border-b',
  '.ad-wrapper', '.ia-module-container', '.ad', '.module', '.sidebar',
  '.recommended-articles', '.em-mod-slideshow', '.global-container-2',
  '.emb-center-well-ad .default-creative-container', '.instream-related-mod',
  '.default-creative-container', '[data-v-app]',
  '.bg-gray-50', '.border-t.border-b.border-gray-400', '.px-6.py-10'
];

// Extract selectors for a given URL
function getSelectorsForUrl(url) {
  const hostname = new URL(url).hostname.replace('www.', '');
  return selectorsJSON.selectors[hostname] || selectorsJSON.fallback;
}

// Delay function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Error handling wrapper
async function withBrowser(fn) {
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // For Docker/CI environments
    });
    return await fn(browser);
  } finally {
    if (browser) await browser.close();
  }
}

// Main scrape function
// Main scrape function with improved fallback handling
async function scrapeUrl(url, browser) {
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Clean unwanted elements
    await page.evaluate((selectors) => {
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.remove());
      });
    }, selectorsToRemove);

    const hostname = new URL(url).hostname.replace('www.', '');
    const siteSelectors = selectorsJSON.selectors[hostname] || {};
    const fallback = selectorsJSON.fallback;

    // Enhanced evaluation with proper fallback chaining
    const result = await page.evaluate(({ siteSelectors, fallback }) => {
      const evaluateSelector = (type, isContent = false) => {
        // Try site-specific selectors first
        if (siteSelectors[type]) {
          const elements = findElements(siteSelectors[type], isContent);
          if (elements) return elements;
        }

        // Then try fallback selectors
        if (fallback[type]) {
          return findElements(fallback[type], isContent);
        }

        return null;
      };

      const findElements = (selectorConfig, isContent) => {
        const selectorList = Array.isArray(selectorConfig) ? selectorConfig : [selectorConfig];
        
        for (const selector of selectorList) {
          try {
            if (isContent) {
              const elements = Array.from(document.querySelectorAll(selector))
                .map(el => el.innerText.trim())
                .filter(text => text.length > 30);
              
              if (elements.length > 0) {
                return elements.join('\n\n');
              }
            } else {
              const element = document.querySelector(selector);
              if (element && element.innerText.trim().length > 0) {
                return element.innerText.trim();
              }
            }
          } catch (e) {
            console.warn(`Error evaluating selector ${selector}:`, e);
          }
        }
        return null;
      };

      // Get metadata with fallbacks
      const title = document.title || evaluateSelector('title') || findElements(['h1', 'h2']);
      const author = evaluateSelector('author');
      const date = evaluateSelector('date');
      const content = evaluateSelector('content', true);
      const image = (() => {
      const metaImage = document.querySelector('meta[property="og:image"]')?.content 
        || document.querySelector('meta[name="twitter:image"]')?.content;
      const contentImage = document.querySelector('article img, main img')?.src;

      return metaImage || contentImage || null;
    })();

      return {
        title,
        author,
        date,
        content,
        image
      };
    }, { siteSelectors, fallback });

    // Validate results
    if (!result.content) {
      throw new Error(`No content found after evaluating all selectors for ${hostname}`);
    }

    return {
      url,
      success: true,
      ...result,
      image: result.image || null,
      error: null
    };

  } catch (error) {
    return {
      url,
      success: false,
      content: null,
      title: null,
      author: null,
      date: null,
      error: error.message
    };
  } finally {
    await page.close();
  }
}
// API Endpoints

// Single URL scraping
app.post('/api/scrape', async (req, res) => {
  try {
    const { url } = req.body;
    console.log("Processing this URL: ", url);
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const result = await withBrowser(async (browser) => {
      return await scrapeUrl(url, browser);
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Scraping API server running on http://localhost:${port}`);
});