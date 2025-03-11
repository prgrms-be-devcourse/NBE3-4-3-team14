import { SearchTypeMapping, getSearchParams as apiGetSearchParams } from '@/lib/api/search/utils/searchMappings';

/**
 * 검색 타입에 따른 백엔드 파라미터 매핑 함수
 * @param type 검색 유형 (review, user, webtoon, all 등)
 * @returns 백엔드 API 호출에 필요한 파라미터 매핑
 */
export const getSearchParams = (type: string): SearchTypeMapping => {
  return apiGetSearchParams(type);
};

/**
 * 프론트엔드 정렬 값을 백엔드 API 파라미터에 맞게 변환
 * @param sortBy 프론트엔드 정렬 방식
 * @returns 백엔드 API 호환 정렬 방식
 */
export const convertSortParam = (sortBy: string): string => {
  // recent -> latest 변환, 다른 값은 그대로 사용
  return sortBy === 'recent' ? 'latest' : sortBy;
};
