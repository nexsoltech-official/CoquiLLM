import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get the text
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Use GET request with query parameters (matching working requests from logs)
    const params = new URLSearchParams({
      text: text,
      speaker_id: 'Marcos Rudaski',
      language_id: 'en'
    });

    // Call the Coqui TTS service
    const ttsResponse = await fetch(`http://localhost:5002/api/tts?${params.toString()}`, {
      method: 'GET',
    });

    if (!ttsResponse.ok) {
      throw new Error(`TTS service responded with ${ttsResponse.status}: ${ttsResponse.statusText}`);
    }

    // Get the audio response as a stream
    const audioStream = ttsResponse.body;

    if (!audioStream) {
      throw new Error('No audio stream received from TTS service');
    }

    // Create a ReadableStream from the response
    const stream = new ReadableStream({
      start(controller) {
        const reader = audioStream.getReader();
        
        function pump(): Promise<void> {
          return reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            controller.enqueue(value);
            return pump();
          });
        }
        
        return pump();
      }
    });

    // Return the audio stream with appropriate headers
    return new NextResponse(stream, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('TTS API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
}
