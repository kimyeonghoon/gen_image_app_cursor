# 요구사항 명세서
# 맞춤 타투 디자인 생성기 플랫폼 - 기능 명세서

## 개요
사용자 맞춤형 타투 디자인을 OpenAI DALL·E 3 API를 활용하여 생성하는 Next.js 기반 웹 애플리케이션입니다.  
사용자는 스타일, 크기, 위치, 테마, 분위기, 색상 등의 입력값을 바탕으로 고품질 타투 이미지를 빠르게 생성하고, 여러 시안을 비교·선택할 수 있습니다.

---

## 1. 사용자 인터페이스(UI) 및 입력 폼

### 1.1 타투 스타일 선택  
- 옵션: 라인 아트, 추상, 고전, 미니멀리즘, 워터칼라, 트라이벌 등  
- UI: 드롭다운 혹은 버튼 그룹 형태  
- 다중 선택 불가, 단일 선택  

### 1.2 크기 및 위치 입력  
- 크기: 소형, 중형, 대형 (또는 픽셀 단위 자유 입력)  
- 위치: 팔, 다리, 등, 손목 등 주요 부위 선택 옵션 제공  

### 1.3 테마 선택  
- 테마 옵션: 자연, 문양, 동물, 기호, 기타 자유 입력 텍스트  

### 1.4 세부 설명 입력  
- 사용자가 원하는 분위기(예: 차분한, 강렬한), 색상(예: 흑백, 컬러) 및 추가 요구사항 자유 입력 텍스트 필드  

### 1.5 제출 버튼  
- 입력값 검증 및 이미지 생성 요청 트리거

---

## 2. 이미지 생성 및 처리

### 2.1 DALL·E 3 API 연동  
- Next.js 서버에서 OpenAI DALL·E 3 API 호출  
- 사용자 입력값을 기반으로 프롬프트(prompt) 생성 및 전송  
- 고해상도 이미지 생성 요청 (선명도, 디테일 강조)  

### 2.2 이미지 시안 생성  
- 최소 3개 이상의 디자인 시안 생성 요청 및 응답 처리  
- 이미지 로딩 중 스피너 또는 로딩 상태 UI 제공  

---

## 3. 결과 화면 및 선택 기능

### 3.1 디자인 시안 출력  
- 생성된 타투 이미지 3~5개 썸네일 형태로 배열  
- 썸네일 클릭 시 고화질 이미지 확대 보기  

### 3.2 시안 선택 및 다운로드  
- 원하는 디자인 선택 기능  
- 선택한 이미지 원본 다운로드 버튼 제공 (PNG/JPEG 형식)  

---

## 4. 시스템 및 기술 요구사항

### 4.1 프론트엔드  
- Next.js (React 기반)  
- 타입스크립트 권장  
- UI 컴포넌트 라이브러리 사용 가능 (예: Chakra UI, Material UI)  

### 4.2 백엔드  
- Next.js API Routes 또는 별도의 Node.js 서버  
- OpenAI 공식 Node.js SDK 사용 및 API 키 안전관리  

### 4.3 보안 및 퍼포먼스  
- API 키 환경변수로 관리 및 서버 사이드에서만 사용  
- 이미지 생성 제한 및 요금 관리 고려 (사용자별 호출 제한)  
- 입력값 검증으로 잘못된 API 호출 방지  

---

## 5. 기타

### 5.1 반응형 UI 지원  
- 모바일 및 데스크탑 호환  

### 5.2 오류 처리  
- 이미지 생성 실패 시 사용자 친화적 에러 메시지 출력  
- 네트워크 연결 문제 및 API 호출 문제 대비  

---

# 요약

| 주요 기능         | 설명                                  |
|-----------------|-------------------------------------|
| 입력 폼          | 스타일, 크기, 위치, 테마, 세부 설명 입력   |
| 이미지 생성      | DALL·E 3 API 호출, 3개 이상 시안 생성      |
| 시안 출력 및 선택 | 썸네일 표시, 확대, 다운로드, 재요청 가능     |
| 기술 스택 및 보안  | Next.js, Node.js, API 키 서버 관리, 반응형 UI |

---

## 환경변수 설정

프로젝트를 실행하기 전에 다음 환경변수를 설정해야 합니다:

1. 프로젝트 루트에 `.env.local` 파일을 생성하세요
2. 다음 내용을 추가하세요:

```bash
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Application Configuration
NEXT_PUBLIC_APP_NAME="타투 디자인 생성기"
NEXT_PUBLIC_APP_DESCRIPTION="AI 기반 맞춤 타투 디자인 생성 플랫폼"

# API Configuration
OPENAI_MODEL="dall-e-3"
OPENAI_IMAGE_SIZE="1024x1024"
OPENAI_IMAGE_QUALITY="standard"

# Rate Limiting
MAX_REQUESTS_PER_HOUR=10
MAX_IMAGES_PER_REQUEST=3
```

**주의**: `.env.local` 파일은 Git에 커밋하지 마세요. API 키가 노출될 수 있습니다.

**DALL-E 3 API 제한사항**: DALL-E 3는 한 번에 1개 이미지만 생성할 수 있습니다. 여러 이미지를 원할 경우 자동으로 반복 호출하여 처리됩니다.

---

# 🚀 배포 가이드

## 환경 설정

1. **환경변수 파일 생성**
   ```bash
   cp env.example .env.local
   ```

2. **OpenAI API 키 설정**
   `.env.local` 파일에서 `OPENAI_API_KEY`를 실제 API 키로 변경

3. **환경별 설정**
   - 개발: `NODE_ENV=development`
   - 프로덕션: `NODE_ENV=production`

## 빌드 및 배포

### 로컬 테스트
```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버 실행
```

### 배포 전 체크리스트
- [ ] 환경변수 설정 완료
- [ ] OpenAI API 키 유효성 확인
- [ ] 빌드 에러 없음 (`npm run build`)
- [ ] 타입 체크 통과 (`npm run type-check`)
- [ ] 린트 에러 없음 (`npm run lint`)

### 배포 명령어
```bash
npm run deploy:build  # 빌드 및 정리
npm run deploy:start  # 프로덕션 서버 시작
```

## 지원 플랫폼

- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **AWS**: `npm run build && aws s3 sync .next s3://your-bucket`
- **Docker**: `docker build -t tattoo-generator . && docker run -p 3000:3000 tattoo-generator`

---

# 구현 단계 계획

## 1단계: 프로젝트 기반 구조 및 환경 설정 (1-2일) ✅
- [x] Next.js 15.5.0 + TypeScript + Tailwind CSS 설정 완료
- [x] OpenAI API 키 환경변수 설정
- [x] 프로젝트 메타데이터 및 타이틀 수정
- [x] 기본 폴더 구조 정리 (components, lib, types, utils)

## 2단계: 핵심 컴포넌트 및 UI 구조 구현 (2-3일) ✅
- [x] 타투 디자인 입력 폼 컴포넌트 생성
  - 스타일 선택 드롭다운
  - 크기/위치 입력 필드
  - 테마 및 세부 설명 텍스트 영역
- [x] 메인 페이지 레이아웃 재구성
- [x] 반응형 디자인 적용

## 3단계: OpenAI API 연동 및 백엔드 로직 구현 (2-3일) ✅
- [x] Next.js API Routes 생성 (`/api/generate-tattoo`)
- [x] OpenAI DALL·E 3 API 연동
- [x] 프롬프트 생성 로직 구현
- [x] 이미지 생성 요청 및 응답 처리

## 4단계: 이미지 결과 표시 및 사용자 인터랙션 구현 (2-3일) ✅
- [x] 이미지 시안 그리드 레이아웃
- [x] 썸네일 클릭 시 확대 보기 모달
- [x] 이미지 다운로드 기능
- [x] 로딩 상태 및 에러 처리 UI

## 5단계: 최적화 및 배포 준비 (1-2일) ✅
- [x] 성능 최적화 (이미지 최적화, 코드 스플리팅)
- [x] 에러 바운더리 및 사용자 경험 개선
- [x] 환경별 설정 (개발/프로덕션)
- [x] 배포 및 테스트

---