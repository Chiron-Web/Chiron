'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useClassification } from './context';
import Header from './header';
import Footer from './footer';

export default function ClassificationForm() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [scraping, setScraping] = useState(false);
  const router = useRouter();

  const { setClassificationResult, setSubmittedText } = useClassification();
  const [articleImage, setArticleImage] = useState(null);
  const [articleCredibilityScore, setArticleCredibilityScore] = useState(null);

  // Get URL from query parameters on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const fetchedUrl = queryParams.get('url');
    if (fetchedUrl) {
      setUrl(fetchedUrl); // Set URL if it exists in the query params
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, url }),
      });

      if (!response.ok) throw new Error('Failed to classify');
      const data = await response.json();
      console.log("Classification: ", data);

      // Include image and credibility in the result
      const enrichedResult = {
        ...data,
        image: articleImage,
        credibilityScore: articleCredibilityScore,
      };

      setClassificationResult(enrichedResult);
      setSubmittedText(text);
      router.push('/results');
    } catch (error) {
      setClassificationResult({ news_type: 'error', error: error.message });
      setSubmittedText(text);
      router.push('/results');
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async () => {
    if (!url) return;
    setScraping(true);

    try {
      const response = await fetch('http://localhost:4000/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      console.log("Scraped: ", data)

      if (data.success && data.content) {
        setText(data.content);
        if (data.image) setArticleImage(data.image);
        if (data.credibilityScore) setArticleCredibilityScore(data.credibilityScore);
      } else {
        alert('Failed to extract content from the URL');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100 to-white">
      <Header />

      <div className="text-center text-gray-700 mt-20 flex items-center justify-center">
        <img
          src="/logo-black.png"
          alt="CHIRON Logo"
          className="w-10 h-10 mr-2"
        />
        <h1 className="text-3xl font-bold">CHIRON</h1>
      </div>
      <p className="text-sm text-center mt-2 text-gray-700">
        Leveraging technology for public health education.
      </p>

      <div className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-4xl">
          {/* URL input + scrape button */}
          <div className="flex items-center space-x-2 mb-3">
            <input
              type="url"
              placeholder="Paste URL here"
              className="flex-grow text-base p-2 border border-gray-300 rounded text-gray-700 focus:outline-none"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              type="button"
              onClick={handleScrape}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              disabled={scraping}
            >
              {scraping ? 'Fetching...' : 'Get Content'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2 mb-2">
            <textarea
              className="w-full p-4 border border-gray-300 rounded resize-none placeholder-gray-400 text-black"
              rows={10}
              placeholder="Paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <div className="flex justify-center items-center space-x-2">
                  <div className="w-4 h-4 border-4 border-t-4 border-white rounded-full animate-spin"></div>
                  <span>Classifying News...</span>
                </div>
              ) : (
                'Classify News'
              )}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
