'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import ChatInterface from '@/components/chat-interface';
import { Message } from '@/types/chat';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userName, setUserName] = useState('');
  const [userGender, setUserGender] = useState<'male' | 'female'>('male');
  const [showUserForm, setShowUserForm] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeechPaused, setIsSpeechPaused] = useState(false);
  const recognitionRef = useRef<any>(null);
  const speechRef = useRef<any>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        voicesRef.current = window.speechSynthesis.getVoices();
      }
    };

    loadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Function to get appropriate voice based on gender
  const getVoiceForGender = useCallback((gender: 'male' | 'female') => {
    if (voicesRef.current.length === 0) {
      return null;
    }

    // Try to find a voice matching the gender
    const genderName = gender === 'female' ? 'female' : 'male';
    const matchingVoice = voicesRef.current.find(
      (voice) => voice.name.toLowerCase().includes(genderName) || 
                 voice.lang.includes('en')
    );

    // If no matching voice found, return a default voice
    if (matchingVoice) {
      return matchingVoice;
    }

    // Try alternate approach - look for common female voices
    if (gender === 'female') {
      const femaleVoices = voicesRef.current.filter((voice) =>
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('victoria') ||
        voice.name.toLowerCase().includes('zira')
      );
      if (femaleVoices.length > 0) {
        return femaleVoices[0];
      }
    } else {
      const maleVoices = voicesRef.current.filter((voice) =>
        voice.name.toLowerCase().includes('male') ||
        voice.name.toLowerCase().includes('man') ||
        voice.name.toLowerCase().includes('david') ||
        voice.name.toLowerCase().includes('mark')
      );
      if (maleVoices.length > 0) {
        return maleVoices[0];
      }
    }

    // Fallback to first English voice
    return voicesRef.current.find((voice) => voice.lang.startsWith('en')) || voicesRef.current[0];
  }, []);

  // Function to speak text with gender-based voice
  const speakWithGender = useCallback(
    (text: string, gender: 'male' | 'female'): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!('speechSynthesis' in window)) {
          reject(new Error('Speech Synthesis not supported'));
          return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const selectedVoice = getVoiceForGender(gender);

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        utterance.rate = 1;
        utterance.pitch = gender === 'female' ? 1.2 : 0.9;
        utterance.volume = 1;

        utterance.onend = () => {
          setIsSpeaking(false);
          resolve();
        };

        utterance.onerror = (event) => {
          setIsSpeaking(false);
          console.error('[v0] Speech synthesis error:', event.error);
          reject(new Error(event.error));
        };

        setIsSpeaking(true);
        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      });
    },
    [getVoiceForGender]
  );

  // Function to handle pause/resume
  const handlePauseSpeech = useCallback(() => {
    if ('speechSynthesis' in window) {
      if (isSpeechPaused) {
        window.speechSynthesis.resume();
        setIsSpeechPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsSpeechPaused(true);
      }
    }
  }, [isSpeechPaused]);

  // Function to stop speech
  const handleStopSpeech = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsSpeechPaused(false);
    }
  }, []);

  // Send message and get AI response
  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const { checkRealtimeQuery } = await import('@/lib/ai-service');

        const realtimeResult = checkRealtimeQuery(text);

        if (realtimeResult.type) {
          const responseText = `${userName}, ${realtimeResult.response}`;
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: responseText,
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, aiMessage]);

          try {
            await speakWithGender(responseText, userGender);
          } catch (speechError) {
            console.error('[v0] Speech synthesis error:', speechError);
          }

          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [
              ...messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
              })),
              {
                role: 'user',
                content: text,
              },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        const aiResponse = data.content || 'No response received';
        const responseText = `${userName}, ${aiResponse}`;

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseText,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);

        try {
          await speakWithGender(responseText, userGender);
        } catch (speechError) {
          console.error('[v0] Speech synthesis error:', speechError);
        }
      } catch (error) {
        console.error('[v0] Error:', error);
        const errorMessage = `${userName}, sorry something went wrong. Please try again.`;
        const msg: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: errorMessage,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, msg]);

        try {
          await speakWithGender(errorMessage, userGender);
        } catch (speechError) {
          console.error('[v0] Speech synthesis error:', speechError);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [userName, userGender, messages, speakWithGender]
  );

  // Handle microphone click
  const handleMicrophoneClick = useCallback(() => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.abort();
        setIsListening(false);
      } else {
        recognitionRef.current.start();
      }
    }
  }, [isListening]);

  // Handle user form submission
  const handleUserFormSubmit = (name: string, gender: 'male' | 'female') => {
    setUserName(name);
    setUserGender(gender);
    setShowUserForm(false);

    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Hello ${name}! I'm your AI assistant. How can I help you today?`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);

    speakWithGender(`Hello ${name}! I'm your AI assistant. How can I help you today?`, gender);
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && !showUserForm) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition && !recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
          setIsListening(true);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          if (event.error !== 'aborted') {
            console.error('[v0] Speech recognition error:', event.error);
          }
          setIsListening(false);
        };

        recognitionRef.current.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            handleSendMessage(transcript);
          }
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (error) {
          // Safely ignore abort errors
        }
      }
    };
  }, [showUserForm, handleSendMessage]);

  if (showUserForm) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <UserForm onSubmit={handleUserFormSubmit} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <ChatInterface
        messages={messages}
        isLoading={isLoading}
        isListening={isListening}
        isSpeaking={isSpeaking}
        isSpeechPaused={isSpeechPaused}
        userName={userName}
        onSendMessage={handleSendMessage}
        onMicrophoneClick={handleMicrophoneClick}
        onPauseSpeech={handlePauseSpeech}
        onStopSpeech={handleStopSpeech}
      />
    </main>
  );
}

// User Form Component
function UserForm({ onSubmit }: { onSubmit: (name: string, gender: 'male' | 'female') => void }) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name, gender);
    }
  };

  return (
    <div className="w-full max-w-md bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-700">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome!</h1>
        <p className="text-slate-400">Let's get to know you first</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>

        

        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium py-2.5 rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          Start Chatting
        </button>
      </form>
    </div>
  );
}
