
import React from 'react';

interface StepContainerProps {
  title: string;
  description: string;
  onNext?: () => void;
  onBack?: () => void;
  children: React.ReactNode;
  nextText?: string;
  isNextDisabled?: boolean;
}

const StepContainer: React.FC<StepContainerProps> = ({ title, description, onNext, onBack, children, nextText = "Continue", isNextDisabled = false }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg p-6 md:p-8 border border-gray-700 shadow-lg">
      <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-400 mb-8">{description}</p>
      
      <div className="prose prose-invert prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700 max-w-none">
        {children}
      </div>

      {(onBack || onNext) && (
        <div className="mt-10 flex justify-between items-center border-t border-gray-700 pt-6">
          {onBack ? (
            <button
              onClick={onBack}
              className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500"
            >
              Back
            </button>
          ) : <div />}
          {onNext && (
             <button
              onClick={onNext}
              disabled={isNextDisabled}
              className="px-8 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500"
            >
              {nextText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default StepContainer;
