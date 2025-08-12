import { NextResponse } from 'next/server';

// Define the expected request body
interface ChatRequest {
  prompt: string;
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
    const { prompt }: ChatRequest = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const url = `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`

    console.log(url)
    console.log(prompt)

    // Make the Azure Open AI request
    const response = await fetch(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt },
          ],
          max_tokens: 4096,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data.choices[0].message.content)
    //const aiResponse = data.choices?.[0]?.message?.content || 'AI: Sorry, I could not respond.';

    const aiResponse = data.choices[0].message.content;
    
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Azure Open AI Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI response' },
      { status: 500 }
    );
  }
}