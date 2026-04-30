import { useState, useEffect, useCallback } from 'react';

export const useJourney = (initialStep = 0) => {
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem('loveJourneyStep');
    return saved ? parseInt(saved, 10) : initialStep;
  });

  useEffect(() => {
    localStorage.setItem('loveJourneyStep', currentStep.toString());
  }, [currentStep]);

  const nextStep = useCallback(() => setCurrentStep((prev) => prev + 1), []);
  const prevStep = useCallback(() => setCurrentStep((prev) => Math.max(0, prev - 1)), []);
  const reset = useCallback(() => {
    setCurrentStep(0);
    localStorage.setItem('loveJourneyStep', '0');
  }, []);

  return { currentStep, nextStep, prevStep, reset, setCurrentStep };
};
