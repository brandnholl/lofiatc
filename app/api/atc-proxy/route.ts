import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get the station parameter from the URL
  const searchParams = request.nextUrl.searchParams;
  const station = searchParams.get('station');
  const nocache = searchParams.get('nocache');
  
  if (!station) {
    return NextResponse.json({ error: 'Station parameter is required' }, { status: 400 });
  }

  try {
    // Construct the LiveATC URL
    const liveAtcUrl = `https://s1-fmt2.liveatc.net/${station}?nocache=${nocache || Date.now()}`;
    
    // Fetch the audio stream from LiveATC
    const response = await fetch(liveAtcUrl, {
      headers: {
        // Set a browser-like User-Agent to avoid being blocked
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        // Set a common Referer that might be allowed
        'Referer': 'https://www.liveatc.net/',
      },
    });

    if (!response.ok) {
      console.error(`LiveATC responded with ${response.status}: ${response.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch audio stream: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Get the response body as a readable stream
    const audioStream = response.body;
    
    if (!audioStream) {
      return NextResponse.json({ error: 'No audio stream received' }, { status: 500 });
    }

    // Create a new response with the audio stream
    return new NextResponse(audioStream, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error proxying audio stream:', error);
    return NextResponse.json(
      { error: 'Failed to proxy audio stream' },
      { status: 500 }
    );
  }
}