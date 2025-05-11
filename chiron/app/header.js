'use client';

import { useState, useEffect } from 'react';

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
    <div className="header py-6 relative bg-sky-950 text-white shadow-md h-15">
      <div className="flex items-center absolute top-2 left-10">
        {/* Logo */}
        <img src="/logo.png" alt="CHIRON Logo" className="w-10 h-10 mr-2" />
        {/* CHIRON text */}
        <h1 className="name text-l font-bold text-gray-300">CHIRON</h1>
      </div>

      {hasMounted && (
        <div className="clock text-sm absolute top-2 right-10 text-right text-gray-200">
          {formattedDate}
          <br />
          {formattedTime}
        </div>
      )}
    </div>
  );
}
