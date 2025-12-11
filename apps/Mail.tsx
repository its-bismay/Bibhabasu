import React, { useState } from 'react';
import { 
  Menu, Search, Settings, CircleHelp, Grip, User, 
  Pencil, Inbox, Star, Clock, Send as SendIcon, File, 
  Trash2, X, Paperclip, Link, Smile, Image as ImageIcon,
  MoreVertical, Minimize2, Maximize2, Bold, Italic, Underline
} from 'lucide-react';

export const MailApp: React.FC = () => {
  const [sent, setSent] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
        setSent(false);
        setSubject('');
        setMessage('');
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-gray-200 font-sans select-none">

      <header className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] shrink-0 border-b border-[#444746]">
        <div className="flex items-center gap-3 w-48 lg:w-60">
            <div className="p-2 hover:bg-[#333333] rounded-full cursor-pointer">
                 <Menu className="w-5 h-5 text-gray-200" />
            </div>
            <div className="flex items-center gap-1">
                <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png" alt="Gmail" className="h-6 opacity-90 object-contain filter invert brightness-200" />
            </div>
        </div>
        
        <div className="flex-1 max-w-2xl mx-2 lg:mx-4">
            <div className="bg-[#303134] flex items-center px-4 py-2.5 rounded-full transition-all cursor-text group focus-within:bg-white focus-within:shadow-md focus-within:border-gray-200 border border-transparent focus-within:bg-[#ffffff] focus-within:text-black">
                <Search className="w-5 h-5 text-gray-400 group-focus-within:text-gray-800" />
                <input 
                    type="text" 
                    placeholder="Search mail" 
                    className="bg-transparent border-none outline-none ml-3 w-full text-gray-200 placeholder-gray-400 group-focus-within:text-black" 
                />
            </div>
        </div>

        <div className="flex items-center gap-1 lg:gap-2 w-auto lg:w-60 justify-end">
            <div className="p-2 hover:bg-[#333333] rounded-full cursor-pointer hidden sm:block">
                <CircleHelp className="w-6 h-6 text-gray-200" />
            </div>
            <div className="p-2 hover:bg-[#333333] rounded-full cursor-pointer hidden sm:block">
                <Settings className="w-6 h-6 text-gray-200" />
            </div>
            <div className="p-2 hover:bg-[#333333] rounded-full cursor-pointer hidden sm:block">
                <Grip className="w-6 h-6 text-gray-200" />
            </div>
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm ml-1 lg:ml-2 cursor-pointer hover:ring-4 hover:ring-gray-700">
                D
            </div>
        </div>
      </header>


      <div className="flex flex-1 overflow-hidden">

        <aside className="w-64 pr-4 py-4 flex flex-col shrink-0 hidden md:flex">
             <div className="pl-4 mb-4">
                 <button className="flex items-center gap-3 bg-[#c2e7ff] hover:shadow-md transition-shadow text-[#001d35] px-6 py-4 rounded-2xl font-semibold text-sm">
                    <Pencil className="w-5 h-5" />
                    Compose
                 </button>
             </div>
             
             <nav className="flex-1 overflow-y-auto">
                 {[
                     { icon: Inbox, label: 'Inbox', active: false, count: 1 },
                     { icon: Star, label: 'Starred', active: false },
                     { icon: Clock, label: 'Snoozed', active: false },
                     { icon: SendIcon, label: 'Sent', active: true }, 
                     { icon: File, label: 'Drafts', active: false },
                     { icon: MoreVertical, label: 'More', active: false },
                 ].map((item, idx) => (
                     <div 
                        key={idx}
                        className={`flex items-center justify-between pl-6 pr-4 py-1.5 mx-0 rounded-r-full cursor-pointer mb-0.5 ${item.active ? 'bg-[#444746] text-[#c2e7ff] font-bold' : 'hover:bg-[#333333] text-gray-200'}`}
                    >
                        <div className="flex items-center gap-4">
                            <item.icon className="w-4 h-4" />
                            <span className="text-sm">{item.label}</span>
                        </div>
                        {item.count && <span className="text-xs font-semibold">{item.count}</span>}
                    </div>
                 ))}
                 
                 <div className="mt-4 px-6 text-sm font-medium text-gray-400">Labels</div>
                 <div className="flex items-center gap-4 pl-6 pr-4 py-1.5 hover:bg-[#333333] cursor-pointer text-gray-200">
                     <span className="w-4 h-4" /> 
                     <span className="text-sm">Personal</span>
                 </div>
                 <div className="flex items-center gap-4 pl-6 pr-4 py-1.5 hover:bg-[#333333] cursor-pointer text-gray-200">
                     <span className="w-4 h-4" /> 
                     <span className="text-sm">Work</span>
                 </div>
             </nav>
        </aside>


        <main className="flex-1 bg-[#1e1e1e] md:mr-4 md:mb-4 md:rounded-2xl shadow-sm overflow-hidden flex flex-col relative border border-[#444746]">
             {sent ? (
                 <div className="absolute inset-0 z-10 bg-[#1e1e1e] flex flex-col items-center justify-center">
                    <div className="bg-green-900/30 p-6 rounded-full mb-6">
                        <SendIcon className="w-12 h-12 text-green-400 ml-1" />
                    </div>
                    <h2 className="text-2xl text-gray-100 font-medium mb-2">Message Sent</h2>
                    <p className="text-gray-400">Thanks for reaching out! I'll be in touch.</p>
                    <button 
                        onClick={() => { setSent(false); setSubject(''); setMessage(''); }}
                        className="mt-8 text-blue-400 hover:bg-[#333333] px-4 py-2 rounded font-medium"
                    >
                        Send another message
                    </button>
                 </div>
             ) : (
                <>
                    <div className="flex items-center justify-between px-4 py-3 bg-[#1e1e1e] border-b border-[#444746] shrink-0">
                        <span className="font-medium text-sm text-gray-200">New Message</span>
                        <div className="flex gap-2">
                             <Minimize2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                             <Maximize2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                             <X className="w-4 h-4 text-gray-400 cursor-pointer hover:bg-[#444746] rounded-sm" />
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                        <div className="border-b border-[#444746] flex items-center bg-[#1e1e1e]">
                            <span className="pl-4 text-gray-400 text-sm">To</span>
                            <input 
                                type="text" 
                                value="bismaybibhabasu33@gmail.com"
                                readOnly
                                className="w-full px-2 py-2 outline-none text-sm text-gray-200 bg-[#1e1e1e] cursor-default"
                            />
                        </div>
                        <div className="border-b border-[#444746] bg-[#1e1e1e]">
                            <input 
                                type="text" 
                                placeholder="Subject" 
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-4 py-2 outline-none text-sm placeholder-gray-500 font-medium bg-[#1e1e1e] text-white"
                                required
                            />
                        </div>
                        <textarea 
                            className="flex-1 w-full p-4 outline-none resize-none text-sm font-sans text-gray-200 bg-[#1e1e1e]"
                            placeholder=""
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        ></textarea>
                        
                        <div className="px-4 py-3 flex items-center justify-between shrink-0 bg-[#1e1e1e]">
                            <div className="flex items-center gap-2">
                                <button 
                                    type="submit"
                                    className="bg-[#0b57d0] hover:bg-[#0947a8] text-white px-6 py-2 rounded-full text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                                >
                                    Send
                                </button>
                                <div className="flex items-center gap-0 text-gray-400 ml-2">
                                    <span className="p-1.5 hover:bg-[#333333] rounded cursor-pointer"><Bold className="w-4 h-4" /></span>
                                    <span className="p-1.5 hover:bg-[#333333] rounded cursor-pointer"><Italic className="w-4 h-4" /></span>
                                    <span className="p-1.5 hover:bg-[#333333] rounded cursor-pointer"><Underline className="w-4 h-4" /></span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Paperclip className="w-5 h-5 p-1.5 hover:bg-[#333333] rounded cursor-pointer" />
                                <Link className="w-5 h-5 p-1.5 hover:bg-[#333333] rounded cursor-pointer" />
                                <Smile className="w-5 h-5 p-1.5 hover:bg-[#333333] rounded cursor-pointer" />
                                <ImageIcon className="w-5 h-5 p-1.5 hover:bg-[#333333] rounded cursor-pointer" />
                                <Trash2 className="w-4 h-4 p-1.5 hover:bg-[#333333] rounded cursor-pointer ml-2 hover:text-gray-200" />
                            </div>
                        </div>
                    </form>
                </>
             )}
        </main>
      </div>
    </div>
  );
};