
import { GoogleGenAI, Type } from '@google/genai';
import { ProjectState, AppConfig, AnalysisOutput } from '../types';
import { GEMINI_MODEL } from '../constants';
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
    const ai = new GoogleGenAI({ apiKey });

    while (attempts < this.MAX_ATTEMPTS) {
      attempts++;
      console.log(`🎨 Design Agent: Attempt ${attempts}/${this.MAX_ATTEMPTS}`);

      try {
        const databaseDesign = await this.designDatabase(analysisOutput, projectState.config, ai);
        const serviceSelection = await this.selectServices(analysisOutput, projectState.config, databaseDesign, ai);
        const costEstimate = await this.estimateCosts(serviceSelection, projectState.config, ai);
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

  private static async designDatabase(analysisOutput: AnalysisOutput, config: AppConfig, ai: GoogleGenAI) {
    console.log('💾 Micro Agent 2.1: Designing database...');
    const prompt = `...`; // Prompt omitted for brevity
    const response = await ai.models.generateContent({ model: GEMINI_MODEL, contents: `...`, config: { responseMimeType: 'application/json' } });
    return JSON.parse(response.text.trim());
  }
  
  private static async selectServices(analysisOutput: AnalysisOutput, config: AppConfig, databaseDesign: any, ai: GoogleGenAI) {
     console.log('☁️ Micro Agent 2.2: Selecting cloud services...');
     // Implementation similar to designDatabase
     return { compute: { service: 'cloud-run', config: { minInstances:0, maxInstances:1, memory:'512Mi', cpu:1 }, justification: 'Scales to zero' } };
  }
  
  private static async estimateCosts(services: any, config: AppConfig, ai: GoogleGenAI) {
    console.log('💰 Micro Agent 2.3: Estimating costs...');
    return { compute: '$5', database: '$7', storage: '$1', total: '$13/month', confidence: 0.85 };
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
