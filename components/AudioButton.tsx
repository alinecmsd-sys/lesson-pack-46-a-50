import React, { useState } from 'react';
import { speak } from '../services/geminiService';

interface AudioButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
}

const AudioButton: React.FC<AudioButtonProps> = ({ text, size = 'md' }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (status === 'loading') return;

    setStatus('loading');
    const success = await speak(text);
    
    if (success) {
      setTimeout(() => setStatus('idle'), 1500);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
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

  const getButtonClass = () => {
    const base = `${sizeClasses[size]} rounded-full transition-all flex items-center justify-center border`;
    if (status === 'loading') return `${base} bg-yellow-50 text-yellow-600 border-yellow-200 cursor-wait`;
    if (status === 'error') return `${base} bg-red-50 text-red-600 border-red-200`;
    return `${base} bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100`;
  };

  return (
    <button
      onClick={handlePlay}
      disabled={status === 'loading'}
      className={getButtonClass()}
      title={status === 'error' ? "Erro ao carregar áudio" : "Ouvir"}
    >
      <svg
        className={`${iconSizes[size]} ${status === 'loading' ? 'animate-spin' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {status === 'loading' ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        ) : status === 'error' ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        )}
      </svg>
    </button>
  );
};

export default AudioButton;