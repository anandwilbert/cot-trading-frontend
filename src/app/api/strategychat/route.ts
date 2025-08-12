import { NextResponse } from 'next/server';

// Define the expected request body
interface ChatRequest {
  question: string;
}

export async function POST(request: Request) {
  try {
    // Validate environment variables
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;

    if (!endpoint || !deploymentName || !apiVersion || !apiKey) {
      return NextResponse.json(
        { error: 'Missing Azure Open AI configuration' },
        { status: 500 }
      );
    }

    // Parse the request body
    const { question }: ChatRequest = await request.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }


    // const url = "http://localhost:8000/query"
    //const url = "https://demo-ai-back-app.yellowwave-34677aad.uksouth.azurecontainerapps.io/query";

    const backendApiKey = process.env.BACKEND_API_KEY || "";
    const url: string = `${process.env.BACKEND_URL}/query`;

    console.log(url)
    console.log(question)

    // Make the Azure Open AI request
    const response = await fetch(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': backendApiKey,
        },
        body: JSON.stringify(
            { question: question },
        ),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data.response)
    //const aiResponse = data.choices?.[0]?.message?.content || 'AI: Sorry, I could not respond.';

    //const aiResponse = data.choices[0].message.content;
    const aiResponse = data.response;
    
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Azure Open AI Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI response' },
      { status: 500 }
    );
  }
}