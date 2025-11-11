import React from 'react';
import JSZip from 'jszip';
import { ProjectState } from '../../types';

interface DoneStepProps {
  onRestart: () => void;
  projectState: ProjectState;
}

const DoneStep: React.FC<DoneStepProps> = ({ onRestart, projectState }) => {
  const { allCode } = projectState;

  const handleDownloadCode = () => {
    const zip = new JSZip();

    // Terraform
    if (allCode.terraform) {
      const tfFolder = zip.folder('terraform');
      tfFolder?.file('main.tf', allCode.terraform.main);
      tfFolder?.file('variables.tf', allCode.terraform.variables);
      tfFolder?.file('outputs.tf', allCode.terraform.outputs);
      tfFolder?.file('terraform.tfvars', allCode.terraform.tfvars);
    }
    
    // Backend
    if (allCode.backend) {
        const backendFolder = zip.folder('backend');
        backendFolder?.file('package.json', allCode.backend.packageJson);
        const srcFolder = backendFolder?.folder('src');
        srcFolder?.file('server.ts', allCode.backend.serverTs);
        const apiFolder = srcFolder?.folder('api');
        apiFolder?.file('routes.ts', allCode.backend.routesTs);
    }
    
    // CI/CD
    if (allCode.ciCd) {
        if(allCode.ciCd.dockerfile) {
            zip.file('Dockerfile', allCode.ciCd.dockerfile);
        }
        if(allCode.ciCd.pipelineYaml.includes('actions/checkout')) { // AWS
            const ghFolder = zip.folder('.github')?.folder('workflows');
            ghFolder?.file('deploy.yml', allCode.ciCd.pipelineYaml);
        } else { // GCP
            zip.file('cloudbuild.yaml', allCode.ciCd.pipelineYaml);
        }
    }
    
    // Testing
    if (allCode.testing) {
        zip.file('smoke-test.sh', allCode.testing.smokeTestSh);
    }
    
    // Integration
    if (allCode.integration) {
        const feFolder = zip.folder('frontend-example');
        feFolder?.file('apiClient.ts', allCode.integration.apiClientTs);
        feFolder?.file('Component.tsx', allCode.integration.reactComponentExample);
    }

    zip.generateAsync({ type: 'blob' }).then(content => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'cloud-backend-project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };
  
  const handleExportData = () => {
    const dataStr = JSON.stringify(projectState, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'project-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="text-center bg-gray-800/50 rounded-lg p-8 md:p-12 border border-gray-700 shadow-lg">
      <div className="mb-4">
        <svg className="mx-auto h-16 w-16 text-green-400" fill="none" viewBox="http://www.w3.org/2000/svg" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">🎉 Deployment Complete!</h2>
      <p className="text-gray-300 max-w-2xl mx-auto mb-8">
        Congratulations! You have successfully generated all the necessary code and configuration for your backend.
      </p>
      
      <div className="text-left max-w-lg mx-auto bg-gray-900/50 p-6 rounded-lg border border-gray-700">
        <h3 className="font-semibold text-white text-lg mb-4">What you've generated:</h3>
        <ul className="space-y-3">
          <li className="flex items-start">
            <svg className="h-6 w-6 flex-none text-cyan-400 mr-3" fill="none" viewBox="http://www.w3.org/2000/svg" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span className="text-gray-300">Customized backend architecture plan.</span>
          </li>
          <li className="flex items-start">
            <svg className="h-6 w-6 flex-none text-cyan-400 mr-3" fill="none" viewBox="http://www.w3.org/2000/svg" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span className="text-gray-300">Production-ready Terraform (IaC).</span>
          </li>
          <li className="flex items-start">
             <svg className="h-6 w-6 flex-none text-cyan-400 mr-3" fill="none" viewBox="http://www.w3.org/2000/svg" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span className="text-gray-300">TypeScript Express.js backend code.</span>
          </li>
          <li className="flex items-start">
            <svg className="h-6 w-6 flex-none text-cyan-400 mr-3" fill="none" viewBox="http://www.w3.org/2000/svg" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span className="text-gray-300">Automated CI/CD pipeline configuration.</span>
          </li>
        </ul>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={handleDownloadCode}
          className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500"
        >
          Download All Code
        </button>
        <button
          onClick={onRestart}
          className="w-full sm:w-auto px-8 py-3 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500"
        >
          Start a New Project
        </button>
      </div>
       <div className="mt-4">
         <button onClick={handleExportData} className="text-sm text-gray-500 hover:text-cyan-400 underline">
            Export Project Data
         </button>
       </div>
    </div>
  );
};

export default DoneStep;
