import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Square, Copy } from 'lucide-react';

interface WindowFrameProps {
  title: string;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  zIndex: number;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  title,
  isActive,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  zIndex,
  initialPosition,
  initialSize,
  children
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);

  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    onFocus();
    setIsDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const toggleMaximize = () => {
    onMaximize(); 
    setIsMaximized(!isMaximized);
  };

  const currentStyle = isMaximized 
    ? { top: 0, left: 0, width: '100%', height: 'calc(100% - 40px)', transform: 'none' } // Subtract taskbar height
    : { top: position.y, left: position.x, width: size.width, height: size.height };

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col bg-white shadow-[0_0_20px_rgba(0,0,0,0.3)] border border-[#1883d7] overflow-hidden`}
      style={{
        ...currentStyle,
        zIndex,
        
        borderRadius: 0, 
      }}
      onClick={onFocus}
    >
     
      <div 
        className={`flex items-center justify-between h-[30px] bg-white select-none ${isActive ? 'text-black' : 'text-gray-500'}`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center pl-2 gap-2 h-full flex-1">
            <span className="text-[12px]">{title}</span>
        </div>
        
       
        <div className="flex h-full items-start">
          <button 
            onClick={(e) => { e.stopPropagation(); onMinimize(); }} 
            className="h-full w-[46px] flex items-center justify-center hover:bg-[#E5E5E5] transition-colors"
          >
            <Minus size={10} strokeWidth={1.5} />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); toggleMaximize(); }} 
            className="h-full w-[46px] flex items-center justify-center hover:bg-[#E5E5E5] transition-colors"
          >
            {isMaximized ? <Copy size={10} strokeWidth={1.5} /> : <Square size={10} strokeWidth={1.5} />}
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }} 
            className="h-full w-[46px] flex items-center justify-center hover:bg-[#E81123] hover:text-white transition-colors group"
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-[#F0F0F0] relative">
        {children}
      </div>
    </div>
  );
};