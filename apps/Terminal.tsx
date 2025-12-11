import React, { useState, useRef, useEffect } from 'react';
import { fileSystem } from '../constants';
import { findNodeById, formatPath, getPathToNode, resolvePathFromId } from '../utils/fsHelper';
import { FileType, AppId } from '../types';

interface TerminalProps {
  openWindow: (appId: AppId, title: string, data?: any) => void;
  onClose?: () => void;
}

type TerminalLine = {
  type: 'input' | 'output';
  content: React.ReactNode;
  path?: string;
};

export const Terminal: React.FC<TerminalProps> = ({ openWindow, onClose }) => {
  const [currentId, setCurrentId] = useState('c-drive'); // Start in C:
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'output', content: 'Microsoft Windows [Version 10.0.19045.3693]' },
    { type: 'output', content: '(c) Microsoft Corporation. All rights reserved.' },
    { type: 'output', content: <br /> },
    { type: 'output', content: 'Type "help" to see available commands.' },
  ]);
  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Get display path
  const pathNodes = getPathToNode(fileSystem, currentId) || [];
  const displayPath = formatPath(pathNodes);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(' '); // Join back to handle spaces

    const newHistory: TerminalLine[] = [
      ...history,
      { type: 'input', content: trimmed, path: displayPath }
    ];

    let output: React.ReactNode = '';

    // Drive Switching Logic (e.g., "d:", "c:")
    if (command.length === 2 && command.endsWith(':')) {
        const targetDriveName = command.toUpperCase();
        const root = fileSystem[0];
        // Look for the drive in root children (assuming simplified structure)
        const targetDrive = root.children?.find(c => c.name.startsWith(targetDriveName));
        
        if (targetDrive && targetDrive.type === FileType.DISK) {
            setCurrentId(targetDrive.id);
            output = null;
        } else {
            output = `The system cannot find the drive specified.`;
        }
        
        setHistory([...newHistory, ...(output ? [{ type: 'output', content: output } as TerminalLine] : [])]);
        return;
    }

    switch (command) {
      case 'help':
        output = (
          <div className="grid grid-cols-[100px_1fr] gap-2">
            <span>ls</span><span>List directory contents</span>
            <span>cd</span><span>Change directory (e.g. "cd Users" or "cd ..")</span>
            <span>cat</span><span>View file content</span>
            <span>clear</span><span>Clear terminal screen</span>
            <span>open</span><span>Open a file or application</span>
            <span>whoami</span><span>Display current user</span>
            <span>exit</span><span>Close the terminal</span>
            <span>d:</span><span>Switch to D drive (or c:)</span>
          </div>
        );
        break;
      
      case 'exit':
        if (onClose) onClose();
        return;

      case 'clear':
        setHistory([]);
        return; 

      case 'ls': {
        const node = findNodeById(fileSystem, currentId);
        if (node && node.children) {
          output = (
            <div className="flex flex-wrap gap-4">
              {node.children.map(child => (
                <span key={child.id} className={child.type === FileType.FOLDER || child.type === FileType.DISK ? 'text-blue-400 font-bold' : 'text-gray-300'}>
                  {child.name}
                </span>
              ))}
            </div>
          );
        } else {
            output = 'Directory is empty';
        }
        break;
      }

      case 'cd': {
        if (!args) {
             // Print current directory (like windows cd)
             output = displayPath;
        } else {
            // Check if user typed a drive letter like "cd d:" (technically windows just changes active drive context, but let's just switch)
            if (args.length === 2 && args.endsWith(':')) {
                 const targetDriveName = args.toUpperCase();
                 const root = fileSystem[0];
                 const targetDrive = root.children?.find(c => c.name.startsWith(targetDriveName));
                 if (targetDrive && targetDrive.type === FileType.DISK) {
                    setCurrentId(targetDrive.id);
                    output = null;
                 } else {
                    output = `The system cannot find the drive specified.`;
                 }
            } else {
                const target = resolvePathFromId(currentId, args);
                if (target) {
                    const targetNode = findNodeById(fileSystem, target);
                    if (targetNode?.type === FileType.FOLDER || targetNode?.type === FileType.DISK) {
                        setCurrentId(target);
                        output = null; 
                    } else {
                        output = `cd: not a directory: ${args}`;
                    }
                } else {
                    output = `cd: no such file or directory: ${args}`;
                }
            }
        }
        break;
      }

      case 'cat': {
        if (!args) {
            output = 'usage: cat <filename>';
        } else {
             const targetId = resolvePathFromId(currentId, args);
             if (targetId) {
                const targetNode = findNodeById(fileSystem, targetId);
                if (targetNode?.type === FileType.TEXT) {
                    output = <div className="whitespace-pre-wrap text-emerald-400">{targetNode.content}</div>;
                } else {
                    output = `cat: ${args}: Is a directory or binary`;
                }
             } else {
                output = `cat: ${args}: No such file`;
             }
        }
        break;
      }

      case 'whoami':
        output = 'user@windows';
        break;

      case 'open':
        if(!args) {
            output = 'usage: open <filename>';
        } else {
             const targetId = resolvePathFromId(currentId, args);
             if (targetId) {
                 const targetNode = findNodeById(fileSystem, targetId);
                 if(targetNode) {
                     if(targetNode.type === FileType.TEXT) {
                         openWindow('text-editor', targetNode.name, { content: targetNode.content });
                         output = `Opening ${targetNode.name}...`;
                     } else if (targetNode.type === FileType.LINK && targetNode.url) {
                         window.open(targetNode.url, '_blank');
                         output = `Opening ${targetNode.url}...`;
                     } else {
                         output = `Cannot open this file type via terminal. Try File Explorer.`;
                     }
                 }
             } else {
                 if (args === 'mail') {
                    openWindow('mail', 'Mail');
                    output = 'Launching Mail...';
                 } else {
                    output = `open: file not found: ${args}`;
                 }
             }
        }
        break;

      default:
        output = `'${command}' is not recognized as an internal or external command.`;
    }

    if (output) {
        newHistory.push({ type: 'output', content: output });
    }
    
    setHistory(newHistory);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        handleCommand(inputVal);
        setInputVal('');
    }
  };

  return (
    <div className="bg-[#0C0C0C] text-[#CCCCCC] h-full p-2 font-mono text-sm overflow-auto" onClick={() => document.getElementById('term-input')?.focus()}>
      {history.map((line, idx) => (
        <div key={idx} className="mb-0.5 leading-snug">
          {line.type === 'input' ? (
            <div className="break-all">
              <span className="mr-2">{line.path}&gt;</span>
              <span>{line.content}</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{line.content}</div>
          )}
        </div>
      ))}
      <div className="flex items-center">
        <span className="mr-2 whitespace-nowrap">{displayPath}&gt;</span>
        <input 
          id="term-input"
          type="text" 
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          className="bg-transparent border-none outline-none flex-1 text-[#CCCCCC] focus:ring-0 p-0"
          autoFocus
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};