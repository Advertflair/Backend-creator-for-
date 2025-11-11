
import React from 'react';
import StepContainer from '../StepContainer';
import CodeBlock from '../CodeBlock';
import { ProjectState } from '../../types';

interface CiCdStepProps {
  projectState: ProjectState;
  onBack: () => void;
  onNext: () => void;
}

const CiCdStep: React.FC<CiCdStepProps> = ({ projectState, onBack, onNext }) => {
    const { config, allCode } = projectState;
    const code = allCode.ciCd;
    const isGenerated = !!code;
    
  const renderContent = () => {
    if (!isGenerated) {
       return (
        <div className="text-center p-8 bg-gray-900/50 rounded-lg border border-gray-700">
            <p className="text-lg text-gray-400">CI/CD configuration will be generated here by the orchestration agent.</p>
        </div>
      );
    }

    const isGcp = config.cloud === 'gcp';
    const pipelineFileName = isGcp ? 'cloudbuild.yaml' : 'deploy-staging.yml';
    const pipelineLanguage = 'yaml';

    return (
      <>
        {code.dockerfile && isGcp && (
        <>
          <h3 className="font-semibold text-white">File: `Dockerfile` (in root)</h3>
          <CodeBlock code={code.dockerfile} language="dockerfile" />
        </>
        )}

        <h3 className="font-semibold text-white mt-6">File: `{pipelineFileName}` {isGcp ? '(in root)' : '(in .github/workflows/)'}</h3>
        <CodeBlock code={code.pipelineYaml} language={pipelineLanguage} />

        {isGcp && (
          <>
            <h3 className="font-semibold text-white mt-8">Setup Steps (GCP)</h3>
            <p>1. Commit your `Dockerfile` and `cloudbuild.yaml` to your Git repository.</p>
            <p>2. Connect your Git repository to Cloud Build in the GCP console and create a trigger.</p>
            <p>3. Grant Cloud Build the necessary permissions to deploy to Cloud Run and access Artifact Registry.</p>
            <CodeBlock code={`PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format='value(projectNumber)')
CLOUD_BUILD_SA="\${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"
gcloud projects add-iam-policy-binding $(gcloud config get-value project) --member="serviceAccount:\${CLOUD_BUILD_SA}" --role="roles/run.admin"
gcloud projects add-iam-policy-binding $(gcloud config get-value project) --member="serviceAccount:\${CLOUD_BUILD_SA}" --role="roles/iam.serviceAccountUser"`} />
          </>
        )}
      </>
    );
 }

  return (
    <StepContainer
      title="Step F: Setup Continuous Deployment (CI/CD)"
      description="Automate your deployments. When you push to Git, your cloud provider will automatically build and deploy your application."
      onBack={onBack}
      onNext={onNext}
      isNextDisabled={!isGenerated}
    >
        {renderContent()}
    </StepContainer>
  );
};

export default CiCdStep;
