const express = require('express');
const puppeteer = require('puppeteer');
const Papa = require('papaparse');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());

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

// Scrape single URL
async function scrapeUrl(url, browser) {
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    const contentSelector = '.article-details p';
    await page.waitForSelector(contentSelector, { timeout: 5000 });

    const paragraphs = await page.$$eval(contentSelector, (elements) => {
      return elements.map(el => el.textContent.trim());
    });
    paragraphs.pop();

    return {
      url,
      success: true,
      content: paragraphs.join('\n'),
      error: null
    };
  } catch (error) {
    return {
      url,
      success: false,
      content: null,
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

// Batch processing from CSV
app.post('/api/scrape/batch', async (req, res) => {
  try {
    const { csvFilePath, targetColumn } = req.body;
    
    if (!csvFilePath || !targetColumn) {
      return res.status(400).json({ 
        error: 'csvFilePath and targetColumn are required' 
      });
    }

    const csvFile = fs.readFileSync(csvFilePath, 'utf8');
    const results = await new Promise((resolve, reject) => {
      Papa.parse(csvFile, {
        header: true,
        dynamicTyping: true,
        complete: async (parseResults) => {
          const rows = parseResults.data;
          const processedRows = [];

          await withBrowser(async (browser) => {
            for (const row of rows) {
              const columnValue = row[targetColumn];
              if (!columnValue) continue;

              console.log(`Processing: ${columnValue}`);
              const result = await scrapeUrl(columnValue, browser);
              
              processedRows.push({
                ...row,
                content: result.content,
                scrapeSuccess: result.success,
                scrapeError: result.error
              });

              await delay(2000); // Rate limiting
            }
          });

          resolve(processedRows);
        },
        error: (error) => reject(error)
      });
    });

    // Save updated CSV
    const updatedCsv = Papa.unparse(results, { header: true });
    fs.writeFileSync(csvFilePath, updatedCsv, 'utf8');

    res.json({
      message: 'Batch processing complete',
      processedCount: results.length,
      outputFile: csvFilePath
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Scraping API server running on http://localhost:${port}`);
});