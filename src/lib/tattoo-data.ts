import { TattooStyle, TattooSize, TattooLocation, TattooTheme } from '@/types/tattoo';

export const TATTOO_STYLES: TattooStyle[] = [
  {
    id: 'line-art',
    name: '라인 아트',
    description: '깔끔하고 미니멀한 선으로 구성된 디자인',
    category: 'modern'
  },
  {
    id: 'abstract',
    name: '추상',
    description: '기하학적 형태와 추상적 패턴',
    category: 'artistic'
  },
  {
    id: 'traditional',
    name: '고전',
    description: '전통적인 타투 스타일과 모티프',
    category: 'traditional'
  },
  {
    id: 'minimalism',
    name: '미니멀리즘',
    description: '단순하고 의미있는 최소한의 요소',
    category: 'modern'
  },
  {
    id: 'watercolor',
    name: '워터칼라',
    description: '물감이 번진 듯한 부드러운 색상',
    category: 'artistic'
  },
  {
    id: 'tribal',
    name: '트라이벌',
    description: '원시적이고 강렬한 부족 문화 스타일',
    category: 'traditional'
  }
];

export const TATTOO_SIZES: TattooSize[] = [
  {
    id: 'small',
    name: '소형',
    dimensions: '2-5cm',
    category: 'small'
  },
  {
    id: 'medium',
    name: '중형',
    dimensions: '5-10cm',
    category: 'medium'
  },
  {
    id: 'large',
    name: '대형',
    dimensions: '10cm 이상',
    category: 'large'
  }
];

export const TATTOO_LOCATIONS: TattooLocation[] = [
  {
    id: 'arm',
    name: '팔',
    description: '상완, 전완, 어깨',
    bodyPart: 'upper_limb'
  },
  {
    id: 'leg',
    name: '다리',
    description: '허벅지, 종아리, 발목',
    bodyPart: 'lower_limb'
  },
  {
    id: 'back',
    name: '등',
    description: '어깨뼈, 허리, 척추',
    bodyPart: 'torso'
  },
  {
    id: 'wrist',
    name: '손목',
    description: '손목 안쪽, 바깥쪽',
    bodyPart: 'upper_limb'
  },
  {
    id: 'ankle',
    name: '발목',
    description: '발목 안쪽, 바깥쪽',
    bodyPart: 'lower_limb'
  },
  {
    id: 'chest',
    name: '가슴',
    description: '가슴 중앙, 측면',
    bodyPart: 'torso'
  }
];

export const TATTOO_THEMES: TattooTheme[] = [
  {
    id: 'nature',
    name: '자연',
    description: '동식물, 풍경, 자연 현상',
    examples: ['꽃', '나무', '동물', '바다', '산']
  },
  {
    id: 'symbolic',
    name: '문양',
    description: '기하학적 도형과 상징',
    examples: ['원', '삼각형', '별', '하트', '화살표']
  },
  {
    id: 'cultural',
    name: '문화',
    description: '전통 문화와 민속적 요소',
    examples: ['한복', '전통 문양', '부적', '신화']
  },
  {
    id: 'personal',
    name: '개인적',
    description: '개인적인 의미와 추억',
    examples: ['이름', '날짜', '좌우명', '가족']
  },
  {
    id: 'artistic',
    name: '예술적',
    description: '예술 작품과 창작적 표현',
    examples: ['명화', '조각', '건축', '음악']
  }
];

export const MOOD_OPTIONS = [
  '차분한', '강렬한', '우아한', '강인한', '신비로운',
  '친근한', '고급스러운', '자유로운', '정돈된', '창의적인'
];

export const COLOR_PREFERENCES = [
  { id: 'black', name: '흑백', description: '검은색과 흰색만 사용' },
  { id: 'color', name: '컬러', description: '다양한 색상 사용' },
  { id: 'both', name: '혼합', description: '흑백과 컬러 조합' }
];
