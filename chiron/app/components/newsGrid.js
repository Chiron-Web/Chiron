import { useState, useEffect } from 'react';

export default function NewsGrid({ 
  initialArticles = [],
  fetchUrl = 'https://chiron-news.onrender.com/news/articles',
  pageSize = 9,
  showStatusBadge = true
}) {
  const [articles, setArticles] = useState(initialArticles);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [expandedArticles, setExpandedArticles] = useState({});

  const fetchArticles = async (pageNum) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${fetchUrl}?page=${pageNum}&pageSize=${pageSize}`);
      const data = await response.json();

      if (data.success && data.articles.length > 0) {
        setArticles(prev => [...prev, ...data.articles]);
        setHasMore(data.articles.length === pageSize); 
        // basically there are no more articles if pageSize [typically 10] articles are not returned
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (initialArticles.length === 0) {
      fetchArticles(page);
    }
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchArticles(nextPage);
  };

  const toggleExpand = (id) => {
    setExpandedArticles(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  function LoadingCD() {
    return (
        <div className="flex items-center justify-center mt-10 mb-10">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
    }


  return (
    <>
        {isLoading ? (
                <LoadingCD />
            ) : (
            <div className="flex items-center justify-center px-18 flex-col">

                <div className='flex flex-left w-full mb-10 mt-5'> 
                    <h4 className="text-2xl font-bold text-sky-950">LATEST HEALTH NEWS</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
                    {articles.map((article, i) => (
                    <div
                        key={article._id || i}
                        className="bg-white rounded shadow overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                    >
                        <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                        >
                        <img
                            src={article.imageUrl || `https://www.google.com/s2/favicons?domain=${new URL(article.url).hostname}&sz=64`}
                            alt={`Favicon`}
                            className={article.imageUrl ? "w-full h-40 object-cover bg-gray-100" : "w-full h-40 object-contain bg-gray-100 items-center justify-center"}
                        />
                        </a>
                        
                        <div className="p-4 text-sm text-gray-800 flex-grow flex flex-col">
                        <div className="flex justify-between items-start mb-1">
                            <a 
                            href={article.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-semibold text-base line-clamp-2 hover:text-blue-600"
                            >
                            {article.title}
                            </a>
                            {showStatusBadge && article.classification?.status === 'success' && (
                            <span className="text-green-600 text-xs border border-green-600 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">
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

                        <p className={`${expandedArticles[article._id] ? '' : 'line-clamp-3'} mb-2`}>
                            {article.content}
                        </p>
                        
                        
                        </div>
                        {article.content && article.content.split(' ').length > 30 && (
                            <button 
                            onClick={() => toggleExpand(article._id || i)}
                            className="text-blue-500 text-xs mt-auto self-start hover:underline"
                            >
                            {/* {expandedArticles[article._id] ? 'Show less' : 'Read more'} */}
                            </button>
                        )}
                    </div>
                    ))}
                </div>

                {hasMore && (
                    <div className="flex justify-center mt-6 mb-10">
                    <button
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Loading...' : 'Load More'}
                    </button>
                    </div>
                )}
            </div>
            )}
    </>
  );
}