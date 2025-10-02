interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps?: string[];
}

export default function ProgressBar({ currentStep, totalSteps, steps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full">
      {/* Step Numbers and Labels */}
      {steps && (
        <div className="flex justify-between mb-4">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                    ${isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-200 scale-110' : ''}
                    ${isCompleted ? 'bg-green-500 text-white' : ''}
                    ${!isCurrent && !isCompleted ? 'bg-gray-200 text-gray-600' : ''}
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={`
                    mt-2 text-xs font-medium text-center transition-colors
                    ${isCurrent ? 'text-blue-600' : ''}
                    ${isCompleted ? 'text-green-600' : ''}
                    ${!isCurrent && !isCompleted ? 'text-gray-500' : ''}
                  `}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Progress Bar */}
      <div className="relative">
        <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200">
          <div
            style={{ width: `${progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
          />
        </div>
        <div className="text-left text-xs text-gray-600 mt-2">
          <span className="font-semibold text-blue-600">{currentStep}</span>
          <span> מתוך </span>
          <span className="font-semibold">{totalSteps}</span>
        </div>
      </div>
    </div>
  );
}

