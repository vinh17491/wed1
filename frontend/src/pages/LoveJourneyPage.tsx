import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Hooks
import { useJourney } from '../hooks/useJourney';
import { useIdleLove } from '../hooks/useIdleLove';
import { useRevisit } from '../hooks/useRevisit';
import { useNotification } from '../hooks/useNotification';

// Components
import { ProgressBar } from '../components/love/ProgressBar';
import { FloatingHearts } from '../components/love/FloatingHearts';
import { TransitionLayer } from '../components/love/TransitionLayer';

// Steps (Domain Modules)
import { Loader } from '../components/love/Loader';
import { Hero } from '../components/love/Hero';
import { LoveGame } from '../components/love/LoveGame';
import { MemoryCards } from '../components/love/MemoryCards';
import { HeartGame } from '../components/love/HeartGame';
import { MusicMoment } from '../components/love/MusicMoment';
import { BloomScene } from '../components/love/BloomScene';
import { DreamCards } from '../components/love/DreamCards';
import { SecretLetter } from '../components/love/SecretLetter';
import { FinalScene } from '../components/love/FinalScene';

const TOTAL_STEPS = 10;

export default function LoveJourneyPage() {
  const { currentStep, nextStep, reset } = useJourney(0);
  const { isIdle, idleMessage } = useIdleLove(20000);
  const { message: activePopup, notify } = useNotification(4000);
  const visitCount = useRevisit();

  const [showTransition, setShowTransition] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [moonClicks, setMoonClicks] = useState(0);

  // Business Logic: Notifications
  useEffect(() => {
    if (visitCount > 1) {
      notify(`Chào mừng em quay lại ✨ (Lần thứ ${visitCount})`);
    }
  }, [visitCount, notify]);

  useEffect(() => {
    const timer = setTimeout(() => {
      notify("Em ở lại lâu vậy... làm anh vui ghê 🥰");
    }, 240000);
    return () => clearTimeout(timer);
  }, [notify]);

  useEffect(() => {
    if (isIdle && currentStep > 0 && currentStep < TOTAL_STEPS - 1) {
      notify(idleMessage, 3000);
    }
  }, [isIdle, idleMessage, currentStep, notify]);

  // Handlers
  const handleNextStep = useCallback(() => {
    setShowTransition(true);
    const timer = setTimeout(() => {
      nextStep();
      setShowTransition(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [nextStep]);

  const handleMoonEasterEgg = useCallback(() => {
    setMoonClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        notify("Secret: Anh nhớ em nhiều hơn anh nói đó. 🤫");
        return 0;
      }
      return next;
    });
  }, [notify]);

  const handleRestart = useCallback(() => {
    setShowTransition(true);
    const timer = setTimeout(() => {
      reset();
      setShowTransition(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [reset]);

  // Step Rendering Logic
  const StepComponent = useMemo(() => {
    switch (currentStep) {
      case 0: return <Loader onDone={handleNextStep} />;
      case 1: return <Hero onNext={handleNextStep} />;
      case 2: return <LoveGame onSuccess={handleNextStep} />;
      case 3: return <MemoryCards onNext={handleNextStep} />;
      case 4: return <HeartGame onNext={handleNextStep} />;
      case 5: return <MusicMoment onNext={handleNextStep} isMuted={isMuted} setMuted={setIsMuted} />;
      case 6: return <BloomScene onNext={handleNextStep} />;
      case 7: return <DreamCards onNext={handleNextStep} />;
      case 8: return <SecretLetter onNext={handleNextStep} />;
      case 9: return <FinalScene onRestart={handleRestart} />;
      default: return null;
    }
  }, [currentStep, handleNextStep, handleRestart, isMuted]);

  return (
    <div className="min-h-[100dvh] relative bg-[#fff8f0] font-sans selection:bg-pink-400 selection:text-white overflow-x-hidden">
      <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      <FloatingHearts />
      <TransitionLayer visible={showTransition} />

      {/* Easter Egg Trigger */}
      {currentStep > 0 && (
        <div className="fixed top-4 right-4 w-16 h-16 z-40 cursor-pointer select-none" onClick={handleMoonEasterEgg} />
      )}

      {/* Notification Toast */}
      <AnimatePresence>
        {activePopup && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-[#101828]/80 border border-pink-300 text-pink-200 px-6 py-3 rounded-full text-sm backdrop-blur-md shadow-lg select-none text-center"
          >
            {activePopup}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full min-h-[100dvh]">{StepComponent}</main>
    </div>
  );
}
