import { useEffect, useState, useRef } from 'react';

interface TextScrambleProps {
  text: string;
  duration?: number;
  revealDelay?: number;
  className?: string;
}

export default function TextScramble({ text, duration = 800, revealDelay = 0, className }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState('');
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
  const iteration = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const startScramble = () => {
      let interval = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, index) => {
              if (index < iteration.current) {
                return char;
              }
              return characters[Math.floor(Math.random() * characters.length)];
            })
            .join('')
        );

        if (iteration.current >= text.length) {
          clearInterval(interval);
        }

        iteration.current += text.length / (duration / 60);
      }, 60);

      return () => clearInterval(interval);
    };

    const delayTimeout = setTimeout(() => {
      startScramble();
    }, revealDelay);

    return () => {
      clearTimeout(delayTimeout);
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [text, duration, revealDelay]);

  return <span className={className}>{displayText}</span>;
}
