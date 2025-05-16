

import { useState, useEffect } from 'react';
import Header from './header';
import Footer from './footer';
import { useRouter } from 'next/navigation';

export default function Homepage() {
  const [url, setUrl] = useState('');
  const [articles, setArticles] = useState([]);
  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (url) {
      // Redirect to the form page and pass the URL as a query parameter
      router.push(`/verify?url=${encodeURIComponent(url)}`);
    }
  };

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch('http://localhost:8080/api/news/articles?page=2&pageSize=9');
        const data = await response.json();
        if (data.success) {
          // Only get first 9 articles
          setArticles(data.articles.slice(0, 9));
        }
      } catch (err) {
        console.error('Error fetching articles:', err);
      }
    }

    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100 to-white">
      <Header />

      {/* Logo and tagline */}
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

      {/* URL Input and Cards */}
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-6xl">
          {/* URL input */}
          <form onSubmit={handleSearchSubmit} className="flex items-center border border-gray-300 rounded px-3 py-2 mb-6">
            <input
              type="url"
              placeholder="Paste URL here"
              className="flex-grow text-base text-gray-700 focus:outline-none"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
                {/* <img src="/search.png" alt="Search Icon" className="ml-2 w-5 h-5" /> */}
                Verify
            </button>
          </form>
          

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <a
                key={article._id || i}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded shadow overflow-hidden hover:shadow-md transition-shadow block"
              >
                <img
                  src={article.imageUrl || `https://www.google.com/s2/favicons?domain=${new URL(article.url).hostname}&sz=64`}
                  alt={`Favicon`}
                  className="w-full h-40 object-cover bg-gray-100"
                />
                <div className="p-4 text-sm text-gray-800">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold text-base line-clamp-2">
                      {article.title}
                    </h3>
                    {article.classification?.status === 'success' && (
                      <span className="text-green-600 text-xs border border-green-600 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-xs mb-2">
                    {(() => {
                      const parsedDate = new Date(article.date);
                      return isNaN(parsedDate)
                        ? String(article.date)
                        : parsedDate.toLocaleDateString();
                    })()}
                  </p>

                  <p className="line-clamp-3">
                    {article.content}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
