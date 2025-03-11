import { useEffect, useCallback } from 'react';
import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';
import { SearchResult } from '@/lib/types/search/SearchResult';
import { useSearchCore } from './useSearchCore';

/**
 * 검색 로직을 관리하는 커스텀 훅 (노출용 API)
 * @param searchQuery 검색어
 * @param searchType 검색 유형 (review, user, webtoon, all 등)
 * @param initialSort 초기 정렬 방식 (기본값: recommend)
 * @param limit 페이지당 결과 수 (기본값: 10)
 */
export function useSearchLogic(
  searchQuery: string, 
  searchType: string, 
  initialSort = 'recommend',
  limit?: number
): SearchResult<ReviewItemResponseDto> {
  // 핵심 검색 로직에서 상태와 함수 가져오기
  const {
    items,
    currentPage,
    setCurrentPage,
    totalPages,
    isLoading,
    sortBy,
    setSortBy,
    hasMore,
    fetchResults,
    lastSearchKey,
    currentSearchKey,
    setItems
  } = useSearchCore(searchQuery, searchType, initialSort, limit || 10);

  /**
   * 검색어/정렬 방식 변경 시 데이터 로드
   */
  useEffect(() => {
    if (lastSearchKey.current !== currentSearchKey) {
      // 초기 상태로 리셋
      setCurrentPage(0);
      
      if (searchQuery) {
        fetchResults(0, false);
      } else {
        setItems([]);
      }
    }
  }, [searchQuery, sortBy, searchType, currentSearchKey, fetchResults, setCurrentPage, setItems]);

  /**
   * 추가 결과 로드 (더 보기)
   */
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    const nextPage = currentPage + 1;
    if (nextPage < totalPages) {
      fetchResults(nextPage, true);
    }
  }, [currentPage, totalPages, isLoading, hasMore, fetchResults]);

  /**
   * 다음 페이지로 이동
   */
  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages, setCurrentPage]);

  /**
   * 이전 페이지로 이동
   */
  const goToPrevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage, setCurrentPage]);

  /**
   * 정렬 방식 변경
   */
  const handleSortChange = useCallback((value: string) => {
    if (sortBy === value) return;
    
    // 정렬 상태 업데이트
    setSortBy(value);
    
    // 검색 상태 초기화
    setItems([]);
    lastSearchKey.current = '';
    setCurrentPage(0);
    
    // 새 검색 수행
    fetchResults(0, false);
  }, [sortBy, setSortBy, setItems, setCurrentPage, fetchResults]);

  // 결과 반환
  return {
    items,
    isLoading,
    currentPage,
    totalPages,
    sortBy,
    goToNextPage,
    goToPrevPage,
    handleSortChange,
    hasMore,
    loadMore
  };
} 