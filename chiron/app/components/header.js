'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { setLatestHealthNews } from '../redux/articles/url';
import { useDispatch } from 'react-redux';

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hasMounted, setHasMounted] = useState(false);
  const dispatch = useDispatch();

  const handleLatestNewsClick = (e) => {
    e.preventDefault(); // prevent full reload
    dispatch(setLatestHealthNews(true));
    window.history.pushState({}, '', '/'); // navigate to home without reload
  };

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
        <button onClick={handleLatestNewsClick} className="text-sky-950 hover:text-white">Latest News</button>
        {/* <Link href="/" className="text-sky-950 hover:text-white">Latest Health News</Link> */}
        {/* <Link href="/verify" className="text-gray-200 hover:text-white">Verify News</Link> */}
        <Link href="/about" className="text-sky-950 hover:text-white">About Us</Link>
      </nav>

      {/* Right: Clock */}
      {hasMounted && (
        <div className="text-sm text-right text-sky-950">
          {formattedDate}
          <br />
          {formattedTime}
        </div>
      )}
    </div>
  );
}
