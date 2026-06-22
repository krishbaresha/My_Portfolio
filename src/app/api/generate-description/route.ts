import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { owner, repo, description, language } = await req.json();

    if (!owner || !repo) {
      return NextResponse.json({ error: 'Owner and Repo are required' }, { status: 400 });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 });
    }

    // Try to fetch README from GitHub (no token needed for public repos, but rate-limited)
    let readmeContent = '';
    try {
      const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`);
      if (readmeRes.ok) {
        const readmeData = await readmeRes.json();
        readmeContent = Buffer.from(readmeData.content, 'base64').toString('utf-8');
      }
    } catch (e) {
      console.warn('Failed to fetch README:', e);
    }

    const prompt = `
You are an expert copywriter for an Awwwards-winning developer portfolio.
I am providing you with the metadata and README of a GitHub project.

Project Name: ${repo}
Original Description: ${description || 'None provided'}
Primary Language: ${language || 'Unknown'}

README content:
${readmeContent.substring(0, 3000)}

Please write a 2-paragraph, premium, engaging description of this project suitable for a high-end creative portfolio case study. 
Do not use markdown headers, just return the raw text in beautiful format no mess, perfect for portfolio case and short but premium.
    `.trim();

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7 }
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API Error:', errText);
      throw new Error(`Gemini API failed with status ${response.status}`);
    }

    const data = await response.json();
    let textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      throw new Error('No content generated');
    }

    return NextResponse.json({ success: true, description: textContent.trim() });

  } catch (error) {
    console.error('Error generating description:', error);
    return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 });
  }
}
