import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function NewsGrid({ 
  articles = [],
  showStatusBadge = true
}) {
  // const [articles, setArticles] = useState(articles);
  console.log(`NewsGrid received ${articles.length} initial articles.`);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);


  useEffect(() => {
    if (articles.length > 0) {
      setIsLoading(false);
    }
  }, [articles]);


  useEffect(() => {
    if (articles.length === 0) {
    }
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchArticles(nextPage);
  };

  const toggleExpand = (id) => {
    // setExpandedArticles(prev => ({
    //   ...prev,
    //   [id]: !prev[id]
    // }));
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

                        {/* 
                         */}
                        
                        
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