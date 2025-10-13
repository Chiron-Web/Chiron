'use client';

import Image from 'next/image';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white text-white px-6 py-10 ">
      {/* Title */}
      <h1 className="text-center text-4xl font-bold text-black">
        WE ARE <span className="text-blue-950">CHIRON</span>
      </h1>

      {/* Logo */}
      <div className="flex justify-center my-6">
        <Image src="/logo-black.png" alt="CHIRON Logo" width={100} height={100} />
      </div>

      {/* Description */}
      <p className="text-center max-w-2xl mx-auto text-gray-950 text-lg mb-12">
        CHIRON is a health-focused platform dedicated to providing users with reliable, accurate, and timely health news. We fight misinformation using modern technology so you can stay informed with peace of mind.
      </p>

      {/* Mission & Vision */}
      <div className="flex flex-col md:flex-row justify-center items-start gap-12 mb-16">
        {/* Mission */}
        <div className="max-w-md text-center md:text-left">
          <h2 className="text-2xl font-semibold text-sky-950 mb-2">Mission</h2>
          <p className="text-gray-950">
            To empower people by delivering trustworthy health information and combating misinformation through cutting-edge AI solutions.
          </p>
        </div>

        {/* Vision */}
        <div className="max-w-md text-center md:text-left">
          <h2 className="text-2xl font-semibold text-sky-950 mb-2">Vision</h2>
          <p className="text-gray-950">
            A world where every person can access truthful health knowledge, fostering a healthier and more informed society.
          </p>
        </div>
      </div>

      {/* Meet the Team */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-950 mb-8">Meet the Team</h2>

        <div className="flex justify-center gap-70">
          {/* Member 1 */}
          <div>
            <img src="./Madera.jpg" className="w-28 h-28 bg-gray-400 rounded-full mx-auto mb-2" />
            <p className="text-sky-950">Rojane Kyle Madera</p>
          </div>

          {/* Member 2 */}
          <div>
            <img src="./Pelegrino.jpg" className="w-28 h-28 bg-gray-400 rounded-full mx-auto mb-2" />
            <p className="text-sky-950">Michael Patrick Pelegrino</p>
          </div>

          {/* Member 3 */}
          <div>
            {/* <div className="w-28 h-28 bg-gray-400 rounded-full mx-auto mb-2"></div> */}
            <img src="./Depra.jpg" className="w-28 h-28 bg-gray-400 rounded-full mx-auto mb-2" />
            <p className="text-sky-950">Trixie Anne Depra</p>
          </div>
        </div>
      </div>
    </div>
  );
}
