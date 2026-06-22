import { NextResponse } from 'next/server';

const AI_PROVIDER = process.env.AI_PROVIDER || 'GEMINI';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GROK_API_KEY = process.env.GROK_API_KEY || '';

const SYSTEM_INSTRUCTION = `
You are the AI Assistant for Krish Baresha, an Elite Awwwards-winning Creative Developer, Senior Product Designer, Motion Designer, and AI Engineer.
Your goal is to represent Krish professionally, share details about his background, projects, and skills, and convince visitors (founders, clients, recruiters) to hire him.

Profile of Krish Baresha:
- Title: AI Engineer | Full Stack Developer | Creative Technologist
- Style & Philosophy: Apple + Linear + Stripe design aesthetics. Dark luxury layouts, premium glassmorphism, micro-animations, GSAP timelines, WebGL, 3D elements, and extreme performance (Lighthouse 95+).
- Core Expertise:
  - AI: Autonomous agentic workflows, RAG, pgvector, LangChain, OpenAI/Gemini integration.
  - Frontend: React, Next.js 15, TypeScript, TailwindCSS, GSAP, Framer Motion, Three.js/React Three Fiber.
  - Backend: Node.js, Express, PostgreSQL, MongoDB, Supabase.
  - Cloud: AWS, Vercel, Supabase, CI/CD.

Key Projects to highlight:
1. neuro-flow: Autonomous multi-agent visual browser task system (Next.js 15, Puppeteer, Vector DBs). Self-heals browser sessions.
2. aurora-canvas: WebGL and Three.js dashboards representing flow fields (GLSL shaders, GSAP ScrollTrigger, React Three Fiber).
3. synapse-rag: Local vector search and document intelligence engine (PostgreSQL, pgvector, Gemini API).

Be concise, premium, and confident in your tone. Reflect a Stripe/Linear design engineer vibe. Keep answers short, structured, and use Markdown formatting where relevant. Do not hallucinate or make up details.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }


    if (AI_PROVIDER === 'GEMINI') {
      if (!GEMINI_API_KEY) {
        return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 });
      }

      // Convert messages to Gemini format
      const geminiContents = messages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: geminiContents,
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }],
          },
          generationConfig: {
            maxOutputTokens: 800,
            temperature: 0.7,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Gemini API Error:', errText);
        throw new Error(`Gemini API failed with status ${response.status}`);
      }

      const data = await response.json();
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that request.";
      return NextResponse.json({ role: 'assistant', content: answer });

    } else if (AI_PROVIDER === 'GROK') {
      if (!GROK_API_KEY) {
        return NextResponse.json({ error: 'Grok API key is not configured' }, { status: 500 });
      }

      // Groq (gsk_...) vs xAI (grok-...) auto-detection
      const isGroq = GROK_API_KEY.startsWith('gsk_');
      const endpoint = isGroq 
        ? 'https://api.groq.com/openai/v1/chat/completions' 
        : 'https://api.x.ai/v1/chat/completions';
      
      const modelName = isGroq ? 'llama-3.3-70b-versatile' : 'grok-beta';

      const chatMessages = [
        { role: 'system', content: SYSTEM_INSTRUCTION },
        ...messages.map((m) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content,
        })),
      ];

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROK_API_KEY}`,
        },
        body: JSON.stringify({
          model: modelName,
          messages: chatMessages,
          max_tokens: 800,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Grok/Groq API Error:', errText);
        throw new Error(`Grok/Groq API failed with status ${response.status}`);
      }

      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content || "I couldn't process that request.";
      return NextResponse.json({ role: 'assistant', content: answer });

    } else {
      return NextResponse.json({ error: 'Invalid AI Provider configured' }, { status: 500 });
    }

  } catch (error) {
    const err = error as Error;
    console.error('Error in AI Assistant API route:', err);
    return NextResponse.json({ error: err.message || 'Failed to process AI chat request' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
