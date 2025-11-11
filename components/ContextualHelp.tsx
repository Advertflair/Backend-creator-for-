import React, { useState, useContext, useRef, useEffect } from 'react';
import { ProjectState, Step, STEP_TITLES } from '../types';
import { ApiKeyContext } from '../context/ApiKeyContext';
import { progressManager } from '../utils/progressManager';
import { callGeminiApi } from '../api/gemini';

interface ContextualHelpProps {
  projectState: ProjectState;
  updateProjectState: (updater: (prevState: ProjectState) => ProjectState) => void;
}

const ContextualHelp: React.FC<ContextualHelpProps> = ({ projectState, updateProjectState }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey } = useContext(ApiKeyContext);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const relevantInteractions = projectState.aiInteractions.filter(i => i.step === projectState.currentStep);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, relevantInteractions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !apiKey) return;

    setIsLoading(true);
    const prompt = userInput;
    setUserInput('');

    try {
      const contextPrompt = progressManager.getContextForAI(projectState, prompt);
      const result = await callGeminiApi(apiKey, contextPrompt);
      
      updateProjectState(prev => ({
        ...prev,
        aiInteractions: [
          ...prev.aiInteractions,
          {
            timestamp: new Date().toISOString(),
            step: prev.currentStep,
            prompt: prompt,
            response: result,
          }
        ]
      }));

    } catch (error: any) {
      updateProjectState(prev => ({
        ...prev,
        aiInteractions: [
          ...prev.aiInteractions,
          {
            timestamp: new Date().toISOString(),
            step: prev.currentStep,
            prompt: prompt,
            response: "Sorry, I encountered an error. Please check your API key and try again.",
            error: error.message,
          }
        ]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  if (projectState.currentStep === Step.Welcome || projectState.currentStep === Step.Done) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-cyan-600 text-white rounded-full p-4 shadow-lg hover:bg-cyan-500 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 z-40"
        aria-label="Toggle AI Assistant"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10c5.515 0 10-4.486 10-10S17.515 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="M13 16h-2v-6h2v6zm-1-7.5c-.827 0-1.5-.673-1.5-1.5s.673-1.5 1.5-1.5 1.5.673 1.5-1.5-.673 1.5-1.5 1.5z"></path></svg>
      </button>
      
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-md bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 flex flex-col h-[60vh]">
          <header className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-lg font-bold text-white">AI Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">&times;</button>
          </header>

          <div className="flex-1 p-4 overflow-y-auto scrollbar-thin">
            <div className="space-y-4">
               <div className="p-3 bg-gray-700/50 rounded-lg text-sm text-cyan-200">
                 Ask me anything about the current step: <span className="font-bold">{STEP_TITLES[projectState.currentStep]}</span>
               </div>
              {relevantInteractions.map((interaction, index) => (
                <React.Fragment key={index}>
                  <div className="flex justify-end">
                    <p className="bg-cyan-600 text-white p-3 rounded-lg max-w-xs">{interaction.prompt}</p>
                  </div>
                  <div className="flex justify-start">
                    <p className="bg-gray-700 text-gray-200 p-3 rounded-lg max-w-xs whitespace-pre-wrap">{interaction.response}</p>
                  </div>
                </React.Fragment>
              ))}
              {isLoading && (
                 <div className="flex justify-start">
                    <p className="bg-gray-700 text-gray-200 p-3 rounded-lg max-w-xs">Thinking...</p>
                  </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask for help..."
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading || !userInput.trim()} className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 disabled:bg-gray-600">
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ContextualHelp;
