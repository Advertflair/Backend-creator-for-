
import { ArchitectureOutput } from './orchestration/DesignAgent';
import { GeneratedFiles } from './orchestration/GenerationAgent';
import { DeploymentOutput } from './orchestration/DeploymentAgent';

export enum Step {
  Welcome,
  Input,
  Analysis,
  Cli,
  Terraform,
  BackendCode,
  CiCd,
  Testing,
  Integration,
  Operations,
  Done,
}

export const STEP_TITLES: Record<Step, string> = {
  [Step.Welcome]: "Welcome",
  [Step.Input]: "Project Configuration",
  [Step.Analysis]: "Frontend Analysis",
  [Step.Cli]: "CLI Setup",
  [Step.Terraform]: "Deploy Infrastructure",
  [Step.BackendCode]: "Generate Backend Code",
  [Step.CiCd]: "Setup CI/CD",
  [Step.Testing]: "Testing & Promotion",
  [Step.Integration]: "Frontend Integration",
  [Step.Operations]: "Operations & Monitoring",
  [Step.Done]: "Deployment Complete",
};

export interface AppConfig {
  cloud: 'gcp' | 'aws';
  region: string;
  budget: number;
}

export interface TerraformCode {
  main: string;
  variables: string;
  outputs: string;
  tfvars: string;
}

export interface BackendCode {
  packageJson: string;
  serverTs: string;
  routesTs: string;
}

export interface CiCdCode {
  dockerfile?: string;
  pipelineYaml: string;
}

export interface TestingCode {
  smokeTestSh: string;
}

export interface IntegrationCode {
  apiClientTs: string;
  reactComponentExample: string;
}

export interface OperationsCode {
  loggingCommand: string;
  errorLogCommand: string;
}

export interface AllGeneratedCode {
  terraform: TerraformCode | null;
  backend: BackendCode | null;
  ciCd: CiCdCode | null;
  testing: TestingCode | null;
  integration: IntegrationCode | null;
  operations: OperationsCode | null;
}

export type StepStatus = 'pending' | 'in-progress' | 'completed' | 'error';
export type OrchestrationRunStatus = 'idle' | 'running' | 'paused' | 'failed' | 'completed';

export interface AIInteraction {
  timestamp: string;
  step: Step;
  prompt: string;
  response: string;
  error?: string;
}

export interface StepProgress {
  status: StepStatus;
  startedAt?: string;
  completedAt?: string;
  output?: string;
  error?: string;
  confidence?: number;
  attempts?: number;
}

export interface AnalysisOutput {
  apiEndpoints: { method: string; path: string; description: string }[];
  dataModel: { name: string; fields: { name: string; type: string; description: string }[] }[];
  architecture: { service: string; justification: string }[];
  costEstimate: string;
  rawAnalysis: string;
}

export interface OrchestrationState {
  status: OrchestrationRunStatus;
  currentPhase?: 'analysis' | 'design' | 'generation' | 'deployment';
  startedAt?: string;
  completedAt?: string;
  
  analysisConfidence?: number;
  analysisAttempts?: number;
  
  designOutput?: ArchitectureOutput | null;
  designConfidence?: number;
  designAttempts?: number;
  
  generationOutput?: GeneratedFiles | null;
  generationConfidence?: number;
  generationAttempts?: number;
  
  deploymentOutput?: DeploymentOutput | null;
  deploymentConfidence?: number;
  deploymentAttempts?: number;

  error?: string;
  overallConfidence?: number;
}


export interface ProjectState {
  id: string;
  createdAt: string;
  updatedAt: string;
  currentStep: Step;
  orchestrationState: OrchestrationState;
  config: AppConfig;
  analysisOutput: AnalysisOutput | null;
  analysisResult: string; 
  allCode: AllGeneratedCode;
  progress: Partial<Record<Step, StepProgress>>;
  aiInteractions: AIInteraction[];
}
