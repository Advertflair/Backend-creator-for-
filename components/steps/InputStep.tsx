
import React from 'react';
import { AppConfig } from '../../types';
import StepContainer from '../StepContainer';

interface InputStepProps {
  config: AppConfig;
  // Fix: Changed setConfig prop type to be more specific to its usage within this component.
  // This resolves the type error in the parent App.tsx component.
  setConfig: (newConfig: AppConfig) => void;
  onBack: () => void;
  onNext: () => void;
}

const InputStep: React.FC<InputStepProps> = ({ config, setConfig, onBack, onNext }) => {
  return (
    <StepContainer
      title="Project Configuration"
      description="Let's configure your backend. We've set some sensible defaults based on the Master Prompt."
      onBack={onBack}
      onNext={onNext}
    >
      <div className="space-y-8">
        <div>
          <label htmlFor="cloud" className="block text-sm font-medium text-gray-300">Cloud Provider</label>
          <select
            id="cloud"
            name="cloud"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border-gray-600 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md text-white"
            value={config.cloud}
            onChange={(e) => setConfig({ ...config, cloud: e.target.value as 'gcp' | 'aws' })}
          >
            <option value="gcp">Google Cloud (GCP)</option>
            <option value="aws">Amazon Web Services (AWS)</option>
          </select>
          <p className="mt-2 text-sm text-gray-400">GCP is recommended for its simpler setup and generous free tiers for key services like Cloud Run and Firebase.</p>
        </div>

        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-300">Region</label>
          <input
            type="text"
            name="region"
            id="region"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border-gray-600 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md text-white"
            value={config.region}
            onChange={(e) => setConfig({ ...config, region: e.target.value })}
          />
          <p className="mt-2 text-sm text-gray-400">Default: `us-central1` (GCP) or `us-east-1` (AWS).</p>
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-300">Monthly Budget (USD)</label>
          <input
            type="number"
            name="budget"
            id="budget"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border-gray-600 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md text-white"
            value={config.budget}
            onChange={(e) => setConfig({ ...config, budget: parseInt(e.target.value, 10) })}
          />
          <p className="mt-2 text-sm text-gray-400">We will set up budget alerts to prevent unexpected costs.</p>
        </div>

        <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <h4 className="font-semibold text-white">Default Stack (GCP)</h4>
            <ul className="list-disc list-inside mt-2 text-gray-400 text-sm space-y-1">
                <li>Compute: Cloud Run</li>
                <li>Database: Firestore (NoSQL)</li>
                <li>Authentication: Firebase Auth</li>
                <li>File Storage: Cloud Storage</li>
                <li>CI/CD: Cloud Build</li>
            </ul>
        </div>
      </div>
    </StepContainer>
  );
};

export default InputStep;
