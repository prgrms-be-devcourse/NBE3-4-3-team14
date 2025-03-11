/**
 * 검색 결과 및 관련 상태/함수들을 포함하는 인터페이스
 */
export interface SearchResult<T> {
  items: T[];                             // 검색 결과 아이템 배열
  isLoading: boolean;                     // 로딩 상태
  currentPage: number;                    // 현재 페이지
  totalPages: number;                     // 전체 페이지 수
  sortBy: string;                         // 현재 정렬 방식
  goToNextPage: () => void;               // 다음 페이지로 이동
  goToPrevPage: () => void;               // 이전 페이지로 이동
  handleSortChange: (value: string) => void; // 정렬 방식 변경
  hasMore: boolean;                       // 추가 데이터 존재 여부
  loadMore: () => void;                   // 추가 데이터 로드 함수
} 