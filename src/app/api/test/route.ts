import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'API 테스트 성공!',
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      openaiModel: process.env.OPENAI_MODEL,
      imageSize: process.env.OPENAI_IMAGE_SIZE,
      imageQuality: process.env.OPENAI_IMAGE_QUALITY,
    }
  });
}
