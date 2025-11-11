
import React from 'react';
import StepContainer from '../StepContainer';
import CodeBlock from '../CodeBlock';
import { ProjectState } from '../../types';

interface TestingStepProps {
  projectState: ProjectState;
  onBack: () => void;
  onNext: () => void;
}

const TestingStep: React.FC<TestingStepProps> = ({ projectState, onBack, onNext }) => {
  const { config, allCode } = projectState;
  const code = allCode.testing;
  const isGenerated = !!code;

  const renderContent = () => {
    if (!isGenerated) {
       return (
        <div className="text-center p-8 bg-gray-900/50 rounded-lg border border-gray-700">
            <p className="text-lg text-gray-400">A smoke test script will be generated here by the orchestration agent.</p>
        </div>
      );
    }
    
    const isGcp = config.cloud === 'gcp';
    const apiUrlCommand = projectState.orchestrationState.deploymentOutput?.application?.url || (isGcp ? "terraform output -raw api_url" : "terraform output -raw api_gateway_url");

    return (
      <>
        <h3 className="font-semibold text-white">1. Get your API URL</h3>
        <p>Your API should be live at the following URL from the deployment step:</p>
        <CodeBlock code={apiUrlCommand} />

        <h3 className="font-semibold text-white mt-6">2. Run Smoke Tests</h3>
        <p>The agent generated this script. Save it as `smoke-test.sh`, make it executable (`chmod +x smoke-test.sh`), and run it.</p>
        <CodeBlock code={code.smokeTestSh} language="bash" />
        <p>Execute the test:</p>
        <CodeBlock code={`./smoke-test.sh ${projectState.orchestrationState.deploymentOutput?.application?.url || 'YOUR_API_URL'}`} />
        
        <h3 className="font-semibold text-white mt-8">3. Promote to Production</h3>
        <p>Once the staging tests pass, you can create a production environment by duplicating your Terraform configuration and updating your CI/CD triggers for the production branch or tags.</p>
      </>
    );
  }
  
  return (
    <StepContainer
      title="Step G: Testing & Production Promotion"
      description="Your staging environment should be deployed. Let's use the generated smoke test before creating a production environment."
      onBack={onBack}
      onNext={onNext}
      isNextDisabled={!isGenerated}
    >
      {renderContent()}
    </StepContainer>
  );
};

export default TestingStep;
