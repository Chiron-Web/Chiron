'use client';

export default function Footer() {
  return (
    <>
      {/* Info Box above footer */}
      <div className="bg-amber-200 text-left text-gray-700 py-4 px-6 border-t border-gray-300 h-20 flex flex-col justify-center">
        <h1 className="text-1xl font-bold">CHIRON</h1>
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
