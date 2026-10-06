import React from 'react';

interface AvatarProps {
  name: string;
  avatar?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showName?: boolean;
  roleBadge?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  avatar,
  size = 'sm',
  showName = false,
  roleBadge,
  className = ''
}) => {
  const sizeMap = {
    xs: 'w-5 h-5 text-[10px]',
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };

  const getInitials = (n: string) => {
    return n
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className={`relative shrink-0 rounded-full overflow-hidden bg-slate-100 border border-slate-300 font-bold text-slate-700 flex items-center justify-center ${sizeMap[size]}`}>
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {showName && (
        <div className="flex flex-col text-left leading-tight min-w-0">
          <span className="text-xs font-semibold text-slate-800 truncate">{name}</span>
          {roleBadge && <span className="text-[10px] text-slate-500 truncate">{roleBadge}</span>}
        </div>
      )}
    </div>
  );
};
