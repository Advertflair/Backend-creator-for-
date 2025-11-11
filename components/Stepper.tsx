
import React from 'react';
import { Step, STEP_TITLES } from '../types';

interface StepperProps {
  currentStep: Step;
}

const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  const steps = Object.values(STEP_TITLES);

  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((stepTitle, index) => {
          const stepEnumKey = Object.keys(STEP_TITLES)[index] as unknown as Step;
          const isCompleted = currentStep > stepEnumKey;
          const isCurrent = currentStep === stepEnumKey;

          return (
            <li key={stepTitle} className="md:flex-1">
              {isCompleted ? (
                <div className="group flex flex-col border-l-4 border-cyan-500 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0">
                  <span className="text-sm font-medium text-cyan-400 transition-colors">{`Step ${index + 1}`}</span>
                  <span className="text-sm font-medium text-gray-300">{stepTitle}</span>
                </div>
              ) : isCurrent ? (
                <div className="flex flex-col border-l-4 border-cyan-500 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0" aria-current="step">
                  <span className="text-sm font-medium text-cyan-400">{`Step ${index + 1}`}</span>
                  <span className="text-sm font-medium text-white">{stepTitle}</span>
                </div>
              ) : (
                <div className="group flex flex-col border-l-4 border-gray-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0">
                  <span className="text-sm font-medium text-gray-500 transition-colors">{`Step ${index + 1}`}</span>
                  <span className="text-sm font-medium text-gray-400">{stepTitle}</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Stepper;
