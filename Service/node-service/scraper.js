const express = require('express');
const puppeteer = require('puppeteer');
const Papa = require('papaparse');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Load selector config
const selectorsJSON = JSON.parse(fs.readFileSync(path.join(__dirname, 'article_selectors.json'), 'utf-8'));

const selectorsToRemove = [
  '.entry-title', '.em-mod-video', '.anchortext', '.module.ad',
  '.emb-center-well-ad', '.up-show', '.bg-gray-50.border-t.border-b',
  '.ad-wrapper', '.ia-module-container', '.ad', '.module', '.sidebar',
  '.recommended-articles', '.em-mod-slideshow', '.global-container-2',
  '.emb-center-well-ad .default-creative-container', '.instream-related-mod',
  '.default-creative-container', '[data-v-app]',
  '.bg-gray-50', '.border-t.border-b.border-gray-400', '.px-6.py-10'
];

let browser = null;

// Lazy initialize and reuse Puppeteer browser
async function initBrowser() {
  if (!browser || !browser.isConnected()) {
    console.log("Launching Puppeteer...");
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: '/usr/bin/google-chrome-stable'
    });
  }
  return browser;
}

async function scrapeUrl(url) {
  const browser = await initBrowser();
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Clean the page
    await page.evaluate((selectors) => {
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.remove());
      });
    }, selectorsToRemove);

    const hostname = new URL(url).hostname.replace('www.', '');
    const siteSelectors = selectorsJSON.selectors[hostname] || {};
    const fallback = selectorsJSON.fallback;

    const result = await page.evaluate(({ siteSelectors, fallback }) => {
      const evaluateSelector = (type, isContent = false) => {
        const findElements = (selectorConfig, isContent) => {
          const selectorList = Array.isArray(selectorConfig) ? selectorConfig : [selectorConfig];
          for (const selector of selectorList) {
            try {
              if (isContent) {
                const matchedElements = Array.from(document.querySelectorAll(selector));
                const textElements = matchedElements.map(el => el.innerText.trim()).filter(t => t.length > 30);
                if (textElements.length > 0) return textElements.join('\n\n');
              }
            } catch (_) {}
          }
          return null;
        };

        if (siteSelectors[type]) {
          const result = findElements(siteSelectors[type], isContent);
          if (result) return result;
        }

        if (fallback[type]) {
          return findElements(fallback[type], isContent);
        }

        return null;
      };

      const isValidContentImage = (img) => {
        return img.src &&
          img.naturalWidth > 300 &&
          img.naturalHeight > 150 &&
          !img.src.match(/(logo|icon|spinner|ad|banner|seal)/i);
      };

      const extractContentImage = () => {
        const allImages = Array.from(document.querySelectorAll('img'));
        let bestImage = { src: null, size: 0 };

        allImages.forEach(img => {
          if (!isValidContentImage(img)) return;
          const size = img.naturalWidth * img.naturalHeight;
          if (size > bestImage.size) {
            bestImage = {
              src: img.src.startsWith('http') ? img.src : new URL(img.src, window.location.href).toString(),
              size
            };
          }
        });

        return bestImage.src;
      };

      const title = document.title || evaluateSelector('title') || null;
      const author = evaluateSelector('author');
      const date = evaluateSelector('date');
      const content = evaluateSelector('content', true);
      const imageUrl = extractContentImage();

      return {
        title,
        author,
        date,
        content,
        imageUrl
      };
    }, { siteSelectors, fallback });

    if (!result.content) throw new Error(`No content found after evaluating selectors for ${hostname}`);

    return {
      success: true,
      url: page.url(),
      ...result,
      image: result.imageUrl || null,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      url,
      title: null,
      author: null,
      date: null,
      content: null,
      image: null,
      error: error.message
    };
  } finally {
    await page.close();
  }
}

// API endpoint: scrape
app.post('/scrape', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Missing URL' });

    console.log('Scraping:', url);
    const result = await scrapeUrl(url);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/status', async (req, res) => {
  try {
    const active = browser && browser.isConnected();
    res.json({
      puppeteer_status: active ? "connected" : "not connected",
      status: "healthy"
    });
  } catch (e) {
    res.status(500).json({ status: "unhealthy", error: e.message });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  if (browser) {
    console.log("Closing Puppeteer...");
    await browser.close();
  }
  process.exit();
});

app.listen(port, () => {
  console.log(`Scraper API running on port ${port}`);
});
