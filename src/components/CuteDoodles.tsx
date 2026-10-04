import React from 'react';

export const MochiCloud: React.FC<{ className?: string }> = ({ className = 'w-12 h-8 text-mochi-lavender' }) => (
  <svg viewBox="0 0 100 60" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20,45 Q10,45 10,35 Q10,25 22,23 Q25,10 42,10 Q55,10 62,20 Q75,18 80,30 Q90,32 90,42 Q90,50 80,50 L20,50 Z" />
  </svg>
);

export const MochiSparkle: React.FC<{ className?: string }> = ({ className = 'w-6 h-6 text-mochi-pink' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 0 C12 6.6 6.6 12 0 12 C6.6 12 12 17.4 12 24 C12 17.4 17.4 12 24 12 C17.4 6.6 12 0 12 0 Z" />
  </svg>
);

export const MochiBlob: React.FC<{ className?: string }> = ({ className = 'w-16 h-16 text-mochi-pink-light' }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className} aria-hidden="true">
    <path d="M30,15 Q65,5 80,35 Q95,65 70,85 Q45,105 20,80 Q-5,55 30,15 Z" />
  </svg>
);
