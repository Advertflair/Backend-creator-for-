// FIX: Replaced deprecated `GenerateContentRequest` with `GenerateContentParameters` as per @google/genai guidelines.
import { GoogleGenAI, GenerateContentParameters, GenerateContentResponse } from '@google/genai';
import { GEMINI_MODEL } from '../constants';

/**
 * A centralized function to handle all calls to the Gemini API.
 * @param apiKey - The user's Gemini API key.
 * @param prompt - The prompt to send to the model.
 * @param responseSchema - Optional schema to enforce JSON output.
 * @returns The text response from the model.
 */
export async function callGeminiApi(
  apiKey: string,
  prompt: string,
  responseSchema?: any 
): Promise<string> {
  if (!apiKey) {
    throw new Error('API key is not available. Please provide your key in the settings.');
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // FIX: Replaced deprecated `GenerateContentRequest` with `GenerateContentParameters`.
    const request: GenerateContentParameters = {
        model: GEMINI_MODEL,
        contents: prompt,
    };

    if (responseSchema) {
        request.config = {
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
        };
    }

    const response: GenerateContentResponse = await ai.models.generateContent(request);
    
    const text = response.text;
    
    if (!text) {
      throw new Error('Received an empty response from the AI model.');
    }

    return text.trim();
  } catch (error: any) {
    console.error("Gemini API call failed:", error);
    if (error.message.includes('API key not valid')) {
        throw new Error('The provided Gemini API key is not valid or has been rate-limited. Please check your key and try again.');
    }
    throw new Error(`Failed to communicate with the AI model: ${error.message}`);
  }
}