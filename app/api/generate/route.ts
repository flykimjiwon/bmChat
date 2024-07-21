import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}


// export default async function handler(req:any, res:any) {
//     if (req.method !== 'POST') {
//       res.setHeader('Allow', ['POST']);
//       return res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
  
//     const { prompt } = req.body;
  
//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: 'gpt-3.5-turbo',
//         messages: [{ role: 'user', content: prompt }],
//         max_tokens: 1000,
//       }),
//     });
  
//     const data = await response.json();
//     res.status(200).json(data);
//   }

 
