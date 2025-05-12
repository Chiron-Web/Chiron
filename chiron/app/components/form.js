'use client';

import { useState } from 'react';

export default function ClassificationForm() {
  const [link, setLink] = useState('');
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [scrapeResult, setScrapeResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('http://localhost:5000/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to classify');
      }

      const data = await response.json();
      setResult(data || 'No result returned');
    } catch (error) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async () => {
    if (!link) return;
    setScraping(true);
    setScrapeResult(null);

    try {
      const response = await fetch('http://localhost:4000/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: link }),
      });

      if (!response.ok) {
        throw new Error('Scraping failed');
      }

      const data = await response.json();
      setScrapeResult(data);
      if (data.content) setText(data.content);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-6">
      {/* Link Input + Scrape Button */}
      <div className="space-y-2">
        <input
          type="url"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Paste article URL here..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <button
          type="button"
          onClick={handleScrape}
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          disabled={scraping}
        >
          {scraping ? 'Fetching Content...' : 'Get Content from URL'}
        </button>
      </div>

      {/* Textarea */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-2 border border-gray-300 rounded"
          rows={8}
          placeholder="Paste news article here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Classifying...' : 'Classify'}
        </button>
      </form>

      {/* Scraped Content Display */}
      {scrapeResult?.success && (
        <div className="p-3 bg-gray-100 border rounded text-sm text-gray-800">
          <strong>Scraped from:</strong> {scrapeResult.url}<br />
          <strong>Preview:</strong>
          <p className="mt-2 whitespace-pre-line">{scrapeResult.content.slice(0, 500)}...</p>
        </div>
      )}

      {/* Classification Result */}
      {result && (
        <div className="p-3 bg-yellow-100 border rounded text-center text-gray-800">
          <strong>News Type:</strong> {result.news_type}<br />
          {result.authenticity && (
            <>
              <strong>Authenticity:</strong> {result.authenticity}<br />
            </>
          )}
        </div>
      )}
    </div>
  );
}
