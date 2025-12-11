import React, { useState, useEffect } from 'react';
import { Search, Wifi, Volume2, ChevronUp } from 'lucide-react';
import { WindowState } from '../types';

interface TaskbarProps {
    windows?: WindowState[];
    activeWindowId?: string | null;
    onWindowClick?: (id: string) => void;
    onStartClick?: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({ windows = [], activeWindowId, onWindowClick, onStartClick }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString([], { year: 'numeric', month: 'numeric', day: 'numeric' });
    };

    return (
        <div className="h-[40px] bg-[#101010] bg-opacity-95 text-white flex items-center justify-between fixed bottom-0 w-full z-[9999] shadow-md select-none">
            {/* Left Section: Start & Search */}
            <div className="flex items-center h-full">
                {/* Start Button */}
                <button 
                    className="h-full w-[48px] hover:bg-white/10 flex items-center justify-center transition-colors"
                    onClick={onStartClick}
                >
                    <svg width="18" height="18" viewBox="0 0 87 87" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 12.4021L35.534 7.54102V42.4418H0V12.4021Z" fill="white"/>
                        <path d="M41.7478 6.69043L87 0.505859V42.4418H41.7478V6.69043Z" fill="white"/>
                        <path d="M0 48.0947H35.534V82.0298L0 76.7129V48.0947Z" fill="white"/>
                        <path d="M41.7478 48.0947H87V87L41.7478 80.3447V48.0947Z" fill="white"/>
                    </svg>
                </button>

                {/* Search Bar */}
                <div className="flex h-full items-center bg-white text-black px-3 w-[250px] border-t-2 border-transparent hover:border-gray-400 m-0 hidden sm:flex">
                    <Search size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm text-gray-500">Type here to search</span>
                </div>
                
                {/* Mobile Search Icon */}
                <button className="h-full w-[48px] hover:bg-white/10 flex sm:hidden items-center justify-center transition-colors">
                     <Search size={18} className="text-white" />
                </button>
            </div>

            {/* Middle Section: Taskbar Items */}
            <div className="flex-1 flex h-full items-center pl-2 overflow-x-auto overflow-y-hidden scrollbar-hide">
                {windows.map(win => {
                    const isActive = win.id === activeWindowId && !win.isMinimized;
                    return (
                        <div 
                            key={win.id}
                            className={`
                                h-full min-w-[140px] max-w-[160px] px-2 flex items-center gap-2 cursor-pointer transition-all border-b-2
                                ${isActive ? 'bg-white/10 border-[#76B9ED]' : 'hover:bg-white/5 border-transparent hover:border-gray-500'}
                                ${win.isMinimized ? 'opacity-70' : ''}
                            `}
                            onClick={() => onWindowClick && onWindowClick(win.id)}
                        >
                            {/* App Icon placeholder (could pass icon in window state) */}
                            <div className="p-1">
                                <div className="w-4 h-4 bg-blue-500 rounded-sm" /> 
                            </div>
                            <span className="text-xs truncate text-gray-200">{win.title}</span>
                        </div>
                    );
                })}
            </div>

            {/* Right Section: System Tray */}
            <div className="flex items-center h-full px-2 gap-1 text-white/90 text-xs">
                 <button className="h-full px-1 hover:bg-white/10 rounded-sm">
                    <ChevronUp size={16} />
                </button>
                 <div className="flex items-center px-2 hover:bg-white/10 h-full cursor-default transition-colors">
                    <Wifi size={16} />
                </div>
                <div className="flex items-center px-2 hover:bg-white/10 h-full cursor-default transition-colors">
                    <Volume2 size={16} />
                </div>
                 <div className="flex flex-col items-end justify-center px-2 h-full hover:bg-white/10 cursor-default transition-colors w-[70px]">
                    <span className="text-xs leading-none mb-[2px]">{formatTime(time)}</span>
                    <span className="text-xs leading-none">{formatDate(time)}</span>
                </div>
                 {/* Show Desktop Line */}
                 <div className="w-[5px] h-full border-l border-gray-600 ml-2 hover:bg-white/20 cursor-pointer"></div>
            </div>
        </div>
    );
};