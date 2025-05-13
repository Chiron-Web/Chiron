const fetch = require('node-fetch');
const { XMLParser } = require('fast-xml-parser');

async function fetchGoogleHealthNewsRSS() {
  const FEED_URL = 'https://news.google.com/rss/search?q=health&hl=en-PH&gl=PH&ceid=PH:en';
  const res = await fetch(FEED_URL);
  const xml = await res.text();
  const parser = new XMLParser();
  const json = parser.parse(xml);
  const items = json.rss.channel.item;

  return items.map(item => ({
    title: item.title,
    link: item.link,
    pubDate: new Date(item.pubDate),
    source: item.source?.['#text'] || 'Unknown'
  }));
}

module.exports = fetchGoogleHealthNewsRSS;
