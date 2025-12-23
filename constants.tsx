import React from 'react';
import { FileSystemNode, FileType } from './types';
import { HardDrive, Folder, FileText, Globe, Github, Gamepad2, Code2, GraduationCap, User, Music } from 'lucide-react';

export const INITIAL_WINDOW_Z_INDEX = 10;

// Virtual File System Data
export const fileSystem: FileSystemNode[] = [
  {
    id: 'root',
    name: 'Root',
    type: FileType.FOLDER,
    children: [
      {
        id: 'c-drive',
        name: 'C: System',
        type: FileType.DISK,
        icon: <HardDrive className="w-10 h-10 text-gray-500" />,
        children: [
          {
            id: 'users',
            name: 'Users',
            type: FileType.FOLDER,
            icon: <User className="w-10 h-10 text-blue-500" />,
            children: [
              {
                id: 'about',
                name: 'About_Me.txt',
                type: FileType.TEXT,
                content: `HI! I'M A CREATIVE DEVELOPER.

I specialize in building high-quality interactive web applications. 
My passion lies in bridging the gap between engineering and design.

- Location: Internet
- Status: Open to work
- Vibe: Curious & Driven`
              },
              {
                id: 'profile-pic',
                name: 'Profile_Pic.jpg',
                type: FileType.IMAGE,
                url: '/images/Bibhabasu.jpg'
              },
              {
                id: 'skills',
                name: 'Tech_Stack.txt',
                type: FileType.TEXT,
                content: `TECHNICAL SKILLS

Frontend:
- React, Vue, Svelte
- Tailwind CSS, Framer Motion
- TypeScript

Backend:
- Node.js, Express
- PostgreSQL, MongoDB
- Python

Tools:
- Git, Docker, AWS
- Figma, Adobe XD`
              },
              {
                id: 'education',
                name: 'Education.txt',
                type: FileType.TEXT,
                content: `EDUCATION PROFILE

Bachelor of Computer Science
University of Technology
2019 - 2023
- Major in Software Engineering
- Graduated with Honors

Certifications:
- AWS Certified Cloud Practitioner
- Meta Frontend Developer Professional Certificate`
              },
              {
                id: 'hobbies',
                name: 'Hobbies.txt',
                type: FileType.TEXT,
                content: `WHEN I'M NOT CODING...

1. Photography: Capturing urban landscapes.
2. Gaming: Big fan of RPGs and Strategy games.
3. Reading: Sci-Fi and Technical blogs.
4. Coffee: Brewing the perfect V60 pour-over.`
              }
            ]
          },
          {
            id: 'music',
            name: 'Musics',
            type: FileType.FOLDER,
            icon: <Music className="w-10 h-10 text-orange-500" />,
            children: [
              {
                id: 'song-1',
                name: 'Pal Pal Dil Ke Paas.mp3',
                type: FileType.AUDIO,
                url: '/music/Pal-Pal-Dil-Ke-Paas.mp3' 
              }
            ]
          }
        ]
      },
      {
        id: 'd-drive',
        name: 'D: Projects',
        type: FileType.DISK,
        icon: <HardDrive className="w-10 h-10 text-gray-500" />,
        children: [
          {
            id: 'proj-1',
            name: 'QueryDF',
            type: FileType.FOLDER,
            children: [
              {
                id: 'p1-readme',
                name: 'README.txt',
                type: FileType.TEXT,
                content: `=>Engineered an intelligent RAG (Retrieval-Augmented Generation) system with automated PDF processing pipeline
using Inngest background jobs, extracting and chunking text with LangChain splitters for semantic analysis.
=> Architected vector search infrastructure using Jina API embeddings and Qdrant vector database for semantic
retrieval, integrated with Google Gemini API for context-aware question answering with Cloudinary for document
storage.
=> Techstack used: JavaScript, Node.js, Express.js, React, Qdrant, Gemini API, Inngest, Cloudinary, Tailwind CSS`
              },
              {
                id: 'p1-live',
                name: 'Live Demo',
                type: FileType.LINK,
                url: 'https://query-df-server.vercel.app/',
                icon: <Globe className="w-8 h-8 text-blue-400" />
              },
              {
                id: 'p1-repo',
                name: 'GitHub Repo',
                type: FileType.LINK,
                url: 'https://github.com/its-bismay/QueryDF',
                icon: <Github className="w-8 h-8 text-gray-800" />
              }
            ]
          },
          {
            id: 'proj-2',
            name: 'DevDrill',
            type: FileType.FOLDER,
            children: [
              {
                id: 'p2-readme',
                name: 'README.txt',
                type: FileType.TEXT,
                content: `=> Built a full-stack web application enabling developers to practice DSA problems with real-time collaboration through
video calling and chat functionality, supporting paired programming sessions between host and participant.
=> Implemented secure user authentication with Clerk, real-time video communication via Stream API, and live code
execution using Piston API, with MongoDB for data persistence.
=> Techstack used: JavaScript, React, Node.js, Express.js, MongoDB, Tailwind CSS, DaisyUI`
              },
                            {
                id: 'p1-live',
                name: 'Live Demo',
                type: FileType.LINK,
                url: 'https://dev-drill-com.vercel.app/',
                icon: <Globe className="w-8 h-8 text-blue-400" />
              },
              {
                id: 'p2-repo',
                name: 'Source Code',
                type: FileType.LINK,
                url: 'https://github.com/its-bismay/DevDrill.com',
                icon: <Github className="w-8 h-8 text-gray-800" />
              }
            ]
          }
        ]
      }
    ]
  }
];