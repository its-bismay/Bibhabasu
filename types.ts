import { ReactNode } from 'react';

export enum FileType {
  FOLDER = 'FOLDER',
  TEXT = 'TEXT',
  LINK = 'LINK',
  IMAGE = 'IMAGE',
  DISK = 'DISK',
  AUDIO = 'AUDIO',
}

export interface FileSystemNode {
  id: string;
  name: string;
  type: FileType;
  content?: string; // For text files
  url?: string; // For links or media
  icon?: ReactNode;
  children?: FileSystemNode[];
  parentId?: string;
}

export type AppId = 'explorer' | 'terminal' | 'mail' | 'text-editor' | 'browser' | 'vlc' | 'image-viewer';

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  data?: any; // To pass specific file paths or content to the app
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface OSContextType {
  windows: WindowState[];
  openWindow: (appId: AppId, title: string, data?: any) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  activeWindowId: string | null;
}