import { Type } from '@google/genai';
import { ProjectState, TerraformCode, BackendCode, CiCdCode, TestingCode, IntegrationCode, OperationsCode } from '../types';
import { callGeminiApi } from '../api/gemini';

export interface GeneratedFiles {
  terraform: TerraformCode;
  backend: BackendCode;
  ciCd: CiCdCode;
  testing: TestingCode;
  integration: IntegrationCode;
  operations: OperationsCode;
}

export class GenerationAgent {
    private static MAX_ATTEMPTS = 3;

    static async execute(projectState: ProjectState, apiKey: string) {
        console.log('⚙️ Generation Agent: Starting code generation...');
        const designOutput = projectState.orchestrationState.designOutput;
        if (!designOutput) {
            throw new Error('Design output missing. Complete previous steps first.');
        }
        
        const prompt = `Based on the provided architecture plan, generate all necessary code files as a single JSON object.

        **Architecture Plan:**
        ---
        ${JSON.stringify(designOutput, null, 2)}
        ---

        **Instructions:**
        Return a single JSON object with six top-level keys: "terraform", "backend", "ciCd", "testing", "integration", and "operations".
        - "terraform" should contain: "main", "variables", "outputs", "tfvars".
        - "backend" should contain: "packageJson", "serverTs", "routesTs".
        - "ciCd" should contain: "dockerfile" (if applicable) and "pipelineYaml".
        - "testing" should contain: "smokeTestSh".
        - "integration" should contain: "apiClientTs", "reactComponentExample".
        - "operations" should contain: "loggingCommand", "errorLogCommand".
        All values must be complete, production-ready code strings.
        `;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                terraform: { 
                    type: Type.OBJECT, 
                    properties: { main: {type: Type.STRING}, variables: {type: Type.STRING}, outputs: {type: Type.STRING}, tfvars: {type: Type.STRING} },
                    required: ["main", "variables", "outputs", "tfvars"]
                },
                backend: { 
                    type: Type.OBJECT, 
                    properties: { packageJson: {type: Type.STRING}, serverTs: {type: Type.STRING}, routesTs: {type: Type.STRING} },
                    required: ["packageJson", "serverTs", "routesTs"]
                },
                ciCd: { 
                    type: Type.OBJECT, 
                    properties: { dockerfile: {type: Type.STRING}, pipelineYaml: {type: Type.STRING} },
                    required: ["pipelineYaml"]
                },
                testing: {
                    type: Type.OBJECT,
                    properties: { smokeTestSh: { type: Type.STRING } },
                    required: ["smokeTestSh"]
                },
                integration: {
                    type: Type.OBJECT,
                    properties: { apiClientTs: { type: Type.STRING }, reactComponentExample: { type: Type.STRING } },
                    required: ["apiClientTs", "reactComponentExample"]
                },
                operations: {
                    type: Type.OBJECT,
                    properties: { loggingCommand: { type: Type.STRING }, errorLogCommand: { type: Type.STRING } },
                    required: ["loggingCommand", "errorLogCommand"]
                }
            },
            required: ["terraform", "backend", "ciCd", "testing", "integration", "operations"]
        };

        try {
            const resultJson = await callGeminiApi(apiKey, prompt, responseSchema);
            const output = JSON.parse(resultJson) as GeneratedFiles;
            
            if (!output.terraform.main || !output.backend.serverTs || !output.testing.smokeTestSh) {
                throw new Error("Generated code is incomplete.");
            }

            const confidence = 0.9; // Simplified confidence
            console.log(`✅ Generation Agent: Success! Confidence: ${(confidence * 100).toFixed(0)}%`);
            return { output, confidence, attempts: 1 };
        } catch(e: any) {
            console.error("Generation Agent failed:", e.message);
            throw new Error(`Generation Agent failed: ${e.message}`);
        }
    }
}
