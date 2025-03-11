/**
 * 검색 타입과 백엔드 파라미터 매핑
 */
export type SearchTypeMapping = {
  searchTypeParam: string | undefined;
  filterParam: string;
};

/**
 * 검색 타입에 따른 백엔드 파라미터 매핑 함수
 * @param type 검색 유형 (review, user, webtoon, all 등)
 * @returns 백엔드 API 호출에 필요한 파라미터 매핑
 */
export const getSearchParams = (type: string): SearchTypeMapping => {
  switch (type) {
    case 'review':
      return { searchTypeParam: 'reviewContent', filterParam: 'review' };
    case 'user':
    case 'userNickname': // URL 파라미터 호환성 코드
      return { searchTypeParam: 'nickname', filterParam: 'user' };
    case 'webtoon':
    case 'webtoonName': // URL 파라미터 호환성 코드
      return { searchTypeParam: 'webtoonName', filterParam: 'webtoon' };
    case 'all':
    default:
      return { searchTypeParam: undefined, filterParam: 'all' };
  }
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
