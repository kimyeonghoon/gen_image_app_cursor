'use client';

import { useState } from 'react';
import { 
  TATTOO_STYLES, 
  TATTOO_SIZES, 
  TATTOO_LOCATIONS, 
  TATTOO_THEMES, 
  MOOD_OPTIONS, 
  COLOR_PREFERENCES 
} from '@/lib/tattoo-data';
import { TattooRequest } from '@/types/tattoo';

export default function Home() {
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

  const handleInputChange = (field: keyof TattooRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
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
      setGeneratedImages(result.images.map((img: any) => img.url));
      setError(null); // 성공 시 에러 메시지 제거
      
    } catch (error) {
      console.error('타투 디자인 생성 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      setGeneratedImages([]); // 에러 시 이미지 초기화
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.style && formData.size && formData.location && formData.theme;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎨 타투 디자인 생성기
          </h1>
          <p className="text-lg text-gray-600">
            AI가 당신만의 맞춤형 타투 디자인을 생성합니다
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* 입력 폼 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              원하는 타투 디자인을 설명해주세요
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 스타일 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  타투 스타일 *
                </label>
                <select
                  value={formData.style}
                  onChange={(e) => handleInputChange('style', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">스타일을 선택하세요</option>
                  {TATTOO_STYLES.map((style) => (
                    <option key={style.id} value={style.name}>
                      {style.name} - {style.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* 크기와 위치 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    크기 *
                  </label>
                  <select
                    value={formData.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">크기를 선택하세요</option>
                    {TATTOO_SIZES.map((size) => (
                      <option key={size.id} value={size.name}>
                        {size.name} ({size.dimensions})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    위치 *
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">위치를 선택하세요</option>
                    {TATTOO_LOCATIONS.map((location) => (
                      <option key={location.id} value={location.name}>
                        {location.name} - {location.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 테마 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  테마 *
                </label>
                <select
                  value={formData.theme}
                  onChange={(e) => handleInputChange('theme', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">테마를 선택하세요</option>
                  {TATTOO_THEMES.map((theme) => (
                    <option key={theme.id} value={theme.name}>
                      {theme.name} - {theme.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* 색상 선호도와 분위기 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    색상 선호도
                  </label>
                  <select
                    value={formData.colorPreference}
                    onChange={(e) => handleInputChange('colorPreference', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {COLOR_PREFERENCES.map((color) => (
                      <option key={color.id} value={color.id}>
                        {color.name} - {color.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    분위기
                  </label>
                  <select
                    value={formData.mood}
                    onChange={(e) => handleInputChange('mood', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">분위기를 선택하세요</option>
                    {MOOD_OPTIONS.map((mood) => (
                      <option key={mood} value={mood}>
                        {mood}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 추가 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  추가 설명
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="원하는 디자인의 세부사항이나 특별한 요구사항을 자유롭게 작성해주세요..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* 제출 버튼 */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                    isFormValid && !isLoading
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      AI가 디자인을 생성하고 있습니다...
                    </div>
                  ) : (
                    '🎨 타투 디자인 생성하기'
                  )}
                </button>
              </div>
            </form>
            
            {/* 에러 메시지 표시 */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      오류가 발생했습니다
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 생성된 이미지 결과 */}
          {generatedImages.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                🎯 생성된 타투 디자인
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {generatedImages.map((imageUrl, index) => (
                  <div key={index} className="text-center">
                    <div className="relative group cursor-pointer">
                      <img
                        src={imageUrl}
                        alt={`타투 디자인 ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-shadow duration-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <button className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-gray-100">
                          🔍 확대보기
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                        💾 다운로드
                      </button>
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        🔄 다시 생성
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
