import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchWebtoons } from '@/lib/api/webtoon/webtoon';
import { WebtoonDetailDto } from '@/lib/types/webtoon/WebtoonDetailDto';

/**
 * 웹툰 검색 관련 로직을 처리하는 서비스 훅
 * @param searchQuery 검색어
 * @param limit 한 페이지당 로드할 웹툰 수 (페이지 크기)
 */
export function useWebtoonSearchService(
  searchQuery: string,
  limit?: number
) {
  const [webtoons, setWebtoons] = useState<WebtoonDetailDto[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // 반복 호출 방지를 위한 참조 변수
  const isInitialLoadComplete = useRef(false);
  const lastSearchQuery = useRef('');
  const currentSearchRef = useRef(searchQuery);

  const resetSearchState = useCallback(() => {
    setCurrentPage(0);
    setWebtoons([]);
    setHasMore(true);
    setLoadError(null);
    isInitialLoadComplete.current = false;
  }, []);

  const loadWebtoons = useCallback(
    async (isLoadingMore = false) => {
      // 이미 로딩 중이거나 검색어가 없는 경우 스킵
      if (!searchQuery.trim() || isLoading) return;

      // 초기 로드가 완료되었고 동일한 검색어에 대해 다시 초기 로드하려는 시도인 경우 스킵
      if (
        !isLoadingMore &&
        isInitialLoadComplete.current &&
        lastSearchQuery.current === searchQuery &&
        webtoons.length > 0
      ) {
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        // 검색어가 변경되었으면 페이지를 0으로 설정
        const pageToLoad = isLoadingMore ? currentPage + 1 : 0;
        // 페이지 크기 설정 (기본값 4)
        const pageSize = limit || 4;

        console.log('웹툰 검색 API 호출 시작:', {
          searchQuery,
          page: pageToLoad,
          size: pageSize
        });

        // API 호출 시 올바른 파라미터 형식으로 변경
        const response = await fetchWebtoons(
          pageToLoad,
          pageSize,
          {
            webtoonName: searchQuery
          }
        );

        console.log('웹툰 검색 API 응답:', response);

        if (response) {
          const newWebtoons = response.content || [];
          
          console.log('받은 웹툰 개수:', newWebtoons.length);
          
          // 웹툰 데이터 유효성 검사
          const validWebtoons = newWebtoons.filter(webtoon => 
            webtoon && 
            webtoon.webtoonId && 
            webtoon.webtoonName
          );
          
          console.log('유효한 웹툰 개수:', validWebtoons.length);
          
          if (isLoadingMore) {
            // 중복 데이터 방지를 위한 검사
            const existingIds = new Set(webtoons.map(item => item.webtoonId));
            const uniqueNewWebtoons = validWebtoons.filter(
              item => !existingIds.has(item.webtoonId)
            );
            
            setWebtoons(prev => [...prev, ...uniqueNewWebtoons]);
          } else {
            // 새로운 검색어의 경우 결과 초기화
            setWebtoons(validWebtoons);
          }

          setCurrentPage(pageToLoad);
          setTotalPages(response.totalPages || 1);
          
          // hasMore 상태 업데이트 - 항상 다음 페이지가 있는지 확인
          setHasMore(response.hasNext || false);

          // 검색 완료 표시
          isInitialLoadComplete.current = true;
          lastSearchQuery.current = searchQuery;
          
          // 결과가 없는 경우 안내 메시지
          if (validWebtoons.length === 0 && !isLoadingMore) {
            setLoadError(`"${searchQuery}" 관련 웹툰을 찾을 수 없습니다.`);
          } else {
            setLoadError(null);
          }
        } else {
          console.error('웹툰 API 응답이 없음');
          setLoadError('검색 결과를 불러오는데 실패했습니다.');
          if (!isLoadingMore) {
            setWebtoons([]);
            setHasMore(false);
          }
        }
      } catch (error) {
        console.error('웹툰 검색 중 오류 발생:', error);
        setLoadError('검색 중 오류가 발생했습니다. 다시 시도해 주세요.');
        if (!isLoadingMore) {
          setWebtoons([]);
          setHasMore(false);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [searchQuery, currentPage, isLoading, limit, webtoons]
  );

  // 검색어 변경 감지
  useEffect(() => {
    if (currentSearchRef.current !== searchQuery) {
      currentSearchRef.current = searchQuery;
      if (searchQuery) {
        resetSearchState();
        loadWebtoons(false);
      } else {
        lastSearchQuery.current = '';
        resetSearchState();
      }
    }
  }, [searchQuery, resetSearchState, loadWebtoons]);

  // 초기 로드
  useEffect(() => {
    // 컴포넌트 마운트 시 검색어가 있으면 검색 실행
    if (searchQuery && !isInitialLoadComplete.current) {
      loadWebtoons(false);
    }
  }, [searchQuery, loadWebtoons]);

  // 더 보기 기능
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadWebtoons(true);
    }
  }, [isLoading, hasMore, loadWebtoons]);

  // 디버깅 출력
  useEffect(() => {
    console.log('현재 웹툰 검색 상태:', {
      searchQuery,
      webtoons: webtoons.length,
      currentPage,
      totalPages,
      hasMore,
      isLoading,
      error: loadError
    });
  }, [searchQuery, webtoons, currentPage, totalPages, hasMore, isLoading, loadError]);

  return {
    webtoons,
    isLoading,
    currentPage,
    totalPages,
    hasMore,
    loadMore,
    loadError
  };
} 