import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { GoogleGenAI } from '@google/genai';

type ApiKeyStatus = 'idle' | 'testing' | 'valid' | 'invalid';

interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  isKeyValid: boolean;
  status: ApiKeyStatus;
  validateKey: (key: string) => Promise<boolean>;
}

export const ApiKeyContext = createContext<ApiKeyContextType>({} as ApiKeyContextType);

const API_KEY_STORAGE_KEY = 'geminiApiKey';

export const ApiKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [status, setStatus] = useState<ApiKeyStatus>('idle');

  const validateKey = useCallback(async (key: string): Promise<boolean> => {
    if (!key) {
      setStatus('invalid');
      return false;
    }
    setStatus('testing');
    try {
      const ai = new GoogleGenAI({ apiKey: key });
      // A simple, low-cost call to validate the key
      await ai.models.generateContent({
        model: 'gemini-2.5-flash', // Use a fast model for validation
        contents: 'test',
      });
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
      setApiKey(key);
      setStatus('valid');
      return true;
    } catch (error) {
      console.error("API Key validation failed:", error);
      setStatus('invalid');
      return false;
    }
  }, []);

  useEffect(() => {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
      setApiKey(storedKey);
      setStatus('valid'); // Assume stored key is valid to avoid re-validating on every load
    } else {
      setStatus('idle');
    }
  }, []);

  const handleSetApiKey = (key: string) => {
    // This function is for uncontrolled input changes, validation is separate
    setApiKey(key);
    if (status !== 'testing') {
        setStatus('idle');
    }
  };

  return (
    <ApiKeyContext.Provider value={{
      apiKey,
      setApiKey: handleSetApiKey,
      isKeyValid: status === 'valid',
      status,
      validateKey,
    }}>
      {children}
    </ApiKeyContext.Provider>
  );
};