import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

const STACK_AI_API_URL = "https://api.stack-ai.com/inference/v0/run/451d2968-2035-422e-a3a3-a2eaff4afdce/67e197e79243101a48bbcf03";
const STACK_AI_API_KEY = "9e821633-7628-4b22-b703-c88311ac17c2";

// Temporary storage for generated images (replace with database later)
let generatedImages: Array<{
  id: string;
  imageUrl: string;
  prompt: string;
  createdAt: string;
  userId: string;
}> = [];

// Add a new endpoint to proxy image requests
export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const imageUrl = url.searchParams.get('url');

    if (imageUrl) {
      // Proxy the image request
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      const blob = await response.blob();
      return new NextResponse(blob, {
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'image/png',
          'Cache-Control': 'public, max-age=31536000',
        },
      });
    }

    // If no imageUrl parameter, return user's images
    const userImages = generatedImages.filter(
      img => img.userId === session.user?.email
    );

    console.log('Returning user images:', userImages);
    return NextResponse.json({ images: userImages });
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Call Stack AI API to generate image
    const response = await fetch(STACK_AI_API_URL, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${STACK_AI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "txt2img-0": prompt,
        "user_id": session.user?.email || "anonymous",
        "in-0": ""
      })
    });

    if (!response.ok) {
      console.error('Stack AI API error:', await response.text());
      throw new Error(`Stack AI API error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Stack AI response:', JSON.stringify(result, null, 2));

    // Extract image URL from the markdown-formatted response
    const markdownText = result.outputs?.['out-0'];
    if (!markdownText) {
      console.error('No output in response:', result);
      return NextResponse.json(
        { error: "No output was generated" },
        { status: 500 }
      );
    }

    // Extract URL from markdown image syntax ![alt](url)
    const imageUrlMatch = markdownText.match(/!\[.*?\]\((.*?)\)/);
    const originalImageUrl = imageUrlMatch?.[1];
    
    if (!originalImageUrl) {
      console.error('No image URL in response:', result);
      return NextResponse.json(
        { error: "No image was generated in the response" },
        { status: 500 }
      );
    }

    // Create a proxied URL for the image
    const proxiedImageUrl = `/api/generate-image?url=${encodeURIComponent(originalImageUrl)}`;

    // Store the generated image with the proxied URL
    const newImage = {
      id: Math.random().toString(36).substring(7),
      imageUrl: proxiedImageUrl,
      prompt,
      createdAt: new Date().toISOString(),
      userId: session.user?.email || "anonymous"
    };
    generatedImages.unshift(newImage);

    // Return both the new image and all user's images
    const userImages = generatedImages.filter(
      img => img.userId === session.user?.email
    );

    return NextResponse.json({ 
      imageUrl: proxiedImageUrl, 
      imageId: newImage.id,
      images: userImages 
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate image. Please try again." },
      { status: 500 }
    );
  }
} 