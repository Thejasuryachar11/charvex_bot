'use client';

import React, { useState, useRef, useEffect } from 'react';
import MicrophoneButton from './microphone-button';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isListening: boolean;
  onMicrophoneClick: () => void;
}

export default function ChatInput({
  onSendMessage,
  isLoading,
  isListening,
  onMicrophoneClick,
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isSpeechRecognizing, setIsSpeechRecognizing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition for the input
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
          setIsSpeechRecognizing(true);
        };

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptSegment = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              setTranscript((prev) => prev + transcriptSegment);
              setInput((prev) => prev + transcriptSegment);
            } else {
              interimTranscript += transcriptSegment;
            }
          }
        };

        recognitionRef.current.onend = () => {
          setIsSpeechRecognizing(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          if (event.error !== 'aborted') {
            console.error('Speech recognition error:', event.error);
          }
          setIsSpeechRecognizing(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
      setTranscript('');
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleMicrophoneClick = () => {
    if (recognitionRef.current) {
      if (isSpeechRecognizing) {
        recognitionRef.current.abort();
        setIsSpeechRecognizing(false);
      } else {
        setTranscript('');
        recognitionRef.current.start();
      }
    }
    onMicrophoneClick();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message or use the microphone..."
        disabled={isLoading || isListening}
        className="flex-1 bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      />

      <MicrophoneButton
        isListening={isSpeechRecognizing}
        isLoading={isLoading}
        onClick={handleMicrophoneClick}
      />

      <button
        type="submit"
        disabled={isLoading || !input.trim() || isListening}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg px-4 py-2.5 font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="hidden sm:inline">Sending...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,0.9 1.77946707,1.38904057 C0.994623095,2.01768206 0.837654326,3.10604706 1.15159189,3.89154395 L3.03521743,10.3325369 C3.03521743,10.4896343 3.19218622,10.6467317 3.50612381,10.6467317 L16.6915026,11.4322186 C16.6915026,11.4322186 17.1624089,11.4322186 17.1624089,10.9609265 L17.1624089,12.0495627 C17.1624089,12.5208548 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
            </svg>
            <span className="hidden sm:inline">Send</span>
          </>
        )}
      </button>
    </form>
  );
}
