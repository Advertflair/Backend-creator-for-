
import React from 'react';
import StepContainer from '../StepContainer';
import CodeBlock from '../CodeBlock';
import { ProjectState } from '../../types';

interface OperationsStepProps {
  projectState: ProjectState;
  onBack: () => void;
  onNext: () => void;
}

const OperationsStep: React.FC<OperationsStepProps> = ({ projectState, onBack, onNext }) => {
  const { config, allCode } = projectState;
  const code = allCode.operations;
  const isGenerated = !!code;

  const renderContent = () => {
    if (!isGenerated) {
       return (
        <div className="text-center p-8 bg-gray-900/50 rounded-lg border border-gray-700">
            <p className="text-lg text-gray-400">Monitoring commands will be generated here by the orchestration agent.</p>
        </div>
      );
    }
    
    const isGcp = config.cloud === 'gcp';

    return (
      <>
        <h3 className="font-semibold text-white">1. Viewing Logs</h3>
        <p>You can view logs from your service using the {isGcp ? 'gcloud' : 'aws'} CLI.</p>
        <CodeBlock code={code.loggingCommand} language="bash" />
        <p className="mt-2">Filter for errors:</p>
        <CodeBlock code={code.errorLogCommand} language="bash" />
  
        <h3 className="font-semibold text-white mt-6">2. Monitoring Dashboards</h3>
         {isGcp ? (
             <p>GCP automatically creates monitoring dashboards for Cloud Run. You can view request count, latency, and container resource usage. Navigate to the <span className="font-bold text-cyan-400">Cloud Run</span> section in the GCP Console.</p>
         ) : (
             <p>AWS automatically creates monitoring dashboards for Lambda in CloudWatch. You can view invocations, duration, and error rates. Navigate to the <span className="font-bold text-cyan-400">Lambda &gt; Functions &gt; Monitor</span> tab in the AWS Console.</p>
         )}
  
        <h3 className="font-semibold text-white mt-6">3. Budget Alerts</h3>
        <p>It's crucial to set up budget alerts to avoid surprise bills. You can do this in the <span className="font-bold text-cyan-400">{isGcp ? 'Billing > Budgets & alerts' : 'AWS Budgets'}</span> section of your cloud console.</p>
  
        <h3 className="font-semibold text-white mt-6">4. Rollback Procedure</h3>
        {isGcp ? (
            <p>If you deploy a bad version, you can quickly roll back to a previous, stable revision from the Cloud Run service details page in the GCP Console.</p>
        ) : (
             <p>If you deploy a bad version of a Lambda function, you can redeploy a previous version or use aliases and versions to manage rollbacks.</p>
        )}
      </>
    );
  }

  return (
    <StepContainer
      title="Step I: Operations & Monitoring"
      description="Your application is deployed. Here are useful commands to monitor and maintain it."
      onBack={onBack}
      onNext={onNext}
      isNextDisabled={!isGenerated}
    >
        {renderContent()}
    </StepContainer>
  );
};

export default OperationsStep;
