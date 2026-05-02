export const generateSparkles = (count = 10) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `sparkle-${i}-${Date.now()}`,
    size: Math.random() * 15 + 5,
    style: {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`
    }
  }));
};

export const triggerHaptic = () => {
  if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate([100, 50, 100]);
  }
};
