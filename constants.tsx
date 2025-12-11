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
            name: 'E-Commerce Platform',
            type: FileType.FOLDER,
            children: [
              {
                id: 'p1-readme',
                name: 'README.txt',
                type: FileType.TEXT,
                content: `PROJECT: NEXTGEN COMMERCE

A full-stack e-commerce solution built with Next.js and Stripe.
Features include:
- Real-time inventory management
- Secure payment processing
- Admin dashboard`
              },
              {
                id: 'p1-live',
                name: 'Live Demo',
                type: FileType.LINK,
                url: 'https://example.com',
                icon: <Globe className="w-8 h-8 text-blue-400" />
              },
              {
                id: 'p1-repo',
                name: 'GitHub Repo',
                type: FileType.LINK,
                url: 'https://github.com',
                icon: <Github className="w-8 h-8 text-gray-800" />
              }
            ]
          },
          {
            id: 'proj-2',
            name: 'AI Task Manager',
            type: FileType.FOLDER,
            children: [
              {
                id: 'p2-readme',
                name: 'README.txt',
                type: FileType.TEXT,
                content: `PROJECT: SMART TASKS AI

An intelligent todo list that prioritizes your day using NLP.
Tech: React, Python (FastAPI), OpenAI API.`
              },
              {
                id: 'p2-repo',
                name: 'Source Code',
                type: FileType.LINK,
                url: 'https://github.com',
                icon: <Github className="w-8 h-8 text-gray-800" />
              }
            ]
          }
        ]
      }
    ]
  }
];