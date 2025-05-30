'use client';

import { useClassification } from '../components/context';
import { useRouter } from 'next/navigation';
import Header from '../components/header';
import Footer from '../components/footer';
import { useEffect, useState } from 'react';

export default function ResultPage() {
  const { classificationResult, submittedText } = useClassification();
  const router = useRouter();

  const [articleImage, setArticleImage] = useState(null);

    useEffect(() => {
      setArticleImage(localStorage.getItem('articleImage'));
      return () => localStorage.removeItem('articleImage'); // Clean up
    }, []);


  useEffect(() => {
    if (!classificationResult) {
      router.push('/');
    }
  }, [classificationResult]);

  if (!classificationResult) return null;

  const { news_type, authenticity, authenticity_confidence, error } = classificationResult;

  const isHealth = news_type?.toLowerCase() === 'health';
  const isFake = isHealth && authenticity?.toLowerCase() === 'fake';
  const isAuthentic = isHealth && authenticity?.toLowerCase() === 'authentic';

  const getMessage = () => {
    if (error) return `⚠️ Error occurred: ${error}`;
    if (isFake) return '⚠️ This health article may contain misinformation. Verify with trusted sources.';
    if (isAuthentic) return '✅ This page contains reliable health information.';
    return 'ℹ️ The article is classified as general news.';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100 to-white">
      <Header />
      <div className="text-center text-gray-700 mt-20 flex items-center justify-center">
        <img
          src="/CHIRON-logo-darkblue.png"  // Ensure this is a black logo image
          alt="CHIRON Logo"
          className="w-10 h-10 mr-2"  // Ensure the logo is beside the title
        />
        <h1 className="text-3xl font-bold">CHIRON</h1>
      </div>
      <p className="text-sm text-center mt-2 text-gray-700">Leveraging technology for public health education.</p>


      <main className="flex justify-center px-6 mt-4 mb-4">
        <div className="border border-gray-300 rounded-xl p-6 bg-white w-full max-w-4xl">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {news_type && (
            <span className="px-3 py-1 rounded-md bg-green-600 text-white text-sm font-medium">
              News Type: {news_type}
            </span>
          )}
          {isFake && (
            <span className="px-3 py-1 rounded-md bg-red-500 text-white text-sm font-medium">
              Misinformation
            </span>
          )}
          {isAuthentic && (
            <span className="px-3 py-1 rounded-md bg-green-500 text-white text-sm font-medium">
              Authentic
            </span>
          )}
          {(isFake || isAuthentic) && authenticity_confidence !== undefined && (
            <span className="px-3 py-1 rounded-md bg-blue-500 text-white text-sm font-medium">
              Confidence: {(authenticity_confidence * 100).toFixed(2)}%
            </span>
          )}
        </div>
          <p className="mb-4 text-gray-700">{getMessage()}</p>
          <div className="mt-6">
          <div className="flex justify-center">
            <div className="relative w-[200px] h-auto">
              <img
                src={articleImage || (isFake ? '/fake-stamp.png' : isAuthentic ? '/authentic-stamp.png' : '/CHIRON-logo-darkblue.png')}
                alt="Article Preview"
                width={120}
                height={120}
                className="object-cover rounded-md w-full"
              />
              
              {isAuthentic && (
                <img
                  src="/authentic-stamp.png"
                  alt="Authentic Label"
                  className="absolute top-2 right-2 w-24 h-24 opacity-90"
                />
              )}

              {isFake && (
                <img
                  src="/fake-stamp.png"
                  alt="Fake Label"
                  className="absolute top-2 right-2 w-24 h-24 opacity-90"
                />
              )}
            </div>
          </div>
            <div className="flex justify-center w-full">
              <div className="relative w-full max-h-[240px] overflow-y-auto mx-auto border border-white-200 rounded-md p-4 bg-white-50">
                <p className="text-gray-800 whitespace-pre-line">{submittedText}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="flex justify-center mt-2 mb-8">
        <div className="w-full max-w-4xl">
          <button
            onClick={() => router.push('/')}
            className="w-full px-6 py-2 bg-blue-700 text-white rounded-lg font-semibold hover:bg-green-900 transition"
          >
            Verify Another Article
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};
