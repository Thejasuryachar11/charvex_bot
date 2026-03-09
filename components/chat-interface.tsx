import React, { useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import ChatMessages from './chat-messages';
import ChatInput from './chat-input';
import MicrophoneButton from './microphone-button';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isSpeechPaused: boolean;
  userName: string;
  onSendMessage: (message: string) => void;
  onMicrophoneClick: () => void;
  onPauseSpeech: () => void;
  onStopSpeech: () => void;
}

export default function ChatInterface({
  messages,
  isLoading,
  isListening,
  isSpeaking,
  isSpeechPaused,
  userName,
  onSendMessage,
  onMicrophoneClick,
  onPauseSpeech,
  onStopSpeech,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="w-full max-w-2xl h-screen md:h-[600px] bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-700">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-600 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div>
            <h1 className="text-lg font-semibold text-white">AI Assistant</h1>
            <p className="text-xs text-slate-400">Chat with {userName}</p>
          </div>
        </div>

        {/* Speech Controls */}
        {isSpeaking && (
          <div className="flex items-center gap-2">
            <button
              onClick={onPauseSpeech}
              className="p-2 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 hover:text-white"
              title={isSpeechPaused ? 'Resume' : 'Pause'}
            >
              {isSpeechPaused ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              )}
            </button>
            <button
              onClick={onStopSpeech}
              className="p-2 hover:bg-red-600/20 rounded-lg transition-colors text-slate-300 hover:text-red-400"
              title="Stop"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h12v12H6z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Messages Container */}
      <ChatMessages messages={messages} isLoading={isLoading} />
      <div ref={messagesEndRef} />

      {/* Listening Indicator */}
      {isListening && (
        <div className="px-6 py-2 bg-blue-500/10 border-b border-blue-500/20">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-1.5 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-sm text-blue-300">Listening...</span>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="px-6 py-4 bg-slate-800 border-t border-slate-600">
        <ChatInput
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          isListening={isListening}
          onMicrophoneClick={onMicrophoneClick}
        />
      </div>
    </div>
  );
}
