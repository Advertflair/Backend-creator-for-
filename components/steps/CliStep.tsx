
import React from 'react';
import StepContainer from '../StepContainer';
import CodeBlock from '../CodeBlock';
import { AppConfig } from '../../types';

interface CliStepProps {
  onBack: () => void;
  onNext: () => void;
  config: AppConfig;
}

const gcpInstructions = {
  title: "Configure Google Cloud CLI (gcloud)",
  description: "Next, we need to install and configure the Google Cloud (gcloud) CLI to manage resources from your terminal.",
  installLink: "https://cloud.google.com/sdk/docs/install",
  steps: [
    {
      title: "1. Install gcloud CLI",
      text: "Visit the official documentation to install the CLI for your operating system. After installation, make sure to restart your terminal.",
      code: "gcloud version",
      expected: "Expected output: `Google Cloud SDK 450.0.0` or similar."
    },
    {
      title: "2. Login to your Google account",
      text: "This command will open a browser window for you to sign in.",
      code: "gcloud auth login",
    },
    {
      title: "3. Set your project",
      text: "Replace `YOUR_PROJECT_ID` with the ID of your Google Cloud project.",
      code: "gcloud config set project YOUR_PROJECT_ID",
    },
    {
      title: "4. Enable required APIs",
      text: "This may take a few minutes to complete.",
      code: `gcloud services enable \\
  run.googleapis.com \\
  firestore.googleapis.com \\
  storage.googleapis.com \\
  cloudbuild.googleapis.com \\
  secretmanager.googleapis.com \\
  identitytoolkit.googleapis.com`,
    }
  ],
  importantNote: "Ensure your project is linked to a billing account in the GCP Console. This is required for deploying resources, even within the free tier."
};

const awsInstructions = {
  title: "Configure AWS CLI",
  description: "Next, we need to install and configure the AWS CLI to manage resources from your terminal.",
  installLink: "https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html",
  steps: [
    {
      title: "1. Install AWS CLI",
      text: "Visit the official documentation to install the CLI for your operating system. After installation, make sure to restart your terminal.",
      code: "aws --version",
      expected: "Expected output: `aws-cli/2.x.x` or similar."
    },
    {
      title: "2. Configure your credentials",
      text: "This command will prompt you for your AWS Access Key ID, Secret Access Key, default region, and default output format. You can get these from the IAM console in AWS.",
      code: "aws configure",
    },
    {
      title: "3. Verify your identity",
      text: "This command should return information about your IAM user.",
      code: "aws sts get-caller-identity",
    }
  ],
  importantNote: "Ensure you have an AWS account with a valid payment method. The resources we create will be within the AWS Free Tier where possible, but billing must be enabled."
};


const CliStep: React.FC<CliStepProps> = ({ onBack, onNext, config }) => {
  const instructions = config.cloud === 'aws' ? awsInstructions : gcpInstructions;

  return (
    <StepContainer
      title={`Step C: ${instructions.title}`}
      description={instructions.description}
      onBack={onBack}
      onNext={onNext}
    >
        <h3 className="font-semibold text-white">Installation</h3>
        <p>Visit the official documentation to install the CLI for your operating system: <a href={instructions.installLink} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{instructions.installLink}</a></p>
        
        {instructions.steps.map((step, index) => (
            <div key={index} className="mt-6">
                <h3 className="font-semibold text-white">{step.title}</h3>
                {step.text && <p>{step.text}</p>}
                <CodeBlock code={step.code} language="bash" />
                {step.expected && <p>{step.expected}</p>}
            </div>
        ))}
        
        <div className="mt-8 p-4 bg-yellow-900/30 border border-yellow-500/50 rounded-lg text-yellow-200">
            <p><span className="font-bold">Important:</span> {instructions.importantNote}</p>
        </div>
    </StepContainer>
  );
};

export default CliStep;
