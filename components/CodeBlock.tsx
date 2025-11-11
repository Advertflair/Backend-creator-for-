
import React, { useState, useCallback } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'bash' }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [code]);

  return (
    <div className="bg-gray-800 rounded-lg my-4 relative group">
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
        <span className="text-xs font-sans text-gray-400 uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold py-1 px-3 rounded-md transition-all duration-200 opacity-50 group-hover:opacity-100"
        >
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 text-sm text-gray-200 overflow-x-auto scrollbar-thin">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
