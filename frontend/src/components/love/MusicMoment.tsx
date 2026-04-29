import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface MusicMomentProps {
  onNext: () => void;
  isMuted: boolean;
  setMuted: (muted: boolean) => void;
}

export const MusicMoment: React.FC<MusicMomentProps> = ({ onNext, isMuted, setMuted }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Using a premium royalty-free soft piano stream for smooth continuous background
  const audioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audio.loop = true;
    audioRef.current = audio;

    // Sync with master muted state
    audio.muted = isMuted;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (!isMuted && isPlaying) {
        audioRef.current.play().catch((err) => console.log('Autoplay blocked', err));
      } else if (isMuted && !isPlaying) {
        // No auto play if muted
      }
    }
  }, [isMuted, isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // If user clicks play, we automatically unmute to provide the audio
      if (isMuted) setMuted(false);
      audioRef.current.play().catch((err) => console.log('Play failed', err));
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#fff8f0] text-[#9b6b43] flex flex-col items-center justify-center px-6 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md z-20 flex flex-col items-center"
      >
        <h2 className="text-2xl font-semibold mb-2">Giai điệu ngọt ngào 🎵</h2>
        <p className="text-sm text-gray-600 mb-12">Dành tặng em một khoảng lặng bình yên...</p>

        {/* Vinyl Disc Visual */}
        <div className="relative w-56 h-56 md:w-64 md:h-64 mb-12">
          {/* Outer Ring */}
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="w-full h-full bg-[#101828] rounded-full shadow-2xl flex items-center justify-center relative"
          >
            {/* Grooves on vinyl */}
            <div className="absolute inset-4 border-4 border-[#1a2333] rounded-full opacity-40" />
            <div className="absolute inset-8 border-2 border-[#1a2333] rounded-full opacity-30" />
            <div className="absolute inset-16 border border-[#1a2333] rounded-full opacity-20" />

            {/* Vinyl Label */}
            <div className="w-20 h-20 md:w-24 md:h-24 bg-pink-200 rounded-full flex items-center justify-center border-4 border-white shadow-inner">
              <span className="text-2xl select-none animate-pulse">💝</span>
            </div>
          </motion.div>

          {/* Disc Needle Arm */}
          <motion.div
            animate={{ rotate: isPlaying ? 25 : 0 }}
            transition={{ duration: 0.5 }}
            className="absolute -top-4 right-0 w-6 h-32 origin-top bg-gray-400 rounded shadow-md z-20 pointer-events-none"
          >
            <div className="w-8 h-8 -ml-1 -mt-1 bg-gray-600 rounded-full border-4 border-gray-300" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-6 bg-gray-500 rounded-t" />
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mb-12">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-pink-400 hover:bg-pink-500 text-white flex items-center justify-center shadow-lg focus:outline-none text-lg"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setMuted(!isMuted)}
            className="w-12 h-12 rounded-full bg-[#9b6b43]/20 hover:bg-[#9b6b43]/30 text-[#9b6b43] flex items-center justify-center border border-[#9b6b43]/30 focus:outline-none text-lg"
          >
            {isMuted ? '🔇' : '🔊'}
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="px-10 py-3 bg-gradient-to-r from-pink-400 to-pink-500 text-white font-semibold rounded-full shadow-lg z-30 focus:outline-none text-base"
        >
          Đi tiếp thôi 👣
        </motion.button>
      </motion.div>
    </div>
  );
};
