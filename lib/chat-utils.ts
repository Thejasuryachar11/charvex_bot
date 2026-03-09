import { Message } from '@/types/chat';

export async function sendMessage(
  messages: Message[]
): Promise<{ content: string; error?: string }> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { content: '', error: error.error || 'Failed to get response' };
    }

    const data = await response.json();
    return { content: data.content };
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      content: '',
      error: 'Network error. Please try again.',
    };
  }
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
