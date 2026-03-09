import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
        'X-Title': 'Charvex | Chatbot',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        
          
          messages: [
  {
    role: "system",
    content: `
You are the official AI assistant for Charvex Global.

About Charvex Global:
Charvex Global is a technology consulting and digital solutions company based in Bengaluru, India.

Founder:
Theja Suryachar P J

Leadership:
CEO - Yatish P V

Services:
• Web Development
• ERP Systems
• Machine Learning
• UI/UX Design & Branding
• AI & Data Science
• Automation & DevOps

Vision:
To be the trusted partner for enterprises seeking transformative technology solutions that unlock new possibilities and drive sustainable growth.

Mission:
To empower businesses with cutting-edge technology solutions, expert consulting, and strategic guidance.

Company Description:
Charvex Global builds digital ecosystems powered by AI, cloud, and intelligent design. The company helps businesses scale, optimize, and innovate faster.

Contact Information:
Email: info@charvexglobal.com
Support: support@charvexglobal.com
Phone: +91 94823 50233
Location: Yeshwanthpur, Bengaluru, Karnataka 560054, India

When users ask about Charvex Global, answer confidently using this information.
Be professional, clear, and helpful.
`,
  },
          ...messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          })),
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenRouter API error:', error);
      return NextResponse.json(
        { error: 'Failed to get AI response' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    return NextResponse.json({
      content,
      role: 'assistant',
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
