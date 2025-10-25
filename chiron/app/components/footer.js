'use client';

export default function Footer() {
  return (
    <>
      {/* Info Box above footer */}
      <div className="bg-[#FFB703] text-left text-gray-700 py-4 px-6 border-t border-gray-300 h-20 flex flex-col justify-center">
        <div className="flex items-center">
          <img src="/logo-sky.png" alt="CHIRON Logo" className="w-10 h-10 mr-2" />
          <h1 className="text-1xl font-bold">CHIRON</h1>
        </div>
        {/* CHIRON description */}
        <p className="text-sm font-medium">
          Cognitive and Health Intelligent Real-time Optimization Network
        </p>
      </div>


      {/* Footer bar */}
      <div className="bg-sky-950 text-white text-center py-4">
        <p className="text-sm font-semibold">CHIRON ©2024</p>
      </div>
    </>
  );
}
