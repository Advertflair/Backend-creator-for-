
import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Step, ProjectState, OrchestrationRunStatus, AllGeneratedCode } from './types';
import { ApiKeyContext } from './context/ApiKeyContext';
import { progressManager } from './utils/progressManager';
import { runAnalysisAgent } from './orchestration/AnalysisAgent';
import { DesignAgent } from './orchestration/DesignAgent';
import { GenerationAgent } from './orchestration/GenerationAgent';
import { DeploymentAgent } from './orchestration/DeploymentAgent';

import Stepper from './components/Stepper';
import ErrorBoundary from './components/ErrorBoundary';
import WelcomeStep from './components/steps/WelcomeStep';
import InputStep from './components/steps/InputStep';
import AnalysisStep from './components/steps/AnalysisStep';
import CliStep from './components/steps/CliStep';
import TerraformStep from './components/steps/TerraformStep';
import BackendCodeStep from './components/steps/BackendCodeStep';
import CiCdStep from './components/steps/CiCdStep';
import TestingStep from './components/steps/TestingStep';
import IntegrationStep from './components/steps/IntegrationStep';
import OperationsStep from './components/steps/OperationsStep';
import DoneStep from './components/steps/DoneStep';
import ApiKeyModal from './components/ApiKeyModal';
import ProgressDashboard from './components/ProgressDashboard';
import ContextualHelp from './components/ContextualHelp';
import OrchestratorControls from './components/OrchestratorControls';
import OrchestrationStatus from './components/OrchestrationStatus';


const App: React.FC = () => {
  const { apiKey, isKeyValid } = useContext(ApiKeyContext);
  const [projectState, setProjectState] = useState<ProjectState | null>(null);
  const [frontendCodeForAnalysis, setFrontendCodeForAnalysis] = useState('');


  useEffect(() => {
    const loadedState = progressManager.loadProject();
    if (loadedState) {
      setProjectState(loadedState);
    } else {
      setProjectState(progressManager.initNewProject());
    }
  }, []);

  useEffect(() => {
    if (projectState) {
      progressManager.saveProject(projectState);
    }
  }, [projectState]);

  const updateProjectState = useCallback((updater: (prevState: ProjectState) => ProjectState) => {
    setProjectState(prevState => {
      if (!prevState) return null;
      return updater(prevState);
    });
  }, []);
  
  const handleNext = useCallback((state: ProjectState) => {
      const nextStep = state.currentStep < Step.Done ? state.currentStep + 1 : Step.Done;
      setProjectState(prev => prev ? {...prev, currentStep: nextStep} : null);
  }, []);

  const handleBack = useCallback(() => {
    updateProjectState(prev => ({
      ...prev,
      currentStep: prev.currentStep > Step.Welcome ? prev.currentStep - 1 : Step.Welcome
    }));
  }, [updateProjectState]);

  const handleRestart = useCallback(() => {
    progressManager.clearProject();
    setProjectState(progressManager.initNewProject());
  }, []);
  
  const handleResume = useCallback((step: Step) => {
     updateProjectState(prev => ({ ...prev, currentStep: step }));
  }, [updateProjectState]);

  const setOrchestrationRunStatus = (status: OrchestrationRunStatus) => {
    updateProjectState(prev => ({ ...prev, orchestrationState: { ...prev.orchestrationState, status } }));
  }

  const runOrchestration = async () => {
    if (!projectState) return;

    // --- Start Orchestration ---
    updateProjectState(prev => ({
      ...prev,
      orchestrationState: {
        ...progressManager.initNewProject().orchestrationState,
        status: 'running',
        currentPhase: 'analysis',
        startedAt: new Date().toISOString(),
      },
      // Keep config, but reset outputs
      analysisOutput: null,
      analysisResult: '',
      allCode: progressManager.initNewProject().allCode,
      progress: {}
    }));

    try {
      // --- ANALYSIS AGENT ---
      let currentProjectState = await new Promise<ProjectState>(resolve => setProjectState(s => {resolve(s!); return s!}));
      updateProjectState(p => ({...p, progress: { ...p.progress, [Step.Analysis]: { status: 'in-progress' } } }));
      const analysisOutput = await runAnalysisAgent(frontendCodeForAnalysis, currentProjectState.config, apiKey);
      updateProjectState(prev => ({
        ...prev,
        analysisOutput: analysisOutput,
        analysisResult: analysisOutput.rawAnalysis,
        orchestrationState: { ...prev.orchestrationState, analysisConfidence: 0.9, analysisAttempts: 1 },
        progress: { ...prev.progress, [Step.Analysis]: { status: 'completed' } }
      }));
      console.log(`✅ Analysis complete!`);

      // --- DESIGN AGENT ---
      currentProjectState = await new Promise<ProjectState>(resolve => setProjectState(s => {resolve(s!); return s!}));
      updateProjectState(p => ({...p, orchestrationState: { ...p.orchestrationState, currentPhase: 'design' } }));
      const designResult = await DesignAgent.execute(currentProjectState, apiKey);
      updateProjectState(prev => ({
        ...prev,
        orchestrationState: { ...prev.orchestrationState, designOutput: designResult.output, designConfidence: designResult.confidence, designAttempts: designResult.attempts }
      }));
       console.log(`✅ Design complete!`);

      // --- GENERATION AGENT ---
      currentProjectState = await new Promise<ProjectState>(resolve => setProjectState(s => {resolve(s!); return s!}));
      updateProjectState(p => ({...p, orchestrationState: { ...p.orchestrationState, currentPhase: 'generation' }, progress: { ...p.progress, [Step.Terraform]: {status: 'in-progress'}, [Step.BackendCode]: {status: 'in-progress'}, [Step.CiCd]: {status: 'in-progress'} } }));
      const generationResult = await GenerationAgent.execute(currentProjectState, apiKey);
      updateProjectState(prev => ({
        ...prev,
        allCode: generationResult.output,
        orchestrationState: { ...prev.orchestrationState, generationOutput: generationResult.output, generationConfidence: generationResult.confidence, generationAttempts: generationResult.attempts },
        progress: { ...prev.progress, [Step.Terraform]: {status: 'completed'}, [Step.BackendCode]: {status: 'completed'}, [Step.CiCd]: {status: 'completed'} }
      }));
      console.log(`✅ Generation complete!`);

      // --- DEPLOYMENT AGENT ---
      currentProjectState = await new Promise<ProjectState>(resolve => setProjectState(s => {resolve(s!); return s!}));
      updateProjectState(p => ({...p, orchestrationState: { ...p.orchestrationState, currentPhase: 'deployment' }, progress: { ...p.progress, [Step.Testing]: { status: 'in-progress'} } }));
      const deploymentResult = await DeploymentAgent.execute(currentProjectState);
       updateProjectState(prev => ({
        ...prev,
        orchestrationState: { ...prev.orchestrationState, deploymentOutput: deploymentResult.output, deploymentConfidence: deploymentResult.confidence, deploymentAttempts: deploymentResult.attempts, status: 'completed', completedAt: new Date().toISOString() },
        progress: { ...prev.progress, [Step.Testing]: { status: 'completed'} }
      }));
      console.log(`✅ Deployment complete!`);

    } catch(e: any) {
      console.error('❌ MASTER ORCHESTRATOR: Fatal error:', e.message);
      updateProjectState(prev => ({
        ...prev,
        orchestrationState: { ...prev.orchestrationState, status: 'failed', error: e.message, completedAt: new Date().toISOString() }
      }));
      return;
    }
  };

  useEffect(() => {
    if (projectState?.orchestrationState.status === 'running' && projectState.orchestrationState.currentPhase === undefined) {
      runOrchestration();
    }
  }, [projectState?.orchestrationState.status]);

  const renderStep = () => {
    if (!projectState) return null;
    
    const { currentStep, config } = projectState;

    switch (currentStep) {
      case Step.Welcome:
        return <WelcomeStep onNext={() => handleNext(projectState)} onRestart={handleRestart} onResume={handleResume} projectState={projectState} />;
      case Step.Input:
        return <InputStep config={config} setConfig={(newConfig) => updateProjectState(prev => ({...prev, config: newConfig}))} onBack={handleBack} onNext={() => handleNext(projectState)} />;
      case Step.Analysis:
        return <AnalysisStep projectState={projectState} onBack={handleBack} onNext={() => handleNext(projectState)} updateProjectState={updateProjectState} setFrontendCode={setFrontendCodeForAnalysis} />;
      case Step.Cli:
        return <CliStep config={config} onBack={handleBack} onNext={() => handleNext(projectState)} />;
      case Step.Terraform:
        return <TerraformStep projectState={projectState} onBack={handleBack} onNext={() => handleNext(projectState)} />;
      case Step.BackendCode:
        return <BackendCodeStep projectState={projectState} onBack={handleBack} onNext={() => handleNext(projectState)} />;
      case Step.CiCd:
        return <CiCdStep projectState={projectState} onBack={handleBack} onNext={() => handleNext(projectState)} />;
      case Step.Testing:
        return <TestingStep projectState={projectState} onBack={handleBack} onNext={() => handleNext(projectState)} />;
      case Step.Integration:
        return <IntegrationStep projectState={projectState} onBack={handleBack} onNext={() => handleNext(projectState)} />;
      case Step.Operations:
        return <OperationsStep projectState={projectState} onBack={handleBack} onNext={() => handleNext(projectState)} />;
      case Step.Done:
        return <DoneStep onRestart={handleRestart} projectState={projectState} />;
      default:
        return <WelcomeStep onNext={() => handleNext(projectState)} onRestart={handleRestart} onResume={handleResume} projectState={projectState} />;
    }
  };

  if (!projectState) {
     return <div className="bg-gray-900 min-h-screen"></div>;
  }

  return (
    <>
      {!isKeyValid && <ApiKeyModal />}
      <div className={`bg-gray-900 text-gray-200 min-h-screen font-sans antialiased ${!isKeyValid ? 'blur-sm pointer-events-none' : ''}`}>
        <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">
              <span className="text-cyan-400">Cloud</span> Backend Builder 🚀
            </h1>
          </div>
        </header>

        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          <ErrorBoundary>
            <ProgressDashboard projectState={projectState} />
            <OrchestratorControls 
              status={projectState.orchestrationState.status}
              setStatus={setOrchestrationRunStatus}
              onRestart={handleRestart}
              currentStep={projectState.currentStep}
            />
            <OrchestrationStatus orchestrationState={projectState.orchestrationState} />
            <div className="mt-6">
              <Stepper currentStep={projectState.currentStep} />
            </div>
            <div className="mt-8">
              {renderStep()}
            </div>
          </ErrorBoundary>
        </main>
        
        <ContextualHelp projectState={projectState} updateProjectState={updateProjectState} />
        
        <footer className="container mx-auto px-8 py-4 text-center text-gray-500 text-sm">
          <p>Generated by a world-class senior frontend engineer using the Gemini API.</p>
        </footer>
      </div>
    </>
  );
};

export default App;
