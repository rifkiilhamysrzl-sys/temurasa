import React from 'react';

interface PillBadgeProps {
  icon?: React.ReactNode;
  label: string;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
}

export const PillBadge: React.FC<PillBadgeProps> = ({
  icon,
  label,
  className = '',
  selected = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
        selected
          ? 'bg-olive text-white shadow-sm'
          : 'glass-pill text-textDark/85 hover:bg-white/40'
      } ${onClick ? 'cursor-pointer active:scale-95' : ''} ${className}`}
    >
      {icon && <span className="opacity-80 flex items-center">{icon}</span>}
      <span>{label}</span>
    </div>
  );
};
