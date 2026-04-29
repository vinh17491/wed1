import { useState, useEffect, useRef } from 'react';

export const useAudio = (url: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(url);
    audio.loop = true;
    audio.muted = true;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [url]);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => console.log('Audio autoplay prevented', err));
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMute = !isMuted;
      audioRef.current.muted = newMute;
      setIsMuted(newMute);
      if (!newMute && !isPlaying) {
        play();
      }
    }
  };

  return { isPlaying, isMuted, play, pause, toggleMute };
};
