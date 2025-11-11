
import { Step, ProjectState, STEP_TITLES, OrchestrationState } from '../types';

const LOCAL_STORAGE_KEY = 'cloudBackendBuilderProjectState';

const initialOrchestrationState: OrchestrationState = {
    status: 'idle',
    currentPhase: undefined,
    analysisAttempts: 0,
    analysisConfidence: 0,
    designAttempts: 0,
    designConfidence: 0,
    generationAttempts: 0,
    generationConfidence: 0,
    deploymentAttempts: 0,
    deploymentConfidence: 0,
};

export const progressManager = {
  initNewProject: (): ProjectState => {
    const now = new Date().toISOString();
    return {
      id: `proj_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      currentStep: Step.Welcome,
      orchestrationState: initialOrchestrationState,
      config: {
        cloud: 'gcp',
        region: 'us-central1',
        budget: 15,
      },
      analysisOutput: null,
      analysisResult: '',
      allCode: {
        terraform: null,
        backend: null,
        ciCd: null,
        testing: null,
        integration: null,
        operations: null,
      },
      progress: {},
      aiInteractions: [],
    };
  },

  loadProject: (): ProjectState | null => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!savedState) return null;
      const parsed = JSON.parse(savedState);
      // Add orchestrationState if missing from older saved states
      if (!parsed.orchestrationState) {
        parsed.orchestrationState = initialOrchestrationState;
        if(parsed.orchestrationStatus) { // migrate old status
            parsed.orchestrationState.status = parsed.orchestrationStatus;
            delete parsed.orchestrationStatus;
        }
      }
      return parsed;
    } catch (error) {
      console.error("Failed to load project state from localStorage", error);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return null;
    }
  },

  saveProject: (state: ProjectState) => {
    try {
      const stateToSave = { ...state, updatedAt: new Date().toISOString() };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Failed to save project state to localStorage", error);
    }
  },

  clearProject: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  },
  
  getContextForAI: (state: ProjectState, userQuery: string): string => {
    const completedSteps = Object.entries(state.progress)
      .filter(([, p]) => p.status === 'completed')
      .map(([stepKey]) => STEP_TITLES[stepKey as any as Step]);

    const context = `
You are an expert AI assistant for the Cloud Backend Builder application.
Your goal is to provide helpful, concise, and context-aware advice.
DO NOT repeat information the user can already see or that you have said before.

**Current Project Summary:**
- Cloud Provider: ${state.config.cloud.toUpperCase()}
- Region: ${state.config.region}
- Current Step: "${STEP_TITLES[state.currentStep]}"
- Completed Steps: ${completedSteps.join(', ') || 'None'}

**Backend Analysis Plan (Summary):**
${state.analysisResult ? state.analysisResult.substring(0, 500) + '...' : 'Not generated yet.'}

**Recent Conversation History (this step):**
${state.aiInteractions.filter(i => i.step === state.currentStep).slice(-2).map(i => `\n- User: "${i.prompt}"\n- You: "${i.response}"`).join('')}

---
Based on this context, the user is on the "${STEP_TITLES[state.currentStep]}" step and has asked the following question. Provide a direct and helpful answer.

**User's Question:** "${userQuery}"
`;
    return context.trim();
  }
};
