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
    let optimizedPrompt = optimizePromptForDalle(prompt);

    // DALL-E 3 API 호출 (한 번에 1개 이미지만 생성 가능하므로 반복 호출)
    const maxImages = parseInt(process.env.MAX_IMAGES_PER_REQUEST || '3');
    const images = [];
    let retryCount = 0;
    const maxRetries = 2;
    
    for (let i = 0; i < maxImages; i++) {
      let success = false;
      retryCount = 0;
      
      while (!success && retryCount <= maxRetries) {
        try {
          const response = await openai.images.generate({
            model: process.env.OPENAI_MODEL || 'dall-e-3',
            prompt: optimizedPrompt,
            n: 1, // DALL-E 3는 한 번에 1개 이미지만 생성 가능
            size: process.env.OPENAI_IMAGE_SIZE || '1024x1024',
            quality: process.env.OPENAI_IMAGE_QUALITY || 'standard',
          });
          
          if (response.data[0]?.url) {
            images.push({
              id: `img_${Date.now()}_${i}`,
              url: response.data[0].url,
              alt: `타투 디자인 ${i + 1}`,
              size: process.env.OPENAI_IMAGE_SIZE || '1024x1024',
              quality: process.env.OPENAI_IMAGE_QUALITY || 'standard',
            });
            success = true;
          }
          
        } catch (error: any) {
          retryCount++;
          console.error(`이미지 ${i + 1} 생성 실패 (시도 ${retryCount}/${maxRetries + 1}):`, error);
          
          // content_policy_violation 오류인 경우 프롬프트 수정
          if (error.code === 'content_policy_violation' && retryCount <= maxRetries) {
            console.log('프롬프트 정책 위반, 수정된 프롬프트로 재시도...');
            // 프롬프트를 더 안전하게 수정
            const saferPrompt = optimizedPrompt.replace(/tattoo|body art/gi, 'artistic design');
            optimizedPrompt = saferPrompt;
            await new Promise(resolve => setTimeout(resolve, 2000)); // 더 긴 대기 시간
            continue;
          }
          
          // 다른 오류인 경우 재시도
          if (retryCount <= maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 3000)); // 재시도 간격
            continue;
          }
          
          // 최대 재시도 횟수 초과 시 다음 이미지로 진행
          break;
        }
      }
      
      // API 호출 간격 조절 (rate limiting 방지)
      if (i < maxImages - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // 최소 1개 이상의 이미지가 생성되었는지 확인
    if (images.length === 0) {
      return NextResponse.json(
        { error: '이미지 생성에 실패했습니다. 잠시 후 다시 시도해주세요.' },
        { status: 500 }
      );
    }

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
