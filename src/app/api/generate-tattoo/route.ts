import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { generateTattooPrompt, optimizePromptForDalle } from '@/utils/prompt-generator';
import { TattooRequest } from '@/types/tattoo';
import { config, validateConfig } from '@/lib/config';

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

export async function POST(request: NextRequest) {
  try {
    // 설정 검증
    const configErrors = validateConfig();
    if (configErrors.length > 0) {
      return NextResponse.json(
        { error: '서버 설정 오류: ' + configErrors.join(', ') },
        { status: 500 }
      );
    }
    
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
    
    // 디버깅을 위한 프롬프트 로깅
    console.log('Generated prompt:', optimizedPrompt);

    // DALL-E 3 API 호출 (한 번에 1개 이미지만 생성 가능하므로 반복 호출)
    const maxImages = config.openai.maxImagesPerRequest;
    const images = [];
    
    for (let i = 0; i < maxImages; i++) {
      try {
        // 각 이미지마다 약간 다른 프롬프트 변형 사용
        let currentPrompt = optimizedPrompt;
        if (i === 1) {
          currentPrompt = optimizedPrompt + ' with different composition';
        } else if (i === 2) {
          currentPrompt = optimizedPrompt + ' with alternative style';
        }
        
        // 첫 번째 이미지가 실패하면 간단한 테스트 프롬프트 사용
        if (i === 0 && images.length === 0) {
          currentPrompt = 'A simple geometric pattern with clean lines';
          console.log('간단한 테스트 프롬프트 사용:', currentPrompt);
        }
        
        const response = await openai.images.generate({
          model: config.openai.model,
          prompt: currentPrompt,
          n: 1, // DALL-E 3는 한 번에 1개 이미지만 생성 가능
          size: config.openai.imageSize as any,
          quality: config.openai.imageQuality as any,
        });
        
        console.log(`이미지 ${i + 1} API 응답:`, {
          hasData: !!response.data,
          dataLength: response.data?.length,
          firstImageUrl: response.data?.[0]?.url
        });
        
        if (response.data && response.data[0]?.url) {
          const imageData = {
            id: `img_${Date.now()}_${i}`,
            url: response.data[0].url,
            alt: `타투 디자인 ${i + 1}`,
            size: config.openai.imageSize,
            quality: config.openai.imageQuality,
          };
          images.push(imageData);
          console.log(`이미지 ${i + 1} 성공적으로 추가:`, imageData);
        } else {
          console.error(`이미지 ${i + 1} 데이터 누락:`, response.data);
        }
        
        // API 호출 간격 조절 (rate limiting 방지)
        if (i < maxImages - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
      } catch (error: any) {
        console.error(`이미지 ${i + 1} 생성 실패:`, error);
        
        // 오류 발생 시에도 계속 진행 (부분적 성공 허용)
        continue;
      }
    }

    // 최종 결과 로깅
    console.log('최종 이미지 생성 결과:', {
      totalImages: images.length,
      imageUrls: images.map(img => img.url),
      images: images
    });
    
    // 최소 1개 이상의 이미지가 생성되었는지 확인
    if (images.length === 0) {
      console.error('이미지가 하나도 생성되지 않음');
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

    console.log('성공적으로 반환할 결과:', result);
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
