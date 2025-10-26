import { useEffect } from 'react';

export default function NewsGrid({ 
  articles = [],
  showStatusBadge = true,
  handleLoadMore,
  isLoading = true,
  hasMore
}) {
  console.log(`NewsGrid received ${articles.length} initial articles.`);
  console.log(`News is loading: ${isLoading}`);

  useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            handleLoadMore();
          }
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 1.0,
        }
      );
  
      if (observerRef.current) {
        observer.observe(observerRef.current);
      }
  
      return () => {
        if (observerRef.current) {
          observer.unobserve(observerRef.current);
        }
      };
    }, []);

  function LoadingCD() {
    return (
        <div className="flex items-center justify-center mt-10 mb-10">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }


  return (
    <>
        
            <div className="flex items-center justify-center px-18 flex-col">
                
                {((!isLoading) && (articles.length <= 0)) ? (
                    <div className='flex items-cente justify-center w-full mb-10 mt-5'> 
                        <h6 className="text-l font-bold text-sky-950 opacity-50">There are no verified news to show</h6>
                    </div>
                ) : (
                    <div className='flex flex-left w-full mb-10 mt-5'> 
                        <h4 className="text-2xl font-bold text-sky-950">LATEST HEALTH NEWS</h4>
                    </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 ">
                    {(articles.length != 0) && articles.map((article, i) => (
                        <div
                            key={`${article._id + i}` || i}
                            className="rounded-md bg-white rounded shadow overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
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
                            
                            <div className="p-4 text-sm text-white flex-grow flex flex-col bg-sky-950">
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

                            <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base font-semibold text-sky-950 bg-[#FFB703] rounded-lg p-2 my-2 hover:bg-[#E69A00] transition-colors w-full text-center block"
                            >
                                Visit Page
                            </a>

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
                {isLoading && (
                    <LoadingCD />
                )}
            

                {!isLoading && hasMore ? (
                    // <div className="flex justify-center mt-6 mb-10">
                    // <button
                    //     onClick={handleLoadMore}
                    //     disabled={isLoading}
                    //     className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    // >
                    //     {isLoading ? 'Loading...' : 'Load More'}
                    // </button>
                    // </div>
                    <div ref={observerRef} className="h-1 mt-20" />
                )
                : (
                    <div className="flex justify-center mt-6 mb-10">
                        <h6 className="text-l font-bold text-sky-950 opacity-50">There are no verified news to load</h6>    
                    </div>
                )
            }
            </div>
       
    </>
  );
}