import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  try {

    // Check if this is a detail request
    const body = await request.json().catch(() => null);

    console.log("In POST method");
    console.log(body);

    // If shortCode exists in body, handle detail request
    if (body?.shortCode) {

      //const detailUrl = "http://localhost:8000/generate_trade_strategy";
      const backendApiKey = process.env.BACKEND_API_KEY || "";
      const backendURL = process.env.BACKEND_URL || "";

      const url = backendURL + "/generate_trade_strategy"

      
      const detailResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': backendApiKey,
        },
        body: JSON.stringify({ short_code: body.shortCode }),
      });

      if (!detailResponse.ok) {
        throw new Error(`HTTP error! status: ${detailResponse.status}`);
      }

      const detailData = await detailResponse.json();
      return NextResponse.json({ response: detailData });
    }
    
  } catch (error) {
    console.error('Azure Open AI Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI response' },
      { status: 500 }
    );
  }
}