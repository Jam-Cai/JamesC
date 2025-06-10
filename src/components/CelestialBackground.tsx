import React, { useMemo, useEffect, useState } from 'react';

interface CelestialBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const CelestialBackground: React.FC<CelestialBackgroundProps> = ({ children, className = '' }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Memoize the background elements to prevent re-renders
  const backgroundElements = useMemo(() => (
    <>
      {/* Main Background with Enhanced Purple Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900">
        {/* Purple Nebula Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent opacity-50" />
        {/* Additional Purple Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent" />
      </div>

      {/* Animated Stars Background - Only show if reduced motion is not preferred */}
      {!prefersReducedMotion && (
        <>
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            ))}
          </div>

          {/* Purple Stars */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div
                key={`purple-${i}`}
                className="absolute w-1 h-1 bg-purple-400 rounded-full animate-twinkle"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  boxShadow: '0 0 4px 2px rgba(192, 132, 252, 0.5)',
                }}
              />
            ))}
          </div>

          {/* Shooting Stars */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={`shooting-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full animate-shooting-star"
                style={{
                  top: `${Math.random() * 30}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>

          {/* Purple Shooting Stars */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {[...Array(2)].map((_, i) => (
              <div
                key={`purple-shooting-${i}`}
                className="absolute w-1 h-1 bg-purple-400 rounded-full animate-shooting-star"
                style={{
                  top: `${Math.random() * 30}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  boxShadow: '0 0 4px 2px rgba(192, 132, 252, 0.5)',
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Static Stars for Reduced Motion */}
      {prefersReducedMotion && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(45)].map((_, i) => (
            <div
              key={`static-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full opacity-70"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      )}
    </>
  ), [prefersReducedMotion]); // Add prefersReducedMotion to dependencies

  return (
    <div className={`relative min-h-screen ${className}`}>
      {backgroundElements}
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default CelestialBackground; 