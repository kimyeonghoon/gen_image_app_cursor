'use client';

import { useState, lazy, Suspense } from 'react';
import { TattooRequest, TattooHistory } from '@/types/tattoo';
import { saveTattooHistory } from '@/utils/storage';
import ImageOptimizer from '@/components/ImageOptimizer';
import { useToast } from '@/components/Toast';

// 코드 스플리팅을 위한 lazy loading
const Gallery = lazy(() => import('@/components/Gallery'));

export default function Home() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'create' | 'gallery'>('create');
  
  const [formData, setFormData] = useState<TattooRequest>({
    style: '',
    size: '',
    location: '',
    theme: '',
    description: '',
    colorPreference: 'both',
    mood: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [imageLoadStatus, setImageLoadStatus] = useState<{[key: number]: 'loading' | 'loaded' | 'error'}>({});

  const handleInputChange = (field: keyof TattooRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageLoad = (index: number) => {
    // 실제 이미지가 로드되었는지 확인
    const imgElement = document.querySelector(`img[src="${generatedImages[index]}"]`) as HTMLImageElement;
    if (imgElement && imgElement.naturalWidth > 0 && imgElement.naturalHeight > 0) {
      setImageLoadStatus(prev => ({ ...prev, [index]: 'loaded' }));
    } else {
      setImageLoadStatus(prev => ({ ...prev, [index]: 'error' }));
    }
  };

  const handleImageError = (index: number, error: unknown) => {
    console.error(`이미지 ${index + 1} 로드 실패:`, error);
    setImageLoadStatus(prev => ({ ...prev, [index]: 'error' }));
    
    // 에러 발생 시 토스트 알림
    toast.showToast({
      type: 'warning',
      title: '이미지 로딩 실패',
      message: `이미지 ${index + 1}을 불러올 수 없습니다. 새로고침 후 다시 시도해주세요.`,
      duration: 4000
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    setImageLoadStatus({});

    try {
      const response = await fetch('/api/generate-tattoo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '이미지 생성에 실패했습니다.');
      }

      const result = await response.json();
      
      const imageUrls = result.images.map((img: { url: string }) => img.url);
      setGeneratedImages(imageUrls);
      
      // 이미지 로드 상태를 'loading'으로 초기화
      const initialLoadStatus: {[key: number]: 'loading' | 'loaded' | 'error'} = {};
      imageUrls.forEach((_: string, index: number) => {
        initialLoadStatus[index] = 'loading';
      });
      setImageLoadStatus(initialLoadStatus);
      
      // 히스토리에 저장
      const historyItem: TattooHistory = {
        id: result.id,
        prompt: result.prompt,
        images: result.images.map((img: { id: string; url: string; alt: string; size: string; quality: string }) => ({
          id: img.id,
          url: img.url,
          alt: img.alt,
          size: img.size,
          quality: img.quality,
          createdAt: new Date()
        })),
        request: formData,
        createdAt: new Date()
      };
      saveTattooHistory(historyItem);
      
      // 성공 토스트 표시
      toast.showToast({
        type: 'success',
        title: '타투 디자인 생성 완료!',
        message: `${result.images.length}개의 디자인이 생성되었습니다.`,
        duration: 3000
      });
      
      // 이미지 로드 상태를 즉시 'loaded'로 설정 (테스트용)
      // setTimeout(() => {
      //   const loadedStatus: {[key: number]: 'loading' | 'loaded' | 'error'} = {};
      //   imageUrls.forEach((_: string, index: number) => {
      //     loadedStatus[index] = 'loaded';
      //     });
      //   setImageLoadStatus(loadedStatus);
      //   console.log('이미지 로드 상태를 loaded로 설정했습니다.');
      // }, 1000);
      


    } catch (error) {
      console.error('타투 디자인 생성 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      setGeneratedImages([]);
      setImageLoadStatus({});
      
      // 에러 토스트 표시
      toast.showToast({
        type: 'error',
        title: '생성 실패',
        message: errorMessage,
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI 타투 디자인 생성기
          </h1>
          <p className="text-xl text-gray-600">
            당신만의 독특한 타투 디자인을 AI와 함께 만들어보세요
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              🎨 디자인 생성
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'gallery'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              🖼️ 내 갤러리
            </button>
          </div>
        </div>

        {/* 탭 내용 */}
        {activeTab === 'create' ? (
          <>
            {/* 입력 폼 */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-2 text-purple-500">●</span> 타투 디자인 요구사항
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 스타일 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                스타일 *
              </label>
              <select
                value={formData.style}
                onChange={(e) => handleInputChange('style', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">스타일을 선택하세요</option>
                <option value="라인 아트">라인 아트</option>
                <option value="미니멀">미니멀</option>
                <option value="클래식">클래식</option>
                <option value="모던">모던</option>
                <option value="트리뷰널">트리뷰널</option>
                <option value="워터컬러">워터컬러</option>
                <option value="블랙워크">블랙워크</option>
                <option value="뉴스쿨">뉴스쿨</option>
                <option value="올드스쿨">올드스쿨</option>
                <option value="일러스트레이션">일러스트레이션</option>
              </select>
            </div>

            {/* 크기 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                크기 *
              </label>
              <select
                value={formData.size}
                onChange={(e) => handleInputChange('size', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">크기를 선택하세요</option>
                <option value="소형">소형 (5cm 이하)</option>
                <option value="중형">중형 (5-15cm)</option>
                <option value="대형">대형 (15cm 이상)</option>
              </select>
            </div>

            {/* 위치 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                위치 *
              </label>
              <select
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">위치를 선택하세요</option>
                <option value="팔">팔</option>
                <option value="다리">다리</option>
                <option value="등">등</option>
                <option value="가슴">가슴</option>
                <option value="어깨">어깨</option>
                <option value="목">목</option>
                <option value="손목">손목</option>
                <option value="발목">발목</option>
                <option value="손가락">손가락</option>
                <option value="발가락">발가락</option>
              </select>
            </div>

            {/* 테마 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                테마 *
              </label>
              <select
                value={formData.theme}
                onChange={(e) => handleInputChange('theme', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">테마를 선택하세요</option>
                <option value="자연">자연</option>
                <option value="동물">동물</option>
                <option value="꽃">꽃</option>
                <option value="기하학적">기하학적</option>
                <option value="종교적">종교적</option>
                <option value="문화적">문화적</option>
                <option value="개인적">개인적</option>
                <option value="추상적">추상적</option>
                <option value="판타지">판타지</option>
                <option value="빈티지">빈티지</option>
              </select>
            </div>

            {/* 색상 선호도 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                색상 선호도
              </label>
              <select
                value={formData.colorPreference}
                onChange={(e) => handleInputChange('colorPreference', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">색상을 선택하세요</option>
                <option value="black">흑백</option>
                <option value="color">컬러</option>
                <option value="pastel">파스텔</option>
                <option value="vibrant">선명한 색상</option>
              </select>
            </div>

            {/* 분위기 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                분위기
              </label>
              <select
                value={formData.mood}
                onChange={(e) => handleInputChange('mood', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">분위기를 선택하세요</option>
                <option value="우아한">우아한</option>
                <option value="강렬한">강렬한</option>
                <option value="신비로운">신비로운</option>
                <option value="친근한">친근한</option>
                <option value="드라마틱한">드라마틱한</option>
                <option value="평화로운">평화로운</option>
                <option value="에너지 넘치는">에너지 넘치는</option>
                <option value="차분한">차분한</option>
              </select>
            </div>
          </div>

          {/* 추가 설명 */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              추가 설명
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="원하는 디자인의 구체적인 설명이나 참고 이미지에 대한 설명을 자유롭게 작성해주세요..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* 제출 버튼 */}
          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center mx-auto"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  생성 중...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  타투 디자인 생성하기
                </>
              )}
            </button>
          </div>
        </form>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* 생성된 이미지 결과 */}
        {generatedImages.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-center">
              <span className="mr-2 text-red-500">●</span> 생성된 타투 디자인
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {generatedImages.map((imageUrl, index) => (
                                   <div key={index} className="text-center">
                     <div className="relative group cursor-pointer">
                       {/* 로딩 상태 오버레이 */}
                       {imageLoadStatus[index] === 'loading' && (
                         <div className="absolute inset-0 bg-gray-100 rounded-lg flex flex-col items-center justify-center z-30">
                           <svg className="animate-spin h-8 w-8 text-gray-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           <span className="text-gray-600 text-sm">이미지 로드 중...</span>
                         </div>
                       )}

                       {/* 에러 상태 오버레이 */}
                       {imageLoadStatus[index] === 'error' && (
                         <div className="absolute inset-0 bg-red-50 rounded-lg flex flex-col items-center justify-center text-red-700 z-30">
                           <svg className="h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                           </svg>
                           <span className="text-sm">로드 실패</span>
                         </div>
                       )}

                       {/* 최적화된 이미지 - z-index 명시적 설정 */}
                       <div className="relative z-10">
                         <ImageOptimizer
                           src={imageUrl}
                           alt={`타투 디자인 ${index + 1}`}
                           width={400}
                           height={256}
                           className="w-full h-64 shadow-md group-hover:shadow-xl transition-shadow duration-200"
                           onLoad={() => handleImageLoad(index)}
                           onError={(e) => handleImageError(index, e)}
                         />
                       </div>
                     


                                         {/* 호버 오버레이 - 이미지 가시성 개선 */}
                     <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg flex items-center justify-center pointer-events-none">
                       <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                         <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                         </svg>
                       </div>
                     </div>
                  </div>

                  {/* 버튼들 */}
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => {
                        window.open(imageUrl, '_blank');
                      }}
                      className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      새창에서 보기
                    </button>
                    <button
                      onClick={() => {
                        setGeneratedImages(prev => prev.filter((_, i) => i !== index));
                        setImageLoadStatus(prev => {
                          const newStatus = { ...prev };
                          delete newStatus[index];
                          return newStatus;
                        });
                      }}
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      다시 생성
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
            ) : (
          <Suspense fallback={
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">갤러리 로딩 중...</h3>
                <div className="flex justify-center">
                  <svg className="animate-spin h-8 w-8 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
            </div>
          }>
            <Gallery />
          </Suspense>
        )}
      </div>
    </div>
  );
}
