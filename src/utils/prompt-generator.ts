import { TattooRequest } from '@/types/tattoo';

/**
 * 타투 디자인 요청을 기반으로 DALL-E 3 프롬프트를 생성합니다.
 */
export function generateTattooPrompt(request: TattooRequest): string {
  const { style, size, location, theme, description, colorPreference, mood } = request;
  
  let prompt = `Create a high-quality artistic body art design with the following specifications:\n\n`;
  
  // 스타일
  prompt += `Style: ${style}\n`;
  
  // 크기
  prompt += `Size: ${size}\n`;
  
  // 위치
  prompt += `Body location: ${location}\n`;
  
  // 테마
  prompt += `Theme: ${theme}\n`;
  
  // 색상 선호도
  if (colorPreference === 'black') {
    prompt += `Color: Black and white only, high contrast\n`;
  } else if (colorPreference === 'color') {
    prompt += `Color: Vibrant and colorful\n`;
  } else {
    prompt += `Color: Both black and color elements\n`;
  }
  
  // 분위기
  if (mood) {
    prompt += `Mood: ${mood}\n`;
  }
  
  // 추가 설명
  if (description) {
    prompt += `Additional details: ${description}\n`;
  }
  
  // 공통 요구사항 (안전한 용어 사용)
  prompt += `\nRequirements:\n`;
  prompt += `- High resolution and detailed\n`;
  prompt += `- Clean lines and clear design\n`;
  prompt += `- Professional artistic quality\n`;
  prompt += `- Artistic and visually appealing\n`;
  prompt += `- Suitable for body art application\n`;
  prompt += `- Abstract and symbolic design\n`;
  prompt += `- No text or letters\n`;
  prompt += `- Focus on visual elements and patterns\n`;
  
  return prompt;
}

/**
 * 프롬프트를 DALL-E 3 API에 최적화된 형태로 변환합니다.
 */
export function optimizePromptForDalle(prompt: string): string {
  // 프롬프트 길이 제한 (DALL-E 3는 4000자 제한)
  const maxLength = 4000;
  
  if (prompt.length <= maxLength) {
    return prompt;
  }
  
  // 중요 정보를 우선적으로 유지하면서 길이 조정
  const essentialParts = prompt.split('\n').slice(0, 10);
  return essentialParts.join('\n');
}
