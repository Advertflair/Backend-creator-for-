
import React from 'react';
import { ProjectState, Step, STEP_TITLES } from '../types';

interface ProgressDashboardProps {
  projectState: ProjectState;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ projectState }) => {
  const automationSteps = Object.keys(STEP_TITLES).filter(s => Number(s) >= Step.Analysis && Number(s) < Step.Done);
  const totalSteps = automationSteps.length;

  const completedSteps = Object.values(projectState.progress).filter(p => p.status === 'completed').length;
  const completionPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  
  const lastActivity = projectState.updatedAt ? new Date(projectState.updatedAt).toLocaleString() : 'N/A';
  const confidenceValues = Object.values(projectState.progress)
    .map(p => p.confidence)
    .filter((c): c is number => c !== undefined);
  const avgConfidence = confidenceValues.length > 0
    ? Math.round((confidenceValues.reduce((a, b) => a + b, 0) / confidenceValues.length) * 100)
    : null;

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 md:p-6 border border-gray-700 shadow-md mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        
        <div className="col-span-2 md:col-span-1">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Overall Progress</h3>
          <div className="flex items-center justify-center mt-2">
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span className="text-lg font-bold text-white ml-4">{completionPercentage}%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{completedSteps} of {totalSteps} agent steps complete</p>
        </div>

        <div className="border-t border-gray-700 md:border-t-0 md:border-l md:pl-4">
           <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Avg. Confidence</h3>
           <p className="text-2xl font-bold text-white mt-2">{avgConfidence !== null ? `${avgConfidence}%` : 'N/A'}</p>
           <p className="text-xs text-gray-500 mt-1">AI assurance score</p>
        </div>
        
        <div className="border-t border-gray-700 md:border-t-0 md:border-l md:pl-4">
           <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">AI Interactions</h3>
           <p className="text-2xl font-bold text-white mt-2">{projectState.aiInteractions.length}</p>
           <p className="text-xs text-gray-500 mt-1">questions asked</p>
        </div>
        
        <div className="border-t border-gray-700 md:border-t-0 md:border-l md:pl-4">
           <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Last Saved</h3>
           <p className="text-lg font-bold text-white mt-2">{lastActivity}</p>
           <p className="text-xs text-gray-500 mt-1">Project saves automatically</p>
        </div>

      </div>
    </div>
  );
};

export default ProgressDashboard;
