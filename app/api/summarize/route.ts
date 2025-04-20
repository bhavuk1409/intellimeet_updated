import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;
    
    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    console.log('Proxy API route called with URL:', url);
    
    // Make the request to the summary API
    const response = await fetch('http://127.0.0.1:8000/process_video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ url }),
      // Adding a longer timeout as video processing might take time
      cache: 'no-store',
    });
    
    if (!response.ok) {
      let errorDetail = '';
      try {
        const errorData = await response.json();
        errorDetail = JSON.stringify(errorData);
      } catch {
        errorDetail = await response.text();
      }
      
      console.error('API error response:', errorDetail);
      
      // If it's a Method Not Allowed error, try a more specific error message
      if (response.status === 405) {
        return NextResponse.json(
          { 
            error: "API returned Method Not Allowed (405). The API endpoint might only accept requests from Swagger UI.",
            detail: errorDetail,
            suggestion: "Try accessing the API directly through http://127.0.0.1:8000/docs"
          },
          { status: response.status }
        );
      }
      
      return NextResponse.json(
        { 
          error: `API responded with status: ${response.status}`,
          detail: errorDetail 
        },
        { status: response.status }
      );
    }
    
    let data;
    try {
      data = await response.json();
      console.log('API response data:', data);
    } catch (error) {
      console.error('Error parsing API response:', error);
      const textResponse = await response.text();
      return NextResponse.json(
        { 
          result: textResponse,
          warning: "Response was not valid JSON, showing text content instead" 
        }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in proxy API route:', error);
    return NextResponse.json(
      { error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 