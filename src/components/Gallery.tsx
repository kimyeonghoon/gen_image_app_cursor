'use client';

import { useState, useEffect } from 'react';
import { TattooHistory, GalleryFilters } from '@/types/tattoo';
import { 
  getTattooHistory, 
  toggleFavorite, 
  deleteTattooHistory,
  updateTattooHistory,
  searchTattooHistory,
  filterTattooHistory
} from '@/utils/storage';

interface GalleryProps {
  onImageSelect?: (image: { id: string; url: string; alt: string }) => void;
}

export default function Gallery({ onImageSelect }: GalleryProps) {
  const [history, setHistory] = useState<TattooHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<TattooHistory[]>([]);
  const [filters, setFilters] = useState<GalleryFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHistory, setSelectedHistory] = useState<TattooHistory | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // 히스토리 로드
  useEffect(() => {
    const loadHistory = () => {
      const savedHistory = getTattooHistory();
      setHistory(savedHistory);
      setFilteredHistory(savedHistory);
    };

    loadHistory();
    // 스토리지 변경 감지
    window.addEventListener('storage', loadHistory);
    return () => window.removeEventListener('storage', loadHistory);
  }, []);

  // 필터 및 검색 적용
  useEffect(() => {
    let filtered = history;

    // 검색 쿼리 적용
    if (searchQuery.trim()) {
      filtered = searchTattooHistory(searchQuery);
    }

    // 필터 적용
    if (Object.keys(filters).length > 0) {
      filtered = filterTattooHistory(filters);
    }

    setFilteredHistory(filtered);
  }, [history, searchQuery, filters]);

  // 즐겨찾기 토글
  const handleToggleFavorite = (historyId: string) => {
    toggleFavorite(historyId);
    setHistory(getTattooHistory());
  };

  // 히스토리 삭제
  const handleDeleteHistory = (historyId: string) => {
    if (confirm('정말로 이 디자인을 삭제하시겠습니까?')) {
      deleteTattooHistory(historyId);
      setHistory(getTattooHistory());
      if (selectedHistory?.id === historyId) {
        setSelectedHistory(null);
      }
    }
  };

  // 메모/태그 업데이트
  const handleUpdateHistory = (historyId: string, updates: { memo?: string; tags?: string[] }) => {
    updateTattooHistory(historyId, updates);
    setHistory(getTattooHistory());
    setIsEditMode(false);
  };

  // 태그 입력 처리
  const handleTagsInput = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    return tags;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <span className="mr-2 text-purple-500">●</span> 내 타투 디자인 갤러리
      </h2>

      {/* 검색 및 필터 */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="디자인 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <select
            value={filters.style || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, style: e.target.value || undefined }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">모든 스타일</option>
            <option value="라인 아트">라인 아트</option>
            <option value="미니멀">미니멀</option>
            <option value="클래식">클래식</option>
            <option value="모던">모던</option>
            <option value="트리뷰널">트리뷰널</option>
          </select>
          <select
            value={filters.theme || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, theme: e.target.value || undefined }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">모든 테마</option>
            <option value="자연">자연</option>
            <option value="동물">동물</option>
            <option value="꽃">꽃</option>
            <option value="기하학적">기하학적</option>
            <option value="문화적">문화적</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.favoritesOnly || false}
              onChange={(e) => setFilters(prev => ({ ...prev, favoritesOnly: e.target.checked || undefined }))}
              className="mr-2"
            />
            즐겨찾기만 보기
          </label>
          <span className="text-sm text-gray-600">
            총 {filteredHistory.length}개의 디자인
          </span>
        </div>
      </div>

      {/* 갤러리 그리드 */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">아직 생성된 디자인이 없습니다</h3>
          <p className="text-gray-500">타투 디자인을 생성해보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
              {/* 이미지 그리드 */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {item.images.slice(0, 4).map((image, index) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => onImageSelect?.(image)}
                    />
                    {index === 3 && item.images.length > 4 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center">
                        <span className="text-white text-sm font-bold">+{item.images.length - 4}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 디자인 정보 */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{item.request.style}</span>
                  <button
                    onClick={() => handleToggleFavorite(item.id)}
                    className={`text-xl ${item.isFavorite ? 'text-red-500' : 'text-gray-400'} hover:scale-110 transition-transform`}
                  >
                    {item.isFavorite ? '❤️' : '🤍'}
                  </button>
                </div>
                <p className="text-xs text-gray-600">{item.request.theme} • {item.request.location}</p>
                {item.memo && (
                  <p className="text-sm text-gray-700 bg-white p-2 rounded border">{item.memo}</p>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedHistory(item)}
                  className="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  상세보기
                </button>
                <button
                  onClick={() => setIsEditMode(true)}
                  className="bg-gray-500 text-white py-2 px-3 rounded text-sm hover:bg-gray-600 transition-colors"
                >
                  편집
                </button>
                <button
                  onClick={() => handleDeleteHistory(item.id)}
                  className="bg-red-500 text-white py-2 px-3 rounded text-sm hover:bg-red-600 transition-colors"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 상세보기 모달 */}
      {selectedHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">디자인 상세보기</h3>
                <button
                  onClick={() => setSelectedHistory(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {selectedHistory.images.map((image) => (
                  <div key={image.id} className="text-center">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-48 object-cover rounded-lg shadow-md mb-2"
                    />
                    <button
                      onClick={() => {
                        window.open(image.url, '_blank');
                      }}
                      className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      새창에서 보기
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">요청 정보</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-medium">스타일:</span> {selectedHistory.request.style}</div>
                    <div><span className="font-medium">크기:</span> {selectedHistory.request.size}</div>
                    <div><span className="font-medium">위치:</span> {selectedHistory.request.location}</div>
                    <div><span className="font-medium">테마:</span> {selectedHistory.request.theme}</div>
                    <div><span className="font-medium">색상:</span> {selectedHistory.request.colorPreference}</div>
                    <div><span className="font-medium">분위기:</span> {selectedHistory.request.mood}</div>
                  </div>
                </div>
                
                {selectedHistory.request.description && (
                  <div>
                    <h4 className="font-semibold mb-2">추가 설명</h4>
                    <p className="text-gray-700">{selectedHistory.request.description}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">프롬프트</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedHistory.prompt}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 편집 모달 */}
      {isEditMode && selectedHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">디자인 편집</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    defaultValue={selectedHistory.memo || ''}
                    placeholder="이 디자인에 대한 메모를 입력하세요..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">태그 (쉼표로 구분)</label>
                  <input
                    type="text"
                    defaultValue={selectedHistory.tags?.join(', ') || ''}
                    placeholder="예: 미니멀, 깔끔, 팔"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    const memoInput = document.querySelector('textarea') as HTMLTextAreaElement;
                    const tagsInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                    
                    handleUpdateHistory(selectedHistory.id, {
                      memo: memoInput.value,
                      tags: handleTagsInput(tagsInput.value)
                    });
                  }}
                  className="flex-1 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  저장
                </button>
                <button
                  onClick={() => setIsEditMode(false)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
