import { TattooHistory, GeneratedImage } from '@/types/tattoo';

const STORAGE_KEYS = {
  TATTOO_HISTORY: 'tattoo_history',
  FAVORITES: 'tattoo_favorites',
  SETTINGS: 'tattoo_settings'
};

// 로컬 스토리지에서 데이터 가져오기
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

// 로컬 스토리지에 데이터 저장하기
export const saveToStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
};

// 타투 히스토리 저장
export const saveTattooHistory = (history: TattooHistory): void => {
  const existingHistory = getFromStorage<TattooHistory[]>(STORAGE_KEYS.TATTOO_HISTORY, []);
  const updatedHistory = [history, ...existingHistory];
  
  // 최대 50개까지만 저장 (메모리 절약)
  if (updatedHistory.length > 50) {
    updatedHistory.splice(50);
  }
  
  saveToStorage(STORAGE_KEYS.TATTOO_HISTORY, updatedHistory);
};

// 타투 히스토리 가져오기
export const getTattooHistory = (): TattooHistory[] => {
  return getFromStorage<TattooHistory[]>(STORAGE_KEYS.TATTOO_HISTORY, []);
};

// 즐겨찾기 토글
export const toggleFavorite = (historyId: string): void => {
  const history = getTattooHistory();
  const updatedHistory = history.map(item => 
    item.id === historyId 
      ? { ...item, isFavorite: !item.isFavorite }
      : item
  );
  
  saveToStorage(STORAGE_KEYS.TATTOO_HISTORY, updatedHistory);
};

// 즐겨찾기만 가져오기
export const getFavorites = (): TattooHistory[] => {
  const history = getTattooHistory();
  return history.filter(item => item.isFavorite);
};

// 히스토리 삭제
export const deleteTattooHistory = (historyId: string): void => {
  const history = getTattooHistory();
  const updatedHistory = history.filter(item => item.id !== historyId);
  saveToStorage(STORAGE_KEYS.TATTOO_HISTORY, updatedHistory);
};

// 히스토리 메모/태그 업데이트
export const updateTattooHistory = (
  historyId: string, 
  updates: Partial<Pick<TattooHistory, 'memo' | 'tags'>>
): void => {
  const history = getTattooHistory();
  const updatedHistory = history.map(item => 
    item.id === historyId 
      ? { ...item, ...updates }
      : item
  );
  
  saveToStorage(STORAGE_KEYS.TATTOO_HISTORY, updatedHistory);
};

// 히스토리 검색
export const searchTattooHistory = (query: string): TattooHistory[] => {
  const history = getTattooHistory();
  if (!query.trim()) return history;
  
  const searchTerm = query.toLowerCase();
  return history.filter(item => 
    item.request.style.toLowerCase().includes(searchTerm) ||
    item.request.theme.toLowerCase().includes(searchTerm) ||
    item.request.description.toLowerCase().includes(searchTerm) ||
    item.memo?.toLowerCase().includes(searchTerm) ||
    item.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

// 히스토리 필터링
export const filterTattooHistory = (filters: {
  style?: string;
  theme?: string;
  favoritesOnly?: boolean;
}): TattooHistory[] => {
  let history = getTattooHistory();
  
  if (filters.favoritesOnly) {
    history = history.filter(item => item.isFavorite);
  }
  
  if (filters.style) {
    history = history.filter(item => item.request.style === filters.style);
  }
  
  if (filters.theme) {
    history = history.filter(item => item.request.theme === filters.theme);
  }
  
  return history;
};
