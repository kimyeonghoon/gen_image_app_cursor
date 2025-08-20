import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { generateTattooPrompt, optimizePromptForDalle } from '@/utils/prompt-generator';
import { TattooRequest } from '@/types/tattoo';

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const body: TattooRequest = await request.json();
    
    // 필수 필드 검증
    if (!body.style || !body.size || !body.location || !body.theme) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 프롬프트 생성
    const prompt = generateTattooPrompt(body);
    const optimizedPrompt = optimizePromptForDalle(prompt);

    // DALL-E 3 API 호출
    const response = await openai.images.generate({
      model: process.env.OPENAI_MODEL || 'dall-e-3',
      prompt: optimizedPrompt,
      n: parseInt(process.env.MAX_IMAGES_PER_REQUEST || '3'),
      size: process.env.OPENAI_IMAGE_SIZE || '1024x1024',
      quality: process.env.OPENAI_IMAGE_QUALITY || 'standard',
    });

    // 응답 데이터 변환
    const images = response.data.map((image, index) => ({
      id: `img_${Date.now()}_${index}`,
      url: image.url || '',
      alt: `타투 디자인 ${index + 1}`,
      size: process.env.OPENAI_IMAGE_SIZE || '1024x1024',
      quality: process.env.OPENAI_IMAGE_QUALITY || 'standard',
    }));

    const result = {
      id: `req_${Date.now()}`,
      prompt: optimizedPrompt,
      images,
      createdAt: new Date(),
      request: body,
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('타투 디자인 생성 오류:', error);
    
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { 
          error: 'OpenAI API 오류가 발생했습니다.',
          details: error.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// GET 요청 처리 (테스트용)
export async function GET() {
  return NextResponse.json({
    message: '타투 디자인 생성 API가 정상적으로 작동하고 있습니다.',
    status: 'active',
    timestamp: new Date().toISOString(),
  });
}
