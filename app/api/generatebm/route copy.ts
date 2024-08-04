import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const response = await fetch('http://43.201.248.119:2333/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      text:prompt,
    }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}