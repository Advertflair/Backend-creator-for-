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
    const errorMessage = error.toString();

    if (errorMessage.includes('API key not valid') || errorMessage.includes('API key expired') || errorMessage.includes('API_KEY_INVALID')) {
        throw new Error('Your Gemini API key is invalid or has expired. Please go to Google AI Studio to generate a new key, then refresh this page and enter it.');
    }
    
    throw new Error(`Failed to communicate with the AI model. Please check your network connection and API key. Details: ${errorMessage}`);
  }
}