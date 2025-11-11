import { Type } from '@google/genai';
import { ProjectState, AppConfig, AnalysisOutput } from '../types';
import { callGeminiApi } from '../api/gemini';
import { CircularLogicDetector } from '../utils/CircularLogicDetector';


export interface ArchitectureOutput {
  compute: {
    service: string;
    config: {
      minInstances: number;
      maxInstances: number;
      memory: string;
      cpu: number;
    };
    justification: string;
  };
  database: {
    type: string;
    service: string;
    schema: any;
    estimatedSize: string;
  };
  storage?: {
    service: string;
    buckets: string[];
  };
  authentication?: {
    method: string;
    providers: string[];
  };
  costEstimate: {
    compute: string;
    database: string;
    storage: string;
    total: string;
    confidence: number;
  };
  security: {
    cors: boolean;
    rateLimit: boolean;
    encryption: boolean;
  };
}

export class DesignAgent {
  private static MAX_ATTEMPTS = 3;

  static async execute(
    projectState: ProjectState,
    apiKey: string
  ) {
    console.log('🎨 Design Agent: Starting architecture design...');

    const analysisOutput = projectState.analysisOutput;
    if (!analysisOutput) {
      throw new Error('Analysis output not found. Please complete analysis first.');
    }

    let attempts = 0;
    let errorHistory: string[] = [];

    while (attempts < this.MAX_ATTEMPTS) {
      attempts++;
      console.log(`🎨 Design Agent: Attempt ${attempts}/${this.MAX_ATTEMPTS}`);

      try {
        const databaseDesign = await this.designDatabase(analysisOutput, projectState.config, apiKey);
        const serviceSelection = await this.selectServices(analysisOutput, projectState.config, databaseDesign, apiKey);
        const costEstimate = await this.estimateCosts(serviceSelection, projectState.config, apiKey);
        const securityPlan = this.planSecurity(analysisOutput);

        const output: ArchitectureOutput = { ...serviceSelection, database: databaseDesign, costEstimate, security: securityPlan, };

        const validation = this.validate(output, projectState.config);
        if (!validation.passed) {
          throw new Error(`Design validation failed: ${validation.reason}`);
        }

        const confidence = this.calculateConfidence(output, validation);
        console.log(`✅ Design Agent: Success! Confidence: ${(confidence * 100).toFixed(0)}%`);
        return { output, confidence, attempts };
        
      } catch (error: any) {
        console.error(`❌ Design Agent: Error on attempt ${attempts}:`, error.message);
        errorHistory.push(error.message);
        if (CircularLogicDetector.detect(errorHistory)) {
          throw new Error("Circular logic detected in Design Agent. Aborting.");
        }
      }
    }

    throw new Error(`Design Agent failed after ${this.MAX_ATTEMPTS} attempts. Last error: ${errorHistory.pop()}`);
  }

  private static async designDatabase(analysisOutput: AnalysisOutput, config: AppConfig, apiKey: string): Promise<ArchitectureOutput['database']> {
    console.log('💾 Micro Agent 2.1: Designing database...');
    const prompt = `You are a database architect. Design the optimal database for this backend.
        **Analysis Results:**
        ${JSON.stringify(analysisOutput, null, 2)}
        **Configuration:**
        - Cloud: ${config.cloud.toUpperCase()}
        - Region: ${config.region}
        - Budget: $${config.budget}/month
        **Output format (JSON only):**
        { "type": "postgresql" | "mongodb", "service": "cloud-sql" | "firestore", "schema": { tables: [] or collections: [] }, "estimatedSize": "1 GB", "reasoning": "Why this choice is optimal" }`;
    const responseSchema = { type: Type.OBJECT, properties: { type: { type: Type.STRING }, service: { type: Type.STRING }, schema: { type: Type.OBJECT }, estimatedSize: { type: Type.STRING }, reasoning: { type: Type.STRING } } };
    const resultJson = await callGeminiApi(apiKey, prompt, responseSchema);
    return JSON.parse(resultJson);
  }
  
  private static async selectServices(analysisOutput: AnalysisOutput, config: AppConfig, databaseDesign: any, apiKey: string): Promise<Pick<ArchitectureOutput, 'compute' | 'storage' | 'authentication'>> {
     console.log('☁️ Micro Agent 2.2: Selecting cloud services...');
     const prompt = `You are a cloud architect. Choose the optimal services for this backend.
        **Analysis Results:**
        ${JSON.stringify(analysisOutput, null, 2)}
        **Database Design:**
        ${JSON.stringify(databaseDesign, null, 2)}
        **Configuration:**
        - Cloud: ${config.cloud.toUpperCase()}, Region: ${config.region}, Budget: $${config.budget}/month
        **Output format (JSON only):**
        { "compute": { "service": "cloud-run" | "lambda", "config": { "minInstances": 0, "maxInstances": 10, "memory": "512Mi", "cpu": 1 }, "justification": "Why this configuration" }, "storage": { "service": "cloud-storage" | "s3", "buckets": ["uploads"] } or null, "authentication": { "method": "firebase-auth" | "cognito", "providers": ["email", "google"] } or null }`;
     const responseSchema = { type: Type.OBJECT, properties: { compute: { type: Type.OBJECT }, storage: { type: Type.OBJECT }, authentication: { type: Type.OBJECT } } };
     const resultJson = await callGeminiApi(apiKey, prompt, responseSchema);
     return JSON.parse(resultJson);
  }
  
  private static async estimateCosts(services: any, config: AppConfig, apiKey: string): Promise<ArchitectureOutput['costEstimate']> {
    console.log('💰 Micro Agent 2.3: Estimating costs...');
    const prompt = `You are a cloud cost analyst. Estimate monthly costs for these services.
        **Services:**
        ${JSON.stringify(services, null, 2)}
        **Configuration:**
        - Cloud: ${config.cloud.toUpperCase()}, Budget: $${config.budget}/month, Expected traffic: Low
        **Output format (JSON only):**
        { "compute": "$5/month", "database": "$7/month", "storage": "$1/month", "total": "$13/month", "confidence": 0.85 }`;
    const responseSchema = { type: Type.OBJECT, properties: { compute: { type: Type.STRING }, database: { type: Type.STRING }, storage: { type: Type.STRING }, total: { type: Type.STRING }, confidence: { type: Type.NUMBER } } };
    const resultJson = await callGeminiApi(apiKey, prompt, responseSchema);
    return JSON.parse(resultJson);
  }

  private static planSecurity(analysisOutput: AnalysisOutput): ArchitectureOutput['security'] {
    console.log('🔒 Micro Agent 2.4: Planning security...');
    return { cors: true, rateLimit: true, encryption: true };
  }

  private static validate(output: ArchitectureOutput, config: AppConfig): { passed: boolean; reason: string } {
    const totalCost = parseFloat(output.costEstimate.total.replace(/[^0-9.]/g, ''));
    if (totalCost > config.budget * 1.2) {
      return { passed: false, reason: `Estimated cost $${totalCost} exceeds budget $${config.budget * 1.2}` };
    }
    return { passed: true, reason: '' };
  }

  private static calculateConfidence(output: ArchitectureOutput, validation: { passed: boolean }): number {
    let confidence = 0.8;
    if (validation.passed) confidence += 0.1;
    if (output.costEstimate.confidence > 0.8) confidence += 0.05;
    return Math.min(confidence, 1.0);
  }
}
