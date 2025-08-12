import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  try {


    const backendApiKey = process.env.BACKEND_API_KEY || "";
    const backendURL = process.env.BACKEND_URL || "";
    // Check if this is a detail request
    const body = await request.json().catch(() => null);

    // If shortCode exists in body, handle detail request
    if (body?.shortCode) {
      //const detailUrl = "http://localhost:8000/get_cot_detail";
     
      const detailUrl = backendURL + "/get_latest_indicators"

      const detailResponse = await fetch(detailUrl, {
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
    
    // const url = "http://localhost:8000/get_latest_cot_report"
    //const url = "https://demo-ai-back-app.yellowwave-34677aad.uksouth.azurecontainerapps.io/query";

    const url = backendURL + "/get_latest_cot_report"

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