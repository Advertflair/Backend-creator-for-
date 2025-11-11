
import React from 'react';
import { OrchestrationState } from '../types';

interface OrchestrationStatusProps {
  orchestrationState: OrchestrationState;
}

const OrchestrationStatus: React.FC<OrchestrationStatusProps> = ({ orchestrationState }) => {
  if (!orchestrationState || orchestrationState.status === 'idle') return null;

  const phases = ['analysis', 'design', 'generation', 'deployment'];
  const currentIndex = phases.indexOf(orchestrationState.currentPhase || 'analysis');
  const progress = orchestrationState.status === 'completed' ? 100 : ((currentIndex) / phases.length) * 100;
  
  const getPhaseData = (phaseKey: string) => {
    switch(phaseKey) {
        case 'analysis': return { confidence: orchestrationState.analysisConfidence, attempts: orchestrationState.analysisAttempts, output: true };
        case 'design': return { confidence: orchestrationState.designConfidence, attempts: orchestrationState.designAttempts, output: orchestrationState.designOutput };
        case 'generation': return { confidence: orchestrationState.generationConfidence, attempts: orchestrationState.generationAttempts, output: orchestrationState.generationOutput };
        case 'deployment': return { confidence: orchestrationState.deploymentConfidence, attempts: orchestrationState.deploymentAttempts, output: orchestrationState.deploymentOutput };
        default: return { confidence: 0, attempts: 0, output: false };
    }
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 md:p-6 border border-gray-700 shadow-md mb-8">
      <h2 className="text-xl font-bold text-white mb-4">🤖 AI Orchestration Status</h2>
      
      <div className="mb-6">
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              orchestrationState.status === 'failed' ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-400 to-teal-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {phases.map(phase => {
          const { confidence, attempts, output } = getPhaseData(phase);
          const isComplete = !!output;
          const isCurrent = orchestrationState.currentPhase === phase && orchestrationState.status === 'running';

          return (
            <div
              key={phase}
              className={`p-4 rounded-lg border text-center transition-all duration-300 ${
                isComplete
                  ? 'bg-gray-700/50 border-gray-600'
                  : isCurrent
                  ? 'bg-cyan-900/30 border-cyan-500/50 scale-105 shadow-lg'
                  : 'bg-gray-800/30 border-gray-700/50'
              }`}
            >
              <div className="text-sm font-medium text-white capitalize">{phase}</div>
              {isComplete ? (
                <div className="text-lg font-bold text-green-400 mt-1">
                  ✓ Done
                </div>
              ) : isCurrent ? (
                <div className="text-lg font-bold text-cyan-400 mt-1 animate-pulse">
                  Running...
                </div>
              ) : (
                 <div className="text-lg font-bold text-gray-500 mt-1">
                  Pending
                </div>
              )}
              {confidence ? <div className="text-xs text-gray-400">Conf: {Math.round(confidence * 100)}%</div> : null}
              {attempts ? <div className="text-xs text-gray-500">Attempts: {attempts}</div> : null}
            </div>
          );
        })}
      </div>

      {orchestrationState.status === 'completed' && orchestrationState.deploymentOutput && (
        <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
          <h3 className="text-lg font-bold text-green-400 mb-2">
            ✅ {orchestrationState.deploymentOutput.finalVerdict.replace(/_/g, ' ')}
          </h3>
          {orchestrationState.deploymentOutput.application.url && (
            <div className="mb-2">
              <span className="text-sm text-gray-300">Your backend is live at: </span>
              <a href={orchestrationState.deploymentOutput.application.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 font-mono text-sm">
                {orchestrationState.deploymentOutput.application.url}
              </a>
            </div>
          )}
        </div>
      )}

      {orchestrationState.status === 'failed' && orchestrationState.error && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <h3 className="text-lg font-bold text-red-400 mb-2">❌ Orchestration Failed during {orchestrationState.currentPhase} phase</h3>
          <p className="text-sm text-red-200 font-mono">{orchestrationState.error}</p>
        </div>
      )}
    </div>
  );
};

export default OrchestrationStatus;
