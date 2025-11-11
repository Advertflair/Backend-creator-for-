import { Type } from '@google/genai';
import { AppConfig, AnalysisOutput } from '../types';
import { callGeminiApi } from '../api/gemini';

export async function runAnalysisAgent(
  frontendCode: string,
  config: AppConfig,
  apiKey: string
): Promise<AnalysisOutput> {
  if (!apiKey) {
    throw new Error('Gemini API key is not set.');
  }
  if (!frontendCode.trim()) {
    throw new Error('Frontend code or description is empty.');
  }

  const prompt = `You are a senior cloud architect. Analyze the provided frontend code/description and generate a structured backend plan in JSON format.

**User Configuration:**
- Cloud Provider: ${config.cloud.toUpperCase()}
- Target Region: ${config.region}
- Monthly Budget: $${config.budget}

**Frontend Code/Description:**
\`\`\`
${frontendCode}
\`\`\`

**Instructions:**
Generate a concise, well-structured backend plan. The plan must include the following sections:
1.  **apiEndpoints:** List the RESTful API endpoints inferred from the user's input.
2.  **dataModel:** Describe the necessary database collections/tables and their fields.
3.  **architecture:** Recommend a specific, serverless technology stack for ${config.cloud.toUpperCase()}.
4.  **costEstimate:** Provide a rough monthly cost estimate for a starter, low-traffic application.
5.  **rawAnalysis:** A markdown-formatted string containing the same information for display purposes.`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      apiEndpoints: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            method: { type: Type.STRING },
            path: { type: Type.STRING },
            description: { type: Type.STRING },
          },
        },
      },
      dataModel: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            fields: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  type: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
      architecture: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            service: { type: Type.STRING },
            justification: { type: Type.STRING },
          },
        },
      },
      costEstimate: { type: Type.STRING },
      rawAnalysis: { type: Type.STRING },
    },
    required: ["apiEndpoints", "dataModel", "architecture", "costEstimate", "rawAnalysis"],
  };

  try {
    const resultJson = await callGeminiApi(apiKey, prompt, responseSchema);
    return JSON.parse(resultJson) as AnalysisOutput;
  } catch (error: any) {
    console.error("Error in Analysis Agent:", error);
    throw new Error(`Failed to get analysis from AI: ${error.message}`);
  }
}
