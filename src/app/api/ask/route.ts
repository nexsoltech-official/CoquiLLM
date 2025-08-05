export async function POST(req: Request) {
  const { prompt } = await req.json();
  try {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gemma3:12b', prompt, stream: false })
    });
    const data = await res.json();
    return Response.json({ answer: data.response });
  } catch (e) {
    return new Response('LLM error', { status: 500 });
  }
}

