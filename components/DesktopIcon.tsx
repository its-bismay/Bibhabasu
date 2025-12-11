import React from 'react';

interface DesktopIconProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ label, icon, onClick, className }) => {
  return (
    <div 
      onClick={onClick}
      className={`flex flex-col items-center justify-start w-[84px] p-2 mb-2 rounded-[2px] border border-transparent hover:bg-white/10 hover:border-white/20 active:bg-white/20 cursor-default transition-all duration-100 group ${className}`}
    >
      <div className="w-10 h-10 mb-1 drop-shadow-md">
        {icon}
      </div>
      <span 
        className="text-white text-[12px] leading-tight text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
        style={{ textShadow: '0px 1px 3px rgba(0,0,0,0.8)' }}
      >
        {label}
      </span>
    </div>
  );
};