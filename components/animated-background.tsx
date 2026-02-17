'use client';

export function AnimatedBackground() {
  const nodes = [
    'node-1',
    'node-2',
    'node-3',
    'node-4',
    'node-5',
    'node-6',
    'node-7',
    'node-8',
    'node-9',
    'node-10',
    'node-11',
    'node-12',
  ];

  return (
    <div className="fixed inset-0 -z-30 overflow-hidden">
      {/* Main background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-5 bg-grid" />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl bg-orb" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl bg-orb bg-orb-2" />
      
      {/* Wireframe lightning nodes - animated */}
      <div className="absolute inset-0">
        {nodes.map((nodeClass) => (
          <div
            key={nodeClass}
            className={`absolute w-1 h-1 rounded-full bg-white/70 animate-pulse ${nodeClass}`}
          />
        ))}
      </div>

      {/* Animated connecting lines (market trend effect) */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Animated zigzag lines simulating market movement */}
        <polyline
          points="50,300 150,250 250,280 350,200 450,240 550,180 650,220 750,150 850,190 950,120"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          filter="url(#glow)"
          className="zigzag-line"
        />
        <polyline
          points="80,500 180,480 280,510 380,460 480,490 580,440 680,470 780,410 880,450 980,380"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="1.5"
          filter="url(#glow)"
          className="zigzag-line zigzag-line-reverse"
        />
      </svg>

      {/* Ambient noise texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay noise-bg" />
    </div>
  );
}
