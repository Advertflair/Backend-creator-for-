import React, { useState, useContext } from 'react';
import { ApiKeyContext } from '../context/ApiKeyContext';

const ApiKeyModal: React.FC = () => {
  const { apiKey: contextApiKey, setApiKey: setContextApiKey, validateKey, status } = useContext(ApiKeyContext);
  const [localApiKey, setLocalApiKey] = useState(contextApiKey);

  const handleTestAndSave = async () => {
    await validateKey(localApiKey);
  };
  
  const getStatusContent = () => {
    switch (status) {
      case 'testing':
        return (
          <div className="flex items-center text-yellow-300">
            <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="http://www.w3.org/2000/svg"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span>Testing...</span>
          </div>
        );
      case 'valid':
        return <span className="text-green-400">✓ Connection successful!</span>;
      case 'invalid':
        return <span className="text-red-400">✗ Invalid key or connection failed.</span>;
      default:
        return <span className="text-gray-400">Enter your key to begin.</span>;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 w-full max-w-lg text-white">
        <h2 className="text-2xl font-bold mb-2">Configure Gemini API Key</h2>
        <p className="text-gray-400 mb-4">
          Please provide your Gemini API key to use this application. Your key is stored securely in your browser's local storage and is never sent to our servers.
        </p>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-1">
              Your API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="h-6 text-sm flex items-center">
            {getStatusContent()}
          </div>
          
          <button
            onClick={handleTestAndSave}
            disabled={status === 'testing' || !localApiKey}
            className="w-full px-4 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'testing' ? 'Validating...' : 'Test & Save Key'}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          You can get a free API key from{' '}
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
            Google AI Studio
          </a>.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyModal;