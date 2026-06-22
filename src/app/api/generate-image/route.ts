import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 });
    }

    // Since native image generation models might hit quota limits, 
    // we use gemini-2.5-flash to generate an aesthetic SVG image representation of the prompt.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const svgPrompt = `
You are an expert SVG designer. Create a highly aesthetic, premium, abstract SVG placeholder image based on this prompt: "${prompt}".
The SVG should be beautiful, using modern gradients, abstract shapes (like glassmorphism, fluid forms, or geometric tech patterns).
The viewBox should be "0 0 800 600".
Return ONLY valid SVG code. Do not wrap it in markdown blockquotes, do not include any other text, just the raw <svg>...</svg> XML.
    `.trim();

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: svgPrompt }] }],
        generationConfig: {
          temperature: 0.7,
        }
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

    // Strip out markdown if the model hallucinates it
    textContent = textContent.replace(/```xml\n?/g, '').replace(/```svg\n?/g, '').replace(/```\n?/g, '').trim();

    // Ensure it starts with <svg
    if (!textContent.startsWith('<svg')) {
      const startIdx = textContent.indexOf('<svg');
      if (startIdx !== -1) {
        textContent = textContent.substring(startIdx);
      } else {
        throw new Error('Failed to generate valid SVG');
      }
    }

    const base64Svg = Buffer.from(textContent).toString('base64');

    return NextResponse.json({ 
      success: true, 
      image: `data:image/svg+xml;base64,${base64Svg}` 
    });

  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
