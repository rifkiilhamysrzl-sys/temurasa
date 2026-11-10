import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  segments?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  segments = 6,
}) => {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="w-full flex flex-col items-center gap-1.5 px-6">
      {/* Segmented Bar */}
      <div className="w-full flex items-center gap-1.5 h-1.5">
        {Array.from({ length: segments }).map((_, i) => {
          const segPercentage = ((i + 1) / segments) * 100;
          const isFilled = percentage >= segPercentage;
          const isCurrentSegment =
            percentage >= (i / segments) * 100 && percentage < segPercentage;

          return (
            <div
              key={i}
              className="flex-1 h-full rounded-full overflow-hidden bg-white/25 border border-white/30"
            >
              <div
                className={`h-full transition-all duration-300 ${
                  isFilled
                    ? 'bg-olive'
                    : isCurrentSegment
                    ? 'bg-olive/60'
                    : 'bg-transparent'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Label */}
      <p className="text-xs text-textDark/75 font-medium tracking-wide">
        Pertanyaan {current} dari {total}
      </p>
    </div>
  );
};
