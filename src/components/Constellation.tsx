return (
  <svg
    className="absolute inset-0 w-full h-full"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#60A5FA' }} />
        <stop offset="100%" style={{ stopColor: '#A78BFA' }} />
      </linearGradient>
    </defs>
    {/* Rest of the SVG content */}
    <text
      x={x}
      y={y}
      className="star-label-svg"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      <tspan className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        {label}
      </tspan>
    </text>
  </svg>
); 