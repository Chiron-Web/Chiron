'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="header py-8 px-10 bg-sky-950 text-white shadow-md flex items-center justify-between">
      {/* Left: Logo */}
      <div className="flex items-center">
        <img src="/logo.png" alt="CHIRON Logo" className="w-10 h-10 mr-2" />
        <h1 className="name text-lg font-bold text-gray-300">CHIRON</h1>
      </div>

      {/* Center: Navigation Links */}
      <nav className="flex gap-20 text-lg">
        <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
        <Link href="/verify" className="text-gray-300 hover:text-white">Verify News</Link>
        <Link href="/about" className="text-gray-300 hover:text-white">About Us</Link>
      </nav>

      {/* Right: Clock */}
      {hasMounted && (
        <div className="text-lg text-right text-gray-200">
          {formattedDate}
          <br />
          {formattedTime}
        </div>
      )}
    </div>
  );
}
