import { TattooRequest } from '@/types/tattoo';

/**
 * 타투 디자인 요청을 기반으로 DALL-E 3 프롬프트를 생성합니다.
 */
export function generateTattooPrompt(request: TattooRequest): string {
  const { style, location, theme, description, colorPreference, mood } = request;
  
  // 완전히 일반적인 예술 디자인으로 프롬프트 생성
  let prompt = `Create a beautiful, detailed artistic design with the following characteristics:\n\n`;
  
  // 스타일을 일반적인 예술 용어로 변환
  const styleMap: { [key: string]: string } = {
    '라인 아트': 'clean line drawing style',
    '추상': 'abstract geometric style',
    '고전': 'classical artistic style',
    '미니멀리즘': 'minimalist style',
    '워터칼라': 'watercolor painting style',
    '트라이벌': 'tribal pattern style'
  };
  
  prompt += `Style: ${styleMap[style] || style}\n`;
  
  // 크기 정보는 제거 (OpenAI에서 불필요)
  // prompt += `Size: ${size}\n`;
  
  // 위치 정보를 일반적인 용어로 변환
  const locationMap: { [key: string]: string } = {
    '팔': 'arm area',
    '다리': 'leg area',
    '등': 'back area',
    '손목': 'wrist area',
    '발목': 'ankle area',
    '가슴': 'chest area'
  };
  
  prompt += `Area: ${locationMap[location] || location}\n`;
  
  // 테마를 일반적인 예술 주제로 변환
  const themeMap: { [key: string]: string } = {
    '자연': 'nature elements',
    '문양': 'geometric patterns',
    '문화': 'cultural symbols',
    '개인적': 'personal symbols',
    '예술적': 'artistic elements'
  };
  
  prompt += `Theme: ${themeMap[theme] || theme}\n`;
  
  // 색상 선호도
  if (colorPreference === 'black') {
    prompt += `Color scheme: Monochrome with high contrast\n`;
  } else if (colorPreference === 'color') {
    prompt += `Color scheme: Vibrant and colorful\n`;
  } else {
    prompt += `Color scheme: Mixed monochrome and color\n`;
  }
  
  // 분위기
  if (mood) {
    prompt += `Mood: ${mood}\n`;
  }
  
  // 추가 설명
  if (description) {
    prompt += `Additional details: ${description}\n`;
  }
  
  // 완전히 안전한 요구사항
  prompt += `\nArtistic requirements:\n`;
  prompt += `- High resolution digital art\n`;
  prompt += `- Clean, precise lines\n`;
  prompt += `- Professional artistic quality\n`;
  prompt += `- Visually striking and beautiful\n`;
  prompt += `- Abstract and symbolic elements\n`;
  prompt += `- No text, letters, or words\n`;
  prompt += `- Focus on visual patterns and shapes\n`;
  prompt += `- Suitable for decorative purposes\n`;
  
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
