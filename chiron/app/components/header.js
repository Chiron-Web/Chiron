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
    <div className="header py-4 px-10 text-white flex items-center justify-between">
      <nav className="flex gap-8 text-sm">
        <Link href="/" className="text-sky-950 hover:text-white">Home</Link>
        <Link href="*" className="text-sky-950 hover:text-white">Latest News</Link>
        {/* <Link href="/verify" className="text-gray-200 hover:text-white">Verify News</Link> */}
        <Link href="/about" className="text-sky-950 hover:text-white">About Us</Link>
      </nav>

      {/* Right: Clock */}
      {hasMounted && (
        <div className="text-sm text-right text-gray-200">
          {formattedDate}
          <br />
          {formattedTime}
        </div>
      )}
    </div>
  );
}
