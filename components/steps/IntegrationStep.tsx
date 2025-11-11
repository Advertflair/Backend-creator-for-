
import React from 'react';
import StepContainer from '../StepContainer';
import CodeBlock from '../CodeBlock';
import { ProjectState } from '../../types';

interface IntegrationStepProps {
  projectState: ProjectState;
  onBack: () => void;
  onNext: () => void;
}

const IntegrationStep: React.FC<IntegrationStepProps> = ({ projectState, onBack, onNext }) => {
  const { allCode } = projectState;
  const code = allCode.integration;
  const isGenerated = !!code;

  const renderContent = () => {
    if (!isGenerated) {
       return (
        <div className="text-center p-8 bg-gray-900/50 rounded-lg border border-gray-700">
            <p className="text-lg text-gray-400">Frontend integration code will be generated here by the orchestration agent.</p>
        </div>
      );
    }

    return (
      <>
        <h3 className="font-semibold text-white">1. Configure Environment Variables</h3>
        <p>In your frontend project, create a `.env.local` file and add the URL of your deployed API.</p>
        <CodeBlock code={`REACT_APP_API_BASE_URL=${projectState.orchestrationState.deploymentOutput?.application.url || 'https://your-api-url.a.run.app'}`} language="bash" />

        <h3 className="font-semibold text-white mt-6">2. Create an API Client</h3>
        <p>Save this file as `src/apiClient.ts`.</p>
        <CodeBlock code={code.apiClientTs} language="typescript" />

        <h3 className="font-semibold text-white mt-6">3. Example Usage in a React Component</h3>
        <p>Here's how you can use the API client to fetch data.</p>
        <CodeBlock code={code.reactComponentExample} language="typescript" />
      </>
    );
  }

  return (
    <StepContainer
      title="Step H: Frontend Integration"
      description="Your backend is live! Here is the generated code to connect your frontend application to it."
      onBack={onBack}
      onNext={onNext}
      isNextDisabled={!isGenerated}
    >
      {renderContent()}
    </StepContainer>
  );
};

export default IntegrationStep;
