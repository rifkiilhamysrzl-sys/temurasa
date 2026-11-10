import React from 'react';

interface GaugeMeterProps {
  score: number; // 0 to 100
  label?: string;
  className?: string;
}

export const GaugeMeter: React.FC<GaugeMeterProps> = ({
  score,
  label = 'Overall Compatibility',
  className = '',
}) => {
  // Semicircle geometry
  const radius = 80;
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // Half-circle perimeter
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

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
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Central Score Text */}
      <div className="absolute bottom-2 flex flex-col items-center text-center">
        <span className="font-serif-heading text-4xl sm:text-5xl font-semibold tracking-tight text-textDark">
          {clampedScore}%
        </span>
        <span className="text-xs uppercase tracking-wider text-textDark/70 font-medium mt-0.5">
          {label}
        </span>
      </div>
    </div>
  );
};
