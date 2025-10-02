import { useState } from 'react';

interface UseMultiStepReturn {
  currentStep: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

export function useMultiStep(totalSteps: number, initialStep: number = 1): UseMultiStepReturn {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const reset = () => {
    setCurrentStep(1);
  };

  return {
    currentStep,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
    goToStep,
    nextStep,
    prevStep,
    reset,
  };
}

