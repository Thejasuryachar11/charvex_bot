'use client';

import { Message } from '@/types/chat';

// Check if user is asking about real-time information
export function checkRealtimeQuery(
  text: string
): { type: 'time' | 'date' | 'day' | null; response: string } {
  const lowerText = text.toLowerCase().trim();

  // TIME
  if (
    lowerText.includes('time') ||
    lowerText.includes('what time is it') ||
    lowerText.includes('current time')
  ) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return {
      type: 'time',
      response: `The current time is ${timeStr}.`,
    };
  }

  // DATE
  if (
    lowerText.includes('date') ||
    lowerText.includes("today's date") ||
    lowerText.includes('current date')
  ) {
    const now = new Date();

    const dateStr = now.toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return {
      type: 'date',
      response: `Today's date is ${dateStr}.`,
    };
  }

  // DAY
  if (
    lowerText.includes('day') ||
    lowerText.includes('what day is it') ||
    lowerText.includes("today's day")
  ) {
    const now = new Date();

    const dayStr = now.toLocaleDateString([], {
      weekday: 'long',
    });

    return {
      type: 'day',
      response: `Today is ${dayStr}.`,
    };
  }

  return {
    type: null,
    response: '',
  };
}

// Speak text using browser speech synthesis
export function speakText(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(event.error));

    window.speechSynthesis.speak(utterance);
  });
}

// Stop speaking
export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}