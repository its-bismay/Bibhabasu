import React, { useState } from 'react';
import { FileSystemNode, FileType, AppId } from '../types';
import { findNodeById, getPathToNode } from '../utils/fsHelper';
import { fileSystem } from '../constants';
import { Folder, FileText, ArrowLeft, ArrowRight, ArrowUp, Monitor, Download, Star, Clock, Music } from 'lucide-react';

interface FileExplorerProps {
  initialPathId?: string;
  openWindow: (appId: AppId, title: string, data?: any) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ initialPathId = 'c-drive', openWindow }) => {
  const [currentId, setCurrentId] = useState(initialPathId);

  const currentNode = findNodeById(fileSystem, currentId) || fileSystem[0];
  const breadcrumbs = getPathToNode(fileSystem, currentId) || [];

  const handleNavigate = (node: FileSystemNode) => {
    if (node.type === FileType.FOLDER || node.type === FileType.DISK) {
      setCurrentId(node.id);
    } else if (node.type === FileType.TEXT) {
      openWindow('text-editor', node.name, { content: node.content });
    } else if (node.type === FileType.LINK && node.url) {
      window.open(node.url, '_blank');
    } else if (node.type === FileType.AUDIO && node.url) {
      openWindow('vlc', 'VLC Media Player', { url: node.url, fileName: node.name });
    } else if (node.type === FileType.IMAGE && node.url) {
      openWindow('image-viewer', 'Photos', { url: node.url, fileName: node.name });
    }
  };

  const handleUp = () => {
    if (breadcrumbs.length > 1) {
        const parent = breadcrumbs[breadcrumbs.length - 2];
        setCurrentId(parent.id);
    }
  };

  const renderContentIcon = (node: FileSystemNode) => {
      if (node.type === FileType.DISK) {
          return (
             <div className="relative w-12 h-12">
                 <img src="https://img.icons8.com/color/96/ssd.png" alt="Drive" className="w-full h-full object-contain" />
             </div>
          );
      }
      if (node.type === FileType.FOLDER) {
        // Special case for Music folder to show different icon if desired, or just generic folder
        if (node.name === 'Musics') {
             return (
                <div className="relative w-12 h-12">
                    <img src="https://img.icons8.com/color/96/folder-invoices--v1.png" alt="Folder" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 flex items-center justify-center pt-2">
                        <Music size={16} className="text-orange-500 opacity-80" />
                    </div>
                </div>
             );
        }
          return (
             <div className="relative w-12 h-12">
                 <img src="https://img.icons8.com/color/96/folder-invoices--v1.png" alt="Folder" className="w-full h-full object-contain" />
             </div>
          );
      }
      if (node.type === FileType.TEXT) {
          return (
             <div className="relative w-10 h-12 bg-white border border-gray-300 shadow-sm flex items-center justify-center">
                 <div className="absolute top-0 right-0 border-t-[8px] border-r-[8px] border-t-white border-r-gray-200 shadow-sm"></div>
                 <div className="space-y-1 w-full px-2">
                     <div className="h-0.5 bg-gray-300 w-3/4"></div>
                     <div className="h-0.5 bg-gray-300 w-full"></div>
                     <div className="h-0.5 bg-gray-300 w-1/2"></div>
                 </div>
             </div>
          );
      }
      if (node.type === FileType.AUDIO) {
          return (
             <div className="relative w-12 h-12 flex items-center justify-center">
                 <img src="https://img.icons8.com/color/96/vlc.png" alt="MP3" className="w-10 h-10 object-contain" />
             </div>
          );
      }
      if (node.type === FileType.IMAGE && node.url) {
          return (
            <div className="relative w-12 h-12 flex items-center justify-center bg-gray-100 overflow-hidden shadow-sm border border-gray-200 rounded-sm">
                <img src={node.url} alt={node.name} className="w-full h-full object-cover" />
            </div>
          );
      }
      return <FileText size={40} className="text-gray-400" />;
  };

  return (
    <div className="flex flex-col h-full text-sm select-none text-black">
      {/* Ribbon/Menu (Simplified) */}
      <div className="h-12 bg-[#F3F3F3] border-b border-gray-300 flex items-center px-2 space-x-4 text-black text-xs">
          <span className="px-3 py-1 bg-white border border-gray-300 rounded-sm">Home</span>
          <span className="px-2 hover:bg-gray-200 rounded-sm cursor-pointer">Share</span>
          <span className="px-2 hover:bg-gray-200 rounded-sm cursor-pointer">View</span>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center p-2 border-b border-gray-200 bg-white gap-2 text-black">
        <div className="flex gap-1 text-gray-500">
             <button onClick={handleUp} disabled={breadcrumbs.length <= 1} className="hover:bg-gray-100 p-1 rounded-sm disabled:opacity-30"><ArrowLeft size={14} /></button>
             <button disabled className="hover:bg-gray-100 p-1 rounded-sm disabled:opacity-30"><ArrowRight size={14} /></button>
             <button onClick={handleUp} className="hover:bg-gray-100 p-1 rounded-sm"><ArrowUp size={14} /></button>
        </div>
        <div className="flex-1 border border-gray-300 px-2 py-1 text-xs flex items-center gap-1 hover:border-gray-400 overflow-hidden bg-white">
            <Monitor size={12} className="text-gray-500 min-w-max" />
            <span className="text-gray-400"> &gt; </span>
            <div className="flex items-center overflow-x-auto scrollbar-hide text-black">
                {breadcrumbs.slice(1).map((node, i) => (
                    <span key={node.id} className="flex items-center whitespace-nowrap">
                        <span 
                            className="cursor-pointer hover:bg-blue-100 px-1"
                            onClick={() => setCurrentId(node.id)}
                        >
                            {node.name.replace(':', '')}
                        </span>
                        {i < breadcrumbs.slice(1).length - 1 && <span className="text-gray-400 mx-1">&gt;</span>}
                    </span>
                ))}
            </div>
        </div>
        <div className="w-48 border border-gray-300 px-2 py-1 text-xs text-gray-500 hover:border-gray-400 truncate bg-white">
            Search {currentNode.name.split(' ')[0]}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 border-r border-gray-200 bg-white overflow-y-auto hidden sm:block py-2 text-black">
               <div className="px-2 mb-2 text-xs font-semibold text-gray-600">Quick access</div>
               <div 
                 className="pl-4 pr-2 py-1 flex items-center gap-2 hover:bg-[#E5F3FF] cursor-pointer text-xs"
                 onClick={() => setCurrentId('c-drive')}
               >
                   <Star size={14} className="text-blue-400" /> Desktop
               </div>
               <div 
                 className="pl-4 pr-2 py-1 flex items-center gap-2 hover:bg-[#E5F3FF] cursor-pointer text-xs"
                 onClick={() => setCurrentId('music')}
               >
                   <Music size={14} className="text-blue-400" /> Musics
               </div>
               <div className="pl-4 pr-2 py-1 flex items-center gap-2 hover:bg-[#E5F3FF] cursor-pointer text-xs">
                   <Download size={14} className="text-blue-400" /> Downloads
               </div>
               <div className="px-2 mt-4 mb-2 text-xs font-semibold text-gray-600">This PC</div>
               <div 
                 className="pl-4 pr-2 py-1 flex items-center gap-2 bg-[#E5F3FF] cursor-pointer text-xs"
                 onClick={() => setCurrentId('c-drive')}
               >
                    <Monitor size={14} className="text-gray-600" /> C: System
               </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white overflow-y-auto p-2">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2">
                {currentNode.children?.map((child) => (
                <div 
                    key={child.id}
                    onClick={() => handleNavigate(child)}
                    className="group flex flex-col items-center p-2 border border-transparent hover:bg-[#E5F3FF] hover:border-[#CCEAFF] cursor-default"
                >
                    <div className="mb-1">
                        {renderContentIcon(child)}
                    </div>
                    <span className="text-xs text-black text-center break-words w-full line-clamp-2 px-1 leading-tight">
                        {child.name}
                    </span>
                </div>
                ))}
            </div>
             {(!currentNode.children || currentNode.children.length === 0) && (
                <div className="text-center text-gray-400 mt-10 text-xs">This folder is empty.</div>
            )}
          </div>
      </div>

      {/* Footer */}
      <div className="h-6 bg-white border-t border-gray-200 flex items-center px-3 text-xs text-black gap-4">
          <span>{currentNode.children?.length || 0} items</span>
          <span className="border-l pl-4 border-gray-300"> 1 item selected </span>
      </div>
    </div>
  );
};