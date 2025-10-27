'use client';

import Header from '../components/header';
import Footer from '../components/footer';
import { useSelector } from 'react-redux';

export default function ResultPage() {
  const { classificationResult, fetching, classifying, textContent } = useSelector(
    state => state.url
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
        <div className="border border-sky-950 rounded-xl p-6 w-[70%] max-w-7xl">

          <div className="">
            <div className="flex gap-4 p-4 flex-col items-center justify-center">
              <div className="relative w-[350px] h-auto">
                <img
                  src={image || (isFake ? '/fake.png' : isAuthentic ? '/authentic.jpg' : '/general.png')}
                  alt="Article Preview"
                  width={300}
                  height={300}
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
              
              <p className="mb-4 text-sky-950 text-2xl">{getMessage()}</p>
              <div className='w-full flex items-start'>
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
                  {articleTitle !== null && (
                    <span className="py-1 rounded-md text-sky-950 text-l font-medium">
                      News Article Title: <strong>{articleTitle}</strong>
                    </span>
                  )}
                </div>
              </div>
              
              <div className="relative max-w-full max-h-[400px] overflow-y-auto">
                <p className="text-gray-950 whitespace-pre-line text-sm">{submittedText}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
