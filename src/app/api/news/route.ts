import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  try {
    
    //const url = "http://localhost:8000/get_latest_news_events"
    //const url = "https://demo-ai-back-app.yellowwave-34677aad.uksouth.azurecontainerapps.io/query";
    const backendApiKey = process.env.BACKEND_API_KEY || "";
    const backendURL = process.env.BACKEND_URL || "";

    const url = backendURL + "/get_latest_news_events"

    console.log(url)

    // Make the Azure Open AI request
    const response = await fetch(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': backendApiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data)
    //const aiResponse = data.choices?.[0]?.message?.content || 'AI: Sorry, I could not respond.';

    //const aiResponse = data.choices[0].message.content;
    const result = data;
    
    return NextResponse.json({ response: result });
  } catch (error) {
    console.error('Azure Open AI Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI response' },
      { status: 500 }
    );
  }
}