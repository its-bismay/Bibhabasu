import React, { useState, useEffect } from "react";
import { WindowState, AppId } from "./types";
import {
  Monitor,
  FolderOpen,
  Terminal as TerminalIcon,
  Mail,
  Github,
  Linkedin,
  User,
  Smartphone,
} from "lucide-react";
import { DesktopIcon } from "./components/DesktopIcon";
import { WindowFrame } from "./components/WindowFrame";
import { Taskbar } from "./components/Taskbar";
import { Terminal } from "./apps/Terminal";
import { FileExplorer } from "./apps/FileExplorer";
import { MailApp } from "./apps/Mail";
import { TextEditor } from "./apps/TextEditor";
import { VLCPlayer } from "./apps/VLCPlayer";
import { ImageViewer } from "./apps/ImageViewer";
import { INITIAL_WINDOW_Z_INDEX } from "./constants";

const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [zIndexCounter, setZIndexCounter] = useState(INITIAL_WINDOW_Z_INDEX);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      // Check if width is less than standard tablet size (768px)
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const openWindow = (appId: AppId, title: string, data?: any) => {
    const existing = windows.find(
      (w) => w.appId === appId && w.title === title
    );
    if (existing) {
      if (existing.isMinimized) {
        setWindows((prev) =>
          prev.map((w) =>
            w.id === existing.id ? { ...w, isMinimized: false } : w
          )
        );
      }
      focusWindow(existing.id);
      return;
    }

    const newWindow: WindowState = {
      id: Date.now().toString(),
      appId,
      title,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: zIndexCounter + 1,
      data,
      position: { x: 50 + windows.length * 30, y: 50 + windows.length * 30 },
      size: { width: 800, height: 600 },
    };

    setWindows([...windows, newWindow]);
    setZIndexCounter((prev) => prev + 1);
    setActiveWindowId(newWindow.id);
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const focusWindow = (id: string) => {
    setActiveWindowId(id);
    setZIndexCounter((prev) => prev + 1);
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, zIndex: zIndexCounter + 1, isMinimized: false }
          : w
      )
    );
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    setActiveWindowId(null);
  };

  const maximizeWindow = (id: string) => {
    // Toggle logic usually handled in visual component or here if we needed persistence
  };

  const handleTaskbarClick = (id: string) => {
    const win = windows.find((w) => w.id === id);
    if (!win) return;

    if (win.isMinimized) {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, isMinimized: false } : w))
      );
      focusWindow(id);
    } else {
      if (activeWindowId === id) {
        minimizeWindow(id);
      } else {
        focusWindow(id);
      }
    }
  };

  const renderAppContent = (windowId: string, appId: AppId, data?: any) => {
    switch (appId) {
      case "terminal":
        return (
          <Terminal
            openWindow={openWindow}
            onClose={() => closeWindow(windowId)}
          />
        );
      case "explorer":
        return (
          <FileExplorer
            initialPathId={data?.pathId || "c-drive"}
            openWindow={openWindow}
          />
        );
      case "mail":
        return <MailApp />;
      case "text-editor":
        return <TextEditor content={data?.content} />;
      case "vlc":
        return <VLCPlayer url={data?.url} fileName={data?.fileName} />;
      case "image-viewer":
        return <ImageViewer url={data?.url} fileName={data?.fileName} />;
      default:
        return <div className="p-4">App not found</div>;
    }
  };

  const MyComputerIcon = (
    <div className="w-full h-full">
      <img
        src="https://img.icons8.com/?size=100&id=dtfUgnDX3Hss&format=png&color=000000"
        alt="PC"
        className="object-contain w-full h-full"
      />
    </div>
  );
  const FolderIcon = (
    <div className="w-full h-full">
      <img
        src="https://img.icons8.com/color/96/folder-invoices--v1.png"
        alt="Folder"
        className="object-contain w-full h-full"
      />
    </div>
  );
  const TerminalIconImg = (
    <div className="w-full h-full bg-black border-2 border-gray-400 rounded-sm flex items-center justify-center text-white font-mono text-xs shadow-sm">
      &gt;_
    </div>
  );

  if (isMobile) {
    return (
      <div className="h-screen w-screen bg-[#111] flex flex-col items-center justify-center text-white p-6 relative overflow-hidden select-none">
        <div
          className="absolute inset-0 z-0 opacity-30"
          style={{
            background:
              'url("https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop") center/cover no-repeat',
            filter: "blur(10px)",
          }}
        />
        <div className="bg-[#222] bg-opacity-90 p-8 rounded-xl border border-gray-600 shadow-2xl max-w-sm flex flex-col items-center text-center relative z-10">
          <Monitor size={64} className="text-blue-500 mb-6" />
          <h1 className="text-xl font-bold mb-3">
            Desktop Experience Required
          </h1>
          <p className="text-gray-300 text-sm mb-6 leading-relaxed">
            This portfolio is designed as a fully interactive desktop operating
            system simulation.
          </p>
          <p className="text-gray-400 text-xs border-t border-gray-600 pt-4 w-full">
            Please access this site on a{" "}
            <span className="text-white font-semibold">Tablet</span> or{" "}
            <span className="text-white font-semibold">Desktop</span> for the
            practical UI experience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen w-screen overflow-hidden relative select-none"
      style={{
        background: 'url("/windowsBG.webp") center/cover no-repeat',
      }}
    >
      <div className="relative z-0 p-2 grid grid-flow-col grid-rows-[repeat(auto-fill,100px)] gap-2 w-fit h-[calc(100%-40px)] content-start items-start">
        <DesktopIcon
          label="This PC"
          icon={MyComputerIcon}
          onClick={() => openWindow("explorer", "This PC", { pathId: "root" })}
        />
        <DesktopIcon
          label="Bibhabasu"
          icon={
            <div className="w-full h-full">
              <img
                src="https://img.icons8.com/?size=100&id=13042&format=png&color=000000"
                alt="User"
                className="object-contain w-full h-full"
              />
            </div>
          }
          onClick={() => openWindow("explorer", "Profile", { pathId: "users" })}
        />
        <DesktopIcon
          label="Projects"
          icon={FolderIcon}
          onClick={() =>
            openWindow("explorer", "Projects", { pathId: "d-drive" })
          }
        />
        <DesktopIcon
          label="Terminal"
          icon={TerminalIconImg}
          onClick={() => openWindow("terminal", "Command Prompt")}
        />
        <DesktopIcon
          label="Contact"
          icon={
            <div className="w-full h-full">
              <img
                src="https://img.icons8.com/color/96/gmail-new.png"
                alt="Mail"
                className="object-contain w-full h-full"
              />
            </div>
          }
          onClick={() => openWindow("mail", "Mail")}
        />
        <DesktopIcon
          label="VLC Player"
          icon={
            <div className="w-full h-full">
              <img
                src="https://img.icons8.com/color/96/vlc.png"
                alt="VLC"
                className="object-contain w-full h-full"
              />
            </div>
          }
          onClick={() => openWindow("vlc", "VLC Media Player")}
        />
        <DesktopIcon
          label="GitHub"
          icon={<Github size={40} className="text-white drop-shadow-md" />}
          onClick={() => window.open("https://github.com/its-bismay", "_blank")}
        />
      </div>

      {/* Windows Layer */}
      {windows.map(
        (win) =>
          !win.isMinimized && (
            <WindowFrame
              key={win.id}
              title={win.title}
              isActive={activeWindowId === win.id}
              zIndex={win.zIndex}
              initialPosition={win.position}
              initialSize={win.size}
              onClose={() => closeWindow(win.id)}
              onMinimize={() => minimizeWindow(win.id)}
              onMaximize={() => maximizeWindow(win.id)}
              onFocus={() => focusWindow(win.id)}
            >
              {renderAppContent(win.id, win.appId, win.data)}
            </WindowFrame>
          )
      )}

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        activeWindowId={activeWindowId}
        onWindowClick={handleTaskbarClick}
        onStartClick={() => alert("Start Menu would go here!")}
      />
    </div>
  );
};

export default App;
