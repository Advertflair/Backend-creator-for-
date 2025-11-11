import React from 'react';
import StepContainer from '../StepContainer';
import { ProjectState, Step, STEP_TITLES } from '../../types';

interface WelcomeStepProps {
  onNext: () => void;
  onRestart: () => void;
  onResume: (step: Step) => void;
  projectState: ProjectState;
}

const prerequisites = [
  "A Google Cloud account (free tier works)",
  "Payment method on file (required even for free tier)",
  "Frontend code ready (repo, zip, or key files)",
  "Cloud CLI installed (gcloud or aws)",
  "Terraform installed (>= 1.5)",
  "Node.js 20+ installed",
  "Git repository initialized",
];

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext, onRestart, onResume, projectState }) => {
  // A project is considered "in-progress" if it's not on the welcome step or has completed steps.
  const hasExistingProject = projectState.currentStep !== Step.Welcome || Object.keys(projectState.progress).length > 0;
  const lastStep = projectState.currentStep > Step.Welcome ? projectState.currentStep : Step.Input;

  if (hasExistingProject) {
    return (
      <StepContainer
        title="Welcome Back!"
        description="We found an existing project in your browser. Would you like to resume where you left off or start a new one?"
      >
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-white">Project Summary</h3>
          <p className="text-gray-400 mt-2">
            You were last on step: <span className="font-bold text-cyan-400">{STEP_TITLES[lastStep]}</span>
          </p>
          <p className="text-gray-400">
            Last updated: <span className="font-mono text-sm">{new Date(projectState.updatedAt).toLocaleString()}</span>
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onResume(lastStep)}
              className="px-8 py-3 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 transition-colors flex-1"
            >
              Resume Project
            </button>
            <button
              onClick={onRestart}
              className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors flex-1"
            >
              Start a New Project
            </button>
          </div>
        </div>
      </StepContainer>
    );
  }

  return (
    <StepContainer
      title="Backend Builder — Let's Get Started!"
      description="I'll help you deploy a production-ready backend from your frontend code. First, let's make sure you have everything you need."
      onNext={onNext}
      nextText="I'm Ready!"
    >
      <h3 className="text-xl font-semibold text-white mb-4">Prerequisites Check</h3>
      <ul className="space-y-3">
        {prerequisites.map((item, index) => (
          <li key={index} className="flex items-center">
            <svg className="h-6 w-6 flex-none text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="ml-3 text-gray-300">{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8 p-4 bg-gray-800 border border-cyan-500/30 rounded-lg">
        <p className="text-cyan-200">
          This wizard will guide you through a series of steps to configure, generate, and deploy your backend infrastructure and code. No commands will be run automatically; you will be provided with copy-pasteable commands to run in your own terminal.
        </p>
      </div>
    </StepContainer>
  );
};

export default WelcomeStep;
