import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Trash2, Share2, Printer, MoreHorizontal } from 'lucide-react';

interface ImageViewerProps {
  url?: string;
  fileName?: string;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ url, fileName }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  if (!url) {
      return <div className="flex items-center justify-center h-full text-white bg-[#222]">No image loaded</div>;
  }

  return (
    <div className="flex flex-col h-full bg-[#222] text-white overflow-hidden select-none">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#2b2b2b] border-b border-[#333]">
         <div className="flex items-center gap-4">
             <button onClick={handleZoomIn} className="p-2 hover:bg-[#3d3d3d] rounded transition-colors" title="Zoom In">
                 <ZoomIn size={18} />
             </button>
             <button onClick={handleZoomOut} className="p-2 hover:bg-[#3d3d3d] rounded transition-colors" title="Zoom Out">
                 <ZoomOut size={18} />
             </button>
             <div className="h-4 w-[1px] bg-gray-600 mx-1"></div>
             <button onClick={handleRotate} className="p-2 hover:bg-[#3d3d3d] rounded transition-colors" title="Rotate">
                 <RotateCw size={18} />
             </button>
             <button className="p-2 hover:bg-[#3d3d3d] rounded transition-colors" title="Delete">
                 <Trash2 size={18} />
             </button>
         </div>

         <div className="font-medium text-sm text-gray-300 truncate max-w-[200px]">
             {fileName || 'Image'}
         </div>

         <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-[#3d3d3d] rounded transition-colors" title="Share">
                 <Share2 size={18} />
             </button>
             <button className="p-2 hover:bg-[#3d3d3d] rounded transition-colors" title="Print">
                 <Printer size={18} />
             </button>
             <button className="p-2 hover:bg-[#3d3d3d] rounded transition-colors">
                 <MoreHorizontal size={18} />
             </button>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center overflow-hidden bg-[#1e1e1e] relative">
          <div className="w-full h-full flex items-center justify-center overflow-auto p-8">
            <img 
                src={url} 
                alt={fileName} 
                className="max-w-full max-h-full object-contain transition-transform duration-200 ease-out shadow-2xl"
                style={{ 
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                }}
                draggable={false}
            />
          </div>
          
          <div className="absolute bottom-4 right-4 bg-black/50 px-3 py-1 rounded-full text-xs font-mono backdrop-blur-sm">
              {Math.round(zoom * 100)}%
          </div>
      </div>
    </div>
  );
};