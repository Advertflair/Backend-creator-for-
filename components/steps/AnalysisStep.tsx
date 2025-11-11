
import React, { useState, useContext, useEffect } from 'react';
import StepContainer from '../StepContainer';
import { ProjectState, Step, AnalysisOutput } from '../../types';
import { ApiKeyContext } from '../../context/ApiKeyContext';
import JSZip from 'jszip';

interface AnalysisStepProps {
  projectState: ProjectState;
  onBack: () => void;
  onNext: () => void;
  updateProjectState: (updater: (prevState: ProjectState) => ProjectState) => void;
  setFrontendCode: (code: string) => void;
}

const AnalysisStep: React.FC<AnalysisStepProps> = ({ projectState, onBack, onNext, updateProjectState, setFrontendCode }) => {
  const [localCode, setLocalCode] = useState('');
  const [fileName, setFileName] = useState('');
  const [isProcessingZip, setIsProcessingZip] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
      setFrontendCode(localCode);
  }, [localCode, setFrontendCode]);

  const { analysisOutput } = projectState;
  const progress = projectState.progress[Step.Analysis];
  const isRunning = progress?.status === 'in-progress';
  const isCompleted = progress?.status === 'completed';
  const hasError = progress?.status === 'error';

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError('');
    setLocalCode('');
    
    if (file.name.endsWith('.zip')) {
      setIsProcessingZip(true);
      try {
        const zip = await JSZip.loadAsync(file);
        const relevantFiles: { path: string, content: string }[] = [];
        const filePromises = Object.keys(zip.files).map(async (relativePath) => {
          const zipEntry = zip.files[relativePath];
          if (!zipEntry.dir) {
            const path = zipEntry.name.toLowerCase();
            const isIgnoredDir = path.includes('node_modules/') || path.includes('/.git/') || path.includes('/dist/') || path.includes('/build/') || path.includes('/.vscode/');
            const isBinary = /\.(png|jpe?g|gif|bmp|webp|svg|woff2?|eot|ttf|otf|mp3|mp4|webm|ico|pdf)$/i.test(path);
            if (!isIgnoredDir && !isBinary) {
              try {
                const content = await zipEntry.async('string');
                relevantFiles.push({ path: zipEntry.name, content });
              } catch (e) {
                console.warn(`Could not read file ${zipEntry.name} as text.`, e);
              }
            }
          }
        });
        await Promise.all(filePromises);
        const concatenatedContent = relevantFiles.map(f => `--- File: ${f.path} ---\n${f.content}`).join('\n\n');
        setLocalCode(concatenatedContent);
      } catch (err) {
        setError('Failed to process ZIP file.');
      } finally {
        setIsProcessingZip(false);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (event) => setLocalCode(event.target?.result as string);
      reader.readAsText(file);
    }
  };
  
  const handleReanalyze = () => {
    updateProjectState(prev => ({
        ...prev,
        analysisOutput: null,
        analysisResult: '',
        progress: {
            ...prev.progress,
            [Step.Analysis]: { status: 'pending' }
        }
    }));
    setFileName('');
    setLocalCode('');
  };
  
  const renderAnalysisOutput = (output: AnalysisOutput) => (
    <div className="space-y-6">
        <h3 className="text-lg font-semibold text-cyan-400">Architecture Decisions</h3>
        <ul className="list-disc list-inside text-gray-300">
            {output.architecture?.map(a => <li key={a.service}><strong>{a.service}:</strong> {a.justification}</li>)}
        </ul>
        
        <h3 className="text-lg font-semibold text-cyan-400">Detected API Endpoints</h3>
        <ul className="list-disc list-inside text-gray-300">
            {output.apiEndpoints?.map(e => <li key={e.path}><strong>{e.method} {e.path}:</strong> {e.description}</li>)}
        </ul>

        <h3 className="text-lg font-semibold text-cyan-400">Inferred Data Model</h3>
        {output.dataModel?.map(model => (
            <div key={model.name} className="ml-4">
                <h4 className="font-semibold text-gray-200">{model.name}</h4>
                <ul className="list-disc list-inside text-gray-400">
                    {model.fields?.map(f => <li key={f.name}><strong>{f.name} ({f.type}):</strong> {f.description}</li>)}
                </ul>
            </div>
        ))}
        
        <h3 className="text-lg font-semibold text-cyan-400">Estimated Cost</h3>
        <p className="text-gray-300">{output.costEstimate}</p>
    </div>
  );

  return (
    <StepContainer
      title="Frontend Analysis & API Contract"
      description="Upload your frontend project to automatically design the backend. The analysis will run as part of the automated process."
      onBack={onBack}
      onNext={isCompleted ? onNext : undefined}
      isNextDisabled={!isCompleted}
      nextText={isCompleted ? "This looks correct, proceed" : "Continue"}
    >
      {!isCompleted && !isRunning ? (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload Frontend Project (.zip) or Single File
            </label>
            <input type="file" accept=".zip,.json,.js,.jsx,.ts,.tsx,.txt" onChange={handleFileUpload}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-500 cursor-pointer"
            />
            {fileName && <p className="mt-2 text-sm text-gray-400">Selected: <span className="font-medium text-gray-300">{fileName}</span></p>}
            {isProcessingZip && <p className="mt-2 text-sm text-yellow-300">Processing ZIP...</p>}
          </div>
          <div className="text-center text-gray-400">— OR —</div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Paste Code or API Wish-list</label>
            <textarea rows={12}
              className="block w-full text-sm bg-gray-700 border-gray-600 rounded-md text-white p-4 font-mono scrollbar-thin"
              placeholder="Paste package.json, or describe your API needs..." value={localCode}
              onChange={(e) => { setLocalCode(e.target.value); setFileName(''); }}
            />
          </div>
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 text-sm text-gray-400">
            Provide your frontend code here. When you start the automation from the controls above, this code will be used by the Analysis Agent to design your backend.
          </div>
        </div>
      ) : isRunning ? (
         <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-900/50 rounded-lg border border-gray-700">
             <svg className="animate-spin h-10 w-10 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg text-white">Analysis Agent is running...</p>
            <p className="text-gray-400">The AI is generating your backend plan. This may take a moment.</p>
          </div>
      ) : hasError ? (
        <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-md text-red-200">
          <p className="font-bold">Analysis Failed</p>
          <p className="text-sm">{progress?.error}</p>
        </div>
      ) : ( // isCompleted
        <div className="space-y-6">
          <div className="p-4 sm:p-6 bg-gray-900/50 rounded-lg border border-cyan-500/30">
            {analysisOutput ? renderAnalysisOutput(analysisOutput) : <p>Analysis complete, but no output data found.</p>}
          </div>
          <div className="flex justify-between items-center">
            <button onClick={handleReanalyze} className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">Re-analyze</button>
            <p className="text-cyan-300 text-sm text-right">Does this match your expectations? <br/> The orchestrator will proceed automatically.</p>
          </div>
        </div>
      )}
    </StepContainer>
  );
};

export default AnalysisStep;
