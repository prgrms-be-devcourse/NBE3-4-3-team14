import { ReviewItemResponseDto } from '../review/ReviewItemResponseDto';

/**
 * 검색 결과 응답 DTO 인터페이스
 * 백엔드 DTO와 일치하도록 업데이트됨
 */
export interface SearchResponseDto {
  // 검색어
  keyword: string;
  // 검색 결과(리뷰 목록)
  results: ReviewItemResponseDto[];
  // 현재 페이지 번호 (0부터 시작) - 프론트엔드에서 페이지네이션을 위해 필요
  currentPage: number;
  // 전체 페이지 수 - 프론트엔드에서 페이지네이션을 위해 필요
  totalPages: number;
  // 전체 결과 수 - 프론트엔드에서 페이지네이션을 위해 필요
  totalElements: number;
} 