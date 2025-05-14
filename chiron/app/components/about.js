'use client';

import Image from 'next/image';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100 to-white">
      <main className="flex-grow px-6 py-20">
        {/* Title */}
        <h1 className="text-center text-4xl font-bold text-black">
          WE ARE <span className="text-blue-950">CHIRON</span>
        </h1>

        {/* Logo */}
        <div className="flex justify-center my-10">
          <Image src="/logo-black.png" alt="CHIRON Logo" width={100} height={100} />
        </div>

        {/* Description */}
        <p className="text-center max-w-3xl mx-auto text-gray-950 text-2xl mb-20">
          CHIRON is a health-focused platform dedicated to providing users with reliable, accurate, and timely health news. We fight misinformation using modern technology so you can stay informed with peace of mind.
        </p>

        {/* Mission & Vision */}
        <div className="flex flex-col md:flex-row justify-center items-start gap-12 mb-20">
          {/* Mission */}
          <div className="max-w-md text-center md:text-left">
            <h2 className="text-3xl font-semibold text-sky-950 mb-2">Mission</h2>
            <p className="text-xl text-gray-950">
              To empower people by delivering trustworthy health information and combating misinformation through cutting-edge AI solutions.
            </p>
          </div>

          {/* Vision */}
          <div className="max-w-md text-center md:text-left">
            <h2 className="text-3xl font-semibold text-sky-950 mb-2">Vision</h2>
            <p className="text-xl text-gray-950">
              A world where every person can access truthful health knowledge, fostering a healthier and more informed society.
            </p>
          </div>
        </div>

        {/* Meet the Team */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-950 mb-10">Meet the Team</h2>

          <div className="flex justify-center gap-40">
            {/* Member 1 */}
            <div className="relative">
              <div
                className="w-50 h-50 bg-cover bg-center rounded-full mx-auto mb-5"
                style={{ backgroundImage: 'url(/roj.png)' }}
              ></div>
              <p className="text-xl text-sky-950">Rojane Kyle Madera</p>
            </div>

            {/* Member 2 */}
            <div className="relative">
              <div
                className="w-50 h-50 bg-cover bg-center rounded-full mx-auto mb-5"
                style={{ backgroundImage: 'url(/pat.png)' }}
              ></div>
              <p className="text-xl text-sky-950">Michael Patrick Pelegrino</p>
            </div>

            {/* Member 3 */}
            <div className="relative">
              <div
                className="w-50 h-50 bg-cover bg-center rounded-full mx-auto mb-5"
                style={{ backgroundImage: 'url(/trix.png)' }}
              ></div>
              <p className="text-xl text-sky-950">Trixie Anne Depra</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
