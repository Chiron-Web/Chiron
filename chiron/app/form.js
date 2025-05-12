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
  const router = useRouter();

  const { setClassificationResult, setSubmittedText } = useClassification();

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const response = await fetch('http://localhost:5000/classify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, url }),
        });

        if (!response.ok) throw new Error('Failed to classify');
        const data = await response.json();  // Only declare once here
        console.log(data);  // Check the response data

        setClassificationResult(data);
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100 to-white">
      <Header />

      <div className="text-center text-gray-700 mt-20 flex items-center justify-center">
        <img
          src="/logo-black.png"  // Ensure this is a black logo image
          alt="CHIRON Logo"
          className="w-10 h-10 mr-2"  // Ensure the logo is beside the title
        />
        <h1 className="text-3xl font-bold">CHIRON</h1>
      </div>
      <p className="text-sm text-center mt-2 text-gray-700">Leveraging technology for public health education.</p>

      <div className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-4xl">
          {/* URL input */}
          <div className="flex items-center border border-gray-300 rounded px-3 py-2 mb-3">
            <input
              type="url"
              placeholder="Paste URL here"
              className="w-full text-base text-gray-700 focus:outline-none"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <img src="/search.png" alt="Search Icon" className="ml-2 w-5 h-5" />
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
                <div className="flex justify-center items-center">
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
