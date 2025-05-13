'use client';

import { useState } from 'react';
import Header from './header';
import Footer from './footer';

export default function Homepage() {
  const [url, setUrl] = useState('');

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
          <div className="flex items-center border border-gray-300 rounded px-3 py-2 mb-6">
            <input
              type="url"
              placeholder="Paste URL here"
              className="w-full text-base text-gray-700 focus:outline-none"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <img src="/search.png" alt="Search Icon" className="ml-2 w-5 h-5" />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded shadow overflow-hidden hover:shadow-md transition-shadow"
              >
                <img
                  src={`/news${i + 1}.jpg`}
                  alt={`News ${i + 1}`}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 text-sm text-gray-800">
                  <h3 className="font-semibold">News Title</h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
