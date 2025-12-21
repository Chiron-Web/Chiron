'use client';

import Header from '../components/header';
import Footer from '../components/footer';
import { useSelector } from 'react-redux';
import { use } from 'react';

export default function ResultPage() {
  const { classificationResult, fetching, classifying, textContent, url } = useSelector(
    state => state.url
  );
  const { credibilityScore, articleTitle, submittedText } = useSelector(
    state => state.scrapingResult || { credibilityScore: null, articleTitle: null, submittedText: textContent }
  );

  const {authenticity_confidence, news_type, authenticity, error, image} = classificationResult || {};

  const isHealth = news_type?.toLowerCase() === 'health';
  const isFake = isHealth && authenticity?.toLowerCase() === 'fake';
  const isAuthentic = isHealth && authenticity?.toLowerCase() === 'authentic';

  const getMessage = () => {
    if (error) return `Error occurred: ${error}`;
    if (isFake) return 'This content may contain misinformation/disinformation';
    if (isAuthentic) return 'This content contains reliable health information';
    return 'BEWARE: This content is not a health article';
  };

  const getContainerBg = () => {
    if(isAuthentic) {
      return "bg-gradient-to-b from-green-100 to-white border";
    } else if (isFake) {
      return "bg-gradient-to-b from-red-100 to-white border"
    } else {
      return "bg-gradient-to-b from-blue-100 to-white border"
    }
  }

  const getTextBg = () => {
    if(isAuthentic) {
      return "bg-green-500 px-1";
    } else if (isFake) {
      return "bg-red-500 px-1"
    } else {
      return "bg-blue-500 px-1"
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100 to-white">
      <Header />
      <div className="text-center text-gray-700 mt-20 flex items-center justify-center">
        <img
          src="/logo-sky.png"  
          alt="CHIRON Logo"
          className="w-10 h-10 mr-2"  
        />
        <h1 className="text-3xl font-bold">CHIRON</h1>
      </div>
      <p className="text-sm text-center mt-2 text-gray-700">Leveraging technology for public health education.</p>


      <main className="flex justify-center px-6 mt-10 mb-10">
        <div className="w-[90%] max-w-7xl flex flex-col">

          <div className="flex flex-row items-start h-full mb-5">
            <div className={`w-3/5 h-full flex gap-4 p-4 flex-col items-center justify-center ${getContainerBg()} border-sky-950 rounded-l-xl p-6`}>
              
              
              {articleTitle !== null && (
                <span className="article-title py-1 rounded-md text-sky-950 text-l font-medium">
                  News Article Title: <strong>{articleTitle}</strong>
                </span>
              )}
              
              <div className="relative max-w-full h-full overflow-y-auto">
                <p className="text-gray-950 whitespace-pre-line text-m">
                  {submittedText.split(" ").map((word, index) => (
                    <span key={index} className={`${getTextBg()}`}>
                      {word}{" "}
                    </span>
                  ))}
                </p>
              </div>
              
            </div>
            <div className='w-2/5 flex flex-col border border-y-sky-950 border-r-sky-950 rounded-r-xl p-6'>
              <div className="w-full justify-center items-center relative h-auto ">
                  <img
                    src={image || (isFake ? '/fake.png' : isAuthentic ? '/authentic.jpg' : '/general.png')}
                    alt="Article Preview"
                    width={100}
                    height={100}
                    className="object-cover rounded-md w-full"
                  />
                  
                  {isAuthentic && (
                    <img
                      src="/authentic-stamp.png"
                      alt="Authentic Label"
                      className="absolute top-2 right-2 w-40 h-40 opacity-90"
                    />
                  )}

                  {isFake && (
                    <img
                      src="/fake-stamp.png"
                      alt="Fake Label"
                      className="absolute top-2 right-2 w-40 h-40 opacity-90"
                    />
                  )}
                </div>
                
                <p className="mb-4 text-sky-950 text-xl">{getMessage()}</p>
                
                <div className="flex flex-col items-start gap-1 xl:gap-1 mb-4">
                  {news_type && (
                    <span className="py-1 rounded-md text-sky-950 text-l font-medium">
                      Classification: {news_type.toUpperCase()}
                    </span>
                  )}
                  {isFake && (
                    <span className="py-1 rounded-md text-sky-950 text-l font-medium">
                      Classification: FAKE
                    </span>
                  )}
                  {isAuthentic && (
                    <span className="py-1 rounded-md text-sky-950 text-l">
                      News Type: AUTHENTIC
                    </span>
                  )}
                  {(isFake || isAuthentic) && authenticity_confidence !== undefined && (
                    <span className="py-1 rounded-md text-sky-950 text-l font-medium">
                      Confidence: <strong>{(authenticity_confidence * 100).toFixed(2)}%</strong>
                    </span>
                  )}
                  {credibilityScore !== null && (
                    <span className="py-1 rounded-md text-sky-950 text-l font-medium">
                      Website Credibility Score: {credibilityScore.toUpperCase()}
                    </span>
                  )}
                  
                  
                  
                </div>
                
              </div>
            
          </div>
          <div className='w-5/5 flex justify-center items-center rounded-[8] flex gap-3'>

                <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-semibold text-sky-950 bg-[#FFB703] rounded-lg p-2 my-2 hover:bg-[#E69A00] transition-colors w-full text-center block"
                >
                    Visit Page
                </a>
                <a
                href={'/'}
                className="text-base font-semibold text-white bg-sky-950 rounded-lg p-2 my-2 hover:bg-[#E69A00] transition-colors w-full text-center block"
                >
                    Verify Another News
                </a>
              </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
