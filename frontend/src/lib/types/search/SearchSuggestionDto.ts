/**
 * 검색어 자동완성 응답 DTO 인터페이스
 * 백엔드 DTO와 일치하도록 업데이트됨
 */
export interface SearchSuggestionDto {
  // 자동완성 목록
  suggestions: string[];
  // 검색 URL(정렬 방식 정보 포함)
  searchUrl: string;
}

/**
 * 자동완성 항목 하나에 대한 상세 정보를 담는 DTO 인터페이스
 */
export interface SuggestionItemDto {
  // 자동완성 텍스트
  text: string;
  // 자동완성 타입("webtoonName", "nickname" 등)
  type?: string;
  // 검색 URL(정렬 방식 포함 가능)
  searchUrl: string;
} 