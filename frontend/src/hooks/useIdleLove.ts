import { useEffect, useState } from 'react';
import { idleMessages } from '../data/loveData';

export const useIdleLove = (idleTimeLimit = 20000) => {
  const [isIdle, setIsIdle] = useState(false);
  const [idleMessage, setIdleMessage] = useState('');

  useEffect(() => {
    let timeoutId: any;

    const resetIdle = () => {
      setIsIdle(prev => prev ? false : prev); 
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsIdle(true);
        const randomMsg = idleMessages[Math.floor(Math.random() * idleMessages.length)];
        setIdleMessage(randomMsg);
      }, idleTimeLimit);
    };

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('touchstart', resetIdle);

    timeoutId = setTimeout(() => {
      setIsIdle(true);
      const randomMsg = idleMessages[Math.floor(Math.random() * idleMessages.length)];
      setIdleMessage(randomMsg);
    }, idleTimeLimit);

    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('touchstart', resetIdle);
      clearTimeout(timeoutId);
    };
  }, [idleTimeLimit]);

  return { isIdle, idleMessage };
};
