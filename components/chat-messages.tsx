import React from 'react';
import { Message } from '@/types/chat';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
      {messages.length === 0 && !isLoading && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Start a Conversation</h2>
              <p className="text-slate-400">Type a message or use the microphone button to start chatting</p>
            </div>
          </div>
        </div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex animate-in fade-in slide-in-from-bottom-3 duration-500 ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow-md transition-all hover:shadow-lg ${
              message.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-slate-700 text-slate-100 rounded-bl-none'
            }`}
          >
            <p className="text-sm leading-relaxed break-words">{message.content}</p>
            <span className={`text-xs mt-1.5 block ${message.role === 'user' ? 'text-blue-100' : 'text-slate-500'}`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start animate-in fade-in">
          <div className="bg-slate-700 text-slate-100 px-4 py-3 rounded-lg rounded-bl-none">
            <div className="flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-xs text-slate-400 ml-2">AI is thinking...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
