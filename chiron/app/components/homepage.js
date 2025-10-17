import { useState, useRef, useEffect } from 'react';
import Header from './header';
import Footer from './footer';
import { useRouter } from 'next/navigation';
import NewsGrid from './newsGrid';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticles, setIsArticleLoading, incrementPage } from '../redux/articles/articles';

const delay = (timeoutTime) => {
  setTimeout(() => {

  }, timeoutTime);
}

export default function Homepage() {
  const FETCH_ARTICLE_URL = 'https://chiron-news.onrender.com/news/articles';
  const [storedArticles, setStoredArticles] = useState([]);
  const PAGE_SIZE = 9;
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [showNews, setShowNews] = useState(false);
  const observerRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { page, articles, hasMore, isArticleLoading } = useSelector(
    state => state.articles
  );
  const { isUrlTab, setIsUrlTab } = useState(true);

  useEffect(() => {
    // fetch page 1 on mount
    dispatch(fetchArticles({ pageNum: page, fetchUrl: FETCH_ARTICLE_URL, pageSize: PAGE_SIZE }));
    console.log("articles fetched on mount", articles.length);
  }, [dispatch, page]);


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (url) {
      router.push(`/verify?url=${encodeURIComponent(url)}`);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowNews(true);
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

  const handleLoadMore = async () => {
    dispatch(setIsArticleLoading(true));
    delay(2000);
    dispatch(incrementPage()); // increment page will trigger the useEffect hook to refresh
    
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100 to-white">
      <Header />
      <div className='landing-body h-screen w-full flex flex-grow flex-col py-20'>
        <div className='w-full items-center justify-center'>
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
        </div>
        

        <div className="flex-grow flex items-center justify-center px-4">
          <div className="w-full max-w-6xl">
            <div className='w-4/5'>
              <button className="w-1/2 px-4 py-2 bg-sky-950 text-white rounded cursor-pointer" onClick={() => {setIsUrlTab(true)}}>
                URL
              </button>
              <button className="w-1/2 px-4 py-2 bg-sky-950 text-white rounded cursor-pointer" onClick={() => {setIsUrlTab(false)}}>
                CONTENT
              </button>
            </div>
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center border rounded px-3 py-2 mb-20 flex flex-col gap-3"
            >
              {isUrlTab 
              ? (<input
                type="url"
                placeholder="Paste URL here"
                className="w-4/5 text-base text-gray-700 focus:outline-none border border-sky-2000 rounded px-3 py-3"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />)
              : (<textarea
                type="text"
                placeholder="Paste Content here"
                className="w-4/5 text-base text-gray-700 focus:outline-none border border-sky-2000 rounded px-3 py-3"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              )}

              <button type="submit" className="w-4/5 px-4 py-2 bg-sky-950 text-white rounded cursor-pointer">
                Verify
              </button>
            </form>
          </div>
        </div>
      </div>
      

      {/* This div is the trigger for loading the news */}
      <div ref={observerRef} className="h-1 mt-20" />
      <div className='w-full flex items-center justify-center'>
        <hr className='text-sky-950 w-[90%] items-center justify-center'></hr>
      </div>
      
      {showNews && <NewsGrid
          articles={articles}
          hasMore={hasMore}
          isLoading={isArticleLoading}
          fetchUrl={FETCH_ARTICLE_URL}
          pageSize={PAGE_SIZE}
          page={page}
          handleLoadMore={handleLoadMore}
        />}

      <Footer />
    </div>
  );
}
