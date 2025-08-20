// 환경별 설정 관리

export interface AppConfig {
  // OpenAI 설정
  openai: {
    apiKey: string;
    model: string;
    imageSize: string;
    imageQuality: string;
    maxImagesPerRequest: number;
    maxRequestsPerHour: number;
  };
  
  // 애플리케이션 설정
  app: {
    name: string;
    description: string;
    version: string;
    environment: 'development' | 'production' | 'test';
  };
  
  // API 설정
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
  
  // 기능 플래그
  features: {
    enableAnalytics: boolean;
    enableErrorReporting: boolean;
    enablePerformanceMonitoring: boolean;
    enableRateLimiting: boolean;
  };
}

// 환경변수에서 설정값 가져오기
const getEnvVar = (key: string, defaultValue: string): string => {
  return process.env[key] || defaultValue;
};

const getEnvVarNumber = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  return value ? parseInt(value, 10) : defaultValue;
};

const getEnvVarBoolean = (key: string, defaultValue: boolean): boolean => {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
};

// 환경별 설정
export const config: AppConfig = {
  openai: {
    apiKey: getEnvVar('OPENAI_API_KEY', ''),
    model: getEnvVar('OPENAI_MODEL', 'dall-e-3'),
    imageSize: getEnvVar('OPENAI_IMAGE_SIZE', '1024x1024'),
    imageQuality: getEnvVar('OPENAI_IMAGE_QUALITY', 'standard'),
    maxImagesPerRequest: getEnvVarNumber('MAX_IMAGES_PER_REQUEST', 3),
    maxRequestsPerHour: getEnvVarNumber('MAX_REQUESTS_PER_HOUR', 10),
  },
  
  app: {
    name: getEnvVar('NEXT_PUBLIC_APP_NAME', 'AI 타투 디자인 생성기'),
    description: getEnvVar('NEXT_PUBLIC_APP_DESCRIPTION', 'AI 기반 맞춤 타투 디자인 생성 플랫폼'),
    version: getEnvVar('NEXT_PUBLIC_APP_VERSION', '1.0.0'),
    environment: (getEnvVar('NODE_ENV', 'development') as 'development' | 'production' | 'test'),
  },
  
  api: {
    baseUrl: getEnvVar('NEXT_PUBLIC_API_BASE_URL', ''),
    timeout: getEnvVarNumber('API_TIMEOUT', 30000),
    retryAttempts: getEnvVarNumber('API_RETRY_ATTEMPTS', 3),
  },
  
  features: {
    enableAnalytics: getEnvVarBoolean('NEXT_PUBLIC_ENABLE_ANALYTICS', false),
    enableErrorReporting: getEnvVarBoolean('NEXT_PUBLIC_ENABLE_ERROR_REPORTING', false),
    enablePerformanceMonitoring: getEnvVarBoolean('NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING', false),
    enableRateLimiting: getEnvVarBoolean('ENABLE_RATE_LIMITING', true),
  },
};

// 환경별 설정 검증
export const validateConfig = (): string[] => {
  const errors: string[] = [];
  
  if (!config.openai.apiKey) {
    errors.push('OPENAI_API_KEY가 설정되지 않았습니다.');
  }
  
  if (config.openai.maxImagesPerRequest < 1 || config.openai.maxImagesPerRequest > 5) {
    errors.push('MAX_IMAGES_PER_REQUEST는 1-5 사이의 값이어야 합니다.');
  }
  
  if (config.openai.maxRequestsPerHour < 1) {
    errors.push('MAX_REQUESTS_PER_HOUR는 1 이상의 값이어야 합니다.');
  }
  
  // 배포 환경에서 이미지 도메인 허용 확인
  if (config.app.environment === 'production') {
    console.log('🔧 Production 환경: 이미지 도메인 설정 확인 필요');
  }
  
  return errors;
};

// 개발 환경에서만 설정 로깅
if (config.app.environment === 'development') {
  console.log('🔧 App Configuration:', {
    environment: config.app.environment,
    appName: config.app.name,
    openaiModel: config.openai.model,
    features: config.features,
  });
  
  const configErrors = validateConfig();
  if (configErrors.length > 0) {
    console.warn('⚠️ Configuration Warnings:', configErrors);
  }
}

export default config;
