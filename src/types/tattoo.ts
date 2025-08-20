// 타투 디자인 관련 타입 정의

export interface TattooStyle {
  id: string;
  name: string;
  description: string;
  category: 'traditional' | 'modern' | 'artistic';
}

export interface TattooSize {
  id: string;
  name: string;
  dimensions: string;
  category: 'small' | 'medium' | 'large';
}

export interface TattooLocation {
  id: string;
  name: string;
  description: string;
  bodyPart: string;
}

export interface TattooTheme {
  id: string;
  name: string;
  description: string;
  examples: string[];
}

export interface TattooRequest {
  style: string;
  size: string;
  location: string;
  theme: string;
  description: string;
  colorPreference: string;
  mood: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  alt: string;
  size: string;
  quality: string;
  createdAt: Date;
  isFavorite?: boolean;
  memo?: string;
  tags?: string[];
}

export interface TattooHistory {
  id: string;
  prompt: string;
  images: GeneratedImage[];
  request: TattooRequest;
  createdAt: Date;
  isFavorite?: boolean;
  memo?: string;
  tags?: string[];
}

export interface GalleryFilters {
  style?: string;
  theme?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  favoritesOnly?: boolean;
  searchQuery?: string;
}

export interface TattooResponse {
  id: string;
  prompt: string;
  images: TattooImage[];
  createdAt: Date;
  request: TattooRequest;
}

export interface TattooImage {
  id: string;
  url: string;
  alt: string;
  size: string;
  quality: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}
