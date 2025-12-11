import React from 'react';

interface TextEditorProps {
    content?: string;
}

export const TextEditor: React.FC<TextEditorProps> = ({ content = "" }) => {
    return (
        <div className="bg-white h-full w-full font-mono text-sm p-4 overflow-auto text-gray-800 selection:bg-blue-200">
            <pre className="whitespace-pre-wrap font-inherit">{content}</pre>
        </div>
    );
};
