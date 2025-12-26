
import React, { useState } from 'react';
import { speak } from '../services/geminiService';

interface AudioButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
}

const AudioButton: React.FC<AudioButtonProps> = ({ text, size = 'md' }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    await speak(text);
    // Simple cooldown to prevent multiple overlapping requests
    setTimeout(() => setIsPlaying(false), 1000);
  };

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2.5',
    lg: 'p-4'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8'
  };

  return (
    <button
      onClick={handlePlay}
      disabled={isPlaying}
      className={`${sizeClasses[size]} rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors disabled:opacity-50 flex items-center justify-center`}
      title="Ouvir"
    >
      <svg
        className={`${iconSizes[size]} ${isPlaying ? 'animate-pulse' : ''}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M14.659 6.201a.75.75 0 01.346 1.02 9.92 9.92 0 010 8.558.75.75 0 11-1.314-.725 8.42 8.42 0 000-7.108.75.75 0 01.968-.745zm3.447-2.312a.75.75 0 01.354 1.014 14.42 14.42 0 010 14.194.75.75 0 11-1.318-.72 12.92 12.92 0 000-12.154.75.75 0 01.964-.334zM10.44 3.905a.75.75 0 01.442.68v14.83a.75.75 0 01-1.218.583L5.33 16.315H3.75A1.75 1.75 0 012 14.565v-5.13a1.75 1.75 0 011.75-1.75h1.58l4.333-3.69a.75.75 0 01.777-.09z" />
      </svg>
    </button>
  );
};

export default AudioButton;
