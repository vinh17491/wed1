import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Hooks
import { useJourney } from '../hooks/useJourney';
import { useIdleLove } from '../hooks/useIdleLove';
import { useRevisit } from '../hooks/useRevisit';

// Components
import { ProgressBar } from '../components/love/ProgressBar';
import { FloatingHearts } from '../components/love/FloatingHearts';
import { TransitionLayer } from '../components/love/TransitionLayer';

// Steps
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

export default function LoveJourneyPage() {
  const { currentStep, nextStep, reset } = useJourney(0);
  const { isIdle, idleMessage } = useIdleLove(20000); // 20s idle
  const visitCount = useRevisit();

  const [showTransition, setShowTransition] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [moonClicks, setMoonClicks] = useState(0);

  const totalSteps = 10;

  // Revisit check
  useEffect(() => {
    if (visitCount > 1) {
      setActivePopup(`Chào mừng em quay lại ✨ (Lần thứ ${visitCount})`);
      const t = setTimeout(() => setActivePopup(null), 4000);
      return () => clearTimeout(t);
    }
  }, [visitCount]);

  // Duration tracker (4 min popup)
  useEffect(() => {
    const timer = setTimeout(() => {
      setActivePopup("Em ở lại lâu vậy... làm anh vui ghê 🥰");
    }, 240000); // 4 minutes

    return () => clearTimeout(timer);
  }, []);

  // Trigger idle notifications
  useEffect(() => {
    if (isIdle && currentStep > 0 && currentStep < totalSteps - 1) {
      setActivePopup(idleMessage);
      const t = setTimeout(() => setActivePopup(null), 3000);
      return () => clearTimeout(t);
    }
  }, [isIdle, idleMessage, currentStep]);

  // Custom transition layer handler
  const handleNextStep = () => {
    setShowTransition(true);
    setTimeout(() => {
      nextStep();
      setShowTransition(false);
    }, 600);
  };

  // Easter Egg: Moon click
  const handleMoonEasterEgg = () => {
    setMoonClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setActivePopup("Secret: Anh nhớ em nhiều hơn anh nói đó. 🤫");
        return 0;
      }
      return next;
    });
  };

  return (
    <div className="min-h-[100dvh] relative bg-[#fff8f0] font-sans selection:bg-pink-400 selection:text-white overflow-x-hidden">
      {/* Persistent Overlays */}
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <FloatingHearts />
      <TransitionLayer visible={showTransition} />

      {/* Easter Egg Moon clickable zone (Invisible, top right corner) */}
      {currentStep > 0 && (
        <div
          className="fixed top-4 right-4 w-16 h-16 z-40 cursor-pointer select-none"
          onClick={handleMoonEasterEgg}
        />
      )}

      {/* Small Alert Toast */}
      <AnimatePresence>
        {activePopup && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-[#101828]/80 border border-pink-300 text-pink-200 px-6 py-3 rounded-full text-sm backdrop-blur-md shadow-lg select-none text-center whitespace-nowrap"
          >
            {activePopup}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Switch Chapters */}
      <main className="w-full min-h-[100dvh]">
        {currentStep === 0 && <Loader onDone={handleNextStep} />}
        {currentStep === 1 && <Hero onNext={handleNextStep} />}
        {currentStep === 2 && <LoveGame onSuccess={handleNextStep} />}
        {currentStep === 3 && <MemoryCards onNext={handleNextStep} />}
        {currentStep === 4 && <HeartGame onNext={handleNextStep} />}
        {currentStep === 5 && (
          <MusicMoment
            onNext={handleNextStep}
            isMuted={isMuted}
            setMuted={setIsMuted}
          />
        )}
        {currentStep === 6 && <BloomScene onNext={handleNextStep} />}
        {currentStep === 7 && <DreamCards onNext={handleNextStep} />}
        {currentStep === 8 && <SecretLetter onNext={handleNextStep} />}
        {currentStep === 9 && (
          <FinalScene
            onRestart={() => {
              setShowTransition(true);
              setTimeout(() => {
                reset();
                setShowTransition(false);
              }, 600);
            }}
          />
        )}
      </main>
    </div>
  );
}
