import React, { useState, useEffect } from 'react';

interface GaugeMeterProps {
  score: number; // 0 to 100
  label?: string;
  className?: string;
  animate?: boolean;
}

export const GaugeMeter: React.FC<GaugeMeterProps> = ({
  score,
  label = 'Overall Compatibility',
  className = '',
  animate = true,
}) => {
  const targetScore = Math.min(100, Math.max(0, Math.round(score)));
  const [displayScore, setDisplayScore] = useState(animate ? 0 : targetScore);

  useEffect(() => {
    if (!animate) {
      setDisplayScore(targetScore);
      return;
    }

    let startTime: number | null = null;
    const duration = 1200; // ms
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic curve
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(ease * targetScore));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [targetScore, animate]);

  // Semicircle geometry
  const radius = 80;
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // Half-circle perimeter
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <svg
        className="w-56 h-32 overflow-visible"
        viewBox="0 0 200 110"
      >
        {/* Background Arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Foreground Progress Arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#777D4B"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
      </svg>

      {/* Central Score Text */}
      <div className="absolute bottom-2 flex flex-col items-center text-center">
        <span className="font-serif-heading text-4xl sm:text-5xl font-semibold tracking-tight text-textDark">
          {displayScore}%
        </span>
        <span className="text-xs uppercase tracking-wider text-textDark/70 font-medium mt-0.5">
          {label}
        </span>
      </div>
    </div>
  );
};
