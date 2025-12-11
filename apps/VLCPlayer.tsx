import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, SkipBack, SkipForward, Volume2, VolumeX, Menu, Repeat, Shuffle, List, Music } from 'lucide-react';
import { findAllFilesByType } from '../utils/fsHelper';
import { fileSystem } from '../constants';
import { FileType, FileSystemNode } from '../types';

interface VLCPlayerProps {
  url?: string;
  fileName?: string;
}

export const VLCPlayer: React.FC<VLCPlayerProps> = ({ url: initialUrl, fileName: initialFileName }) => {
  const [playlist, setPlaylist] = useState<FileSystemNode[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
  const [view, setView] = useState<'playlist' | 'player'>('playlist'); // 'playlist' or 'player'
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showPermissionPopup, setShowPermissionPopup] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize
  useEffect(() => {
    if (initialUrl && initialFileName) {
        // Opened with a specific file
        setPlaylist([{ id: 'temp', name: initialFileName, type: FileType.AUDIO, url: initialUrl }]);
        setCurrentTrackIndex(0);
        setView('player');
    } else {
        // Opened from desktop, find all music
        const allAudio = findAllFilesByType(fileSystem, FileType.AUDIO);
        setPlaylist(allAudio);
        setView('playlist');
    }
  }, [initialUrl, initialFileName]);

  const currentTrack = currentTrackIndex >= 0 ? playlist[currentTrackIndex] : null;

  // Handle Audio Logic
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Load track if changed
    if (currentTrack && currentTrack.url && audio.src !== currentTrack.url) {
        audio.src = currentTrack.url;
        audio.play().then(() => setIsPlaying(true)).catch((err) => {
            console.warn("Autoplay blocked", err);
            setShowPermissionPopup(true);
            setIsPlaying(false);
        });
    }

    const updateProgress = () => setProgress(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const onEnded = () => {
       setIsPlaying(false);
       handleNext(); // Auto play next
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentTrack]);

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const stop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const vol = Number(e.target.value);
    audioRef.current.volume = vol;
    setVolume(vol);
  };

  const handleNext = () => {
      if (playlist.length === 0) return;
      const nextIndex = (currentTrackIndex + 1) % playlist.length;
      setCurrentTrackIndex(nextIndex);
  };

  const handlePrev = () => {
      if (playlist.length === 0) return;
      const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
      setCurrentTrackIndex(prevIndex);
  };

  const playTrackFromList = (index: number) => {
      setCurrentTrackIndex(index);
      setView('player');
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const grantAccess = () => {
      setShowPermissionPopup(false);
      audioRef.current?.play().then(() => setIsPlaying(true)).catch(e => console.error(e));
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-gray-200 font-sans select-none border-t border-gray-600">
      <audio ref={audioRef} />

      {/* Permission Popup */}
      {showPermissionPopup && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="bg-[#2d2d2d] p-6 rounded shadow-lg text-center max-w-sm border border-orange-500">
                <img src="https://img.icons8.com/color/96/vlc.png" alt="VLC" className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Audio Playback</h3>
                <p className="text-gray-300 text-sm mb-4">Browser settings prevented this file from auto-playing. Click below to start.</p>
                <button 
                    onClick={grantAccess}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded font-medium"
                >
                    Allow Playback
                </button>
            </div>
        </div>
      )}

      {/* Menu Bar */}
      <div className="flex items-center space-x-4 px-2 py-1 bg-[#2d2d2d] text-xs text-gray-300 border-b border-gray-600">
         <span className="cursor-pointer hover:bg-white/10 px-1 rounded">Media</span>
         <span className="cursor-pointer hover:bg-white/10 px-1 rounded">Playback</span>
         <span className="cursor-pointer hover:bg-white/10 px-1 rounded">Audio</span>
         <span className="cursor-pointer hover:bg-white/10 px-1 rounded">Video</span>
         <span className="cursor-pointer hover:bg-white/10 px-1 rounded">Subtitle</span>
         <span className="cursor-pointer hover:bg-white/10 px-1 rounded">Tools</span>
         <span className="cursor-pointer hover:bg-white/10 px-1 rounded">View</span>
         <span className="cursor-pointer hover:bg-white/10 px-1 rounded">Help</span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#121212] relative overflow-hidden flex flex-col">
          {view === 'playlist' ? (
              <div className="flex-1 flex flex-col">
                  {/* Playlist Header */}
                  <div className="bg-white text-black text-xs font-semibold flex border-b border-gray-300">
                      <div className="flex-1 px-2 py-1 border-r border-gray-200">Title</div>
                      <div className="w-24 px-2 py-1 border-r border-gray-200">Duration</div>
                      <div className="w-32 px-2 py-1">Artist</div>
                  </div>
                  {/* Playlist Items */}
                  <div className="flex-1 overflow-y-auto bg-white text-black">
                      {playlist.length === 0 ? (
                          <div className="p-4 text-gray-500 text-sm italic">No audio files found on PC.</div>
                      ) : (
                          playlist.map((track, idx) => (
                              <div 
                                key={track.id}
                                onDoubleClick={() => playTrackFromList(idx)}
                                className={`flex text-xs cursor-pointer ${idx === currentTrackIndex ? 'bg-[#3299BB] text-white' : 'hover:bg-gray-100 odd:bg-gray-50'}`}
                              >
                                  <div className="flex-1 px-2 py-1 flex items-center gap-2">
                                      <Music size={12} className={idx === currentTrackIndex ? 'text-white' : 'text-orange-500'} />
                                      <span className="truncate">{track.name}</span>
                                  </div>
                                  <div className="w-24 px-2 py-1 opacity-80">--:--</div>
                                  <div className="w-32 px-2 py-1 opacity-80">Unknown</div>
                              </div>
                          ))
                      )}
                  </div>
              </div>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center relative bg-black">
                {/* Visualizer Background */}
                 <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-30">
                     {[...Array(30)].map((_, i) => (
                         <div 
                            key={i} 
                            className="w-2 bg-orange-500 transition-all duration-75 ease-in-out"
                            style={{ 
                                height: isPlaying ? `${Math.random() * 80 + 10}%` : '5%',
                                opacity: isPlaying ? 1 : 0.3
                            }}
                         ></div>
                     ))}
                 </div>
                 <img src="https://img.icons8.com/color/96/vlc.png" alt="Cone" className="w-24 h-24 z-10 opacity-80" />
                 <div className="z-10 mt-4 text-orange-500 font-bold text-lg tracking-wider drop-shadow-md">
                     {currentTrack?.name || "No Track Selected"}
                 </div>
             </div>
          )}
      </div>

      {/* Controls Area */}
      <div className="h-20 bg-[#f0f0f0] text-black flex flex-col px-4 py-2 border-t border-gray-400">
         {/* Seeker */}
         <div className="flex items-center gap-3 text-xs font-mono text-gray-600 mb-1">
             <span>{formatTime(progress)}</span>
             <input 
                type="range" 
                min={0} 
                max={duration || 100} 
                value={progress}
                onChange={handleSeek}
                className="flex-1 h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-orange-600"
             />
             <span>{formatTime(duration)}</span>
         </div>

         {/* Buttons */}
         <div className="flex items-center justify-between mt-1">
             <div className="flex items-center gap-4">
                 <button onClick={togglePlay} className="p-1 hover:bg-gray-300 rounded">
                     {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" />}
                 </button>
                 <button onClick={stop} className="p-1 hover:bg-gray-300 rounded">
                     <Square size={16} fill="black" />
                 </button>
                 <button onClick={handlePrev} className="p-1 hover:bg-gray-300 rounded">
                     <SkipBack size={18} fill="black" />
                 </button>
                 <button onClick={handleNext} className="p-1 hover:bg-gray-300 rounded">
                     <SkipForward size={18} fill="black" />
                 </button>
             </div>

             <div className="flex items-center gap-4 text-gray-600">
                {/* Toggle Playlist Button */}
                <button 
                    onClick={() => setView(view === 'playlist' ? 'player' : 'playlist')}
                    className={`p-1 rounded ${view === 'playlist' ? 'bg-gray-300 shadow-inner' : 'hover:bg-gray-300'}`}
                    title="Toggle Playlist"
                >
                     <List size={18} />
                </button>
                <button className="p-1 hover:bg-gray-300 rounded hidden sm:block">
                     <Shuffle size={16} />
                </button>
                <button className="p-1 hover:bg-gray-300 rounded hidden sm:block">
                     <Repeat size={16} />
                </button>
                <div className="flex items-center gap-2 w-32">
                     <button onClick={() => setVolume(v => v === 0 ? 1 : 0)}>
                        {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                     </button>
                     <input 
                        type="range" 
                        min={0} 
                        max={1} 
                        step={0.05} 
                        value={volume}
                        onChange={handleVolume}
                        className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-orange-600"
                     />
                </div>
                <button className="p-1 hover:bg-gray-300 rounded">
                     <Menu size={18} />
                </button>
             </div>
         </div>
      </div>
    </div>
  );
};