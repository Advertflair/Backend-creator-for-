
import React from 'react';
import { OrchestrationRunStatus, Step } from '../types';

interface OrchestratorControlsProps {
  status: OrchestrationRunStatus;
  setStatus: (status: OrchestrationRunStatus) => void;
  onRestart: () => void;
  currentStep: Step;
}

const OrchestratorControls: React.FC<OrchestratorControlsProps> = ({ status, setStatus, onRestart, currentStep }) => {

  const isIdle = status === 'idle';
  const isRunning = status === 'running';
  const isFinished = status === 'completed' || status === 'failed';
  const canStart = (isIdle || isFinished) && currentStep >= Step.Analysis && currentStep < Step.Done;

  const getStatusIndicator = () => {
    switch (status) {
      case 'idle':
        return <><span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>Idle</>;
      case 'running':
        return <><span className="w-3 h-3 bg-cyan-400 rounded-full mr-2 animate-pulse"></span>Running</>;
      case 'paused':
        return <><span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>Paused</>;
      case 'completed':
        return <><span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>Completed</>;
      case 'failed':
        return <><span className="w-3 h-3 bg-red-400 rounded-full mr-2"></span>Failed</>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
      <div className="flex items-center">
        <h3 className="text-lg font-bold text-white mr-4">Orchestrator</h3>
        <span className="flex items-center px-3 py-1 bg-gray-900 rounded-full text-sm font-medium">
          {getStatusIndicator()}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setStatus('running')}
          disabled={!canStart || isRunning}
          className="px-6 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2"
        >
          ▶️ Run Agents
        </button>
        <button
          onClick={() => setStatus('paused')}
          disabled={!isRunning}
          className="px-4 py-2 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          ⏸️
        </button>
        <button
          onClick={onRestart}
          className="px-4 py-2 bg-red-700 text-white font-semibold rounded-md hover:bg-red-600 transition-colors"
        >
          🔄
        </button>
      </div>
    </div>
  );
};

export default OrchestratorControls;
