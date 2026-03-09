import React from 'react';

interface MicrophoneButtonProps {
  isListening: boolean;
  isLoading: boolean;
  onClick: () => void;
}

export default function MicrophoneButton({
  isListening,
  isLoading,
  onClick,
}: MicrophoneButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`rounded-lg px-4 py-2.5 font-medium transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
        isListening
          ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/50'
          : 'bg-slate-600 hover:bg-slate-700 text-white disabled:bg-slate-500'
      }`}
      title={isListening ? 'Stop listening' : 'Start listening'}
    >
      {isListening ? (
        <>
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="hidden sm:inline">Stop</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 16.91c-1.48 1.46-3.51 2.36-5.77 2.36-2.26 0-4.29-.9-5.77-2.36l-1.1 1.1c1.86 1.86 4.41 3 7.07 3s5.21-1.14 7.07-3l-1.1-1.1zM19.5 9.5h-2c0 3.03-2.47 5.5-5.5 5.5s-5.5-2.47-5.5-5.5h-2c0 4.42 3.58 8 8 8s8-3.58 8-8z" />
          </svg>
          <span className="hidden sm:inline">Voice</span>
        </>
      )}
    </button>
  );
}
