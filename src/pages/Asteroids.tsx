import React from 'react';
import AsteroidsGame from '@/components/AsteroidsGame';
import { Toaster } from '@/components/ui/toaster';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Asteroids = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-black">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/30 to-blue-600/30 backdrop-blur-sm border border-white/20 rounded-full text-white/80 hover:text-white hover:border-white/40 transition-all duration-300 group"
      >
        {/* <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" /> */}
        <span className="text-sm font-medium">Back to Home</span>
      </button>

      <AsteroidsGame />
      {/* <div className="absolute top-4 left-4 text-white/80 text-sm">
        <h2 className="text-xl font-bold mb-2">Controls:</h2>
        <ul className="space-y-1">
          <li>↑ - Thrust</li>
          <li>← → - Rotate</li>
          <li>Space - Shoot</li>
        </ul>
        <p className="mt-4 text-xs">
          Destroy asteroids to reveal contact information!
        </p>
      </div>
      <Toaster /> */}
    </div>
  );
};

export default Asteroids; 