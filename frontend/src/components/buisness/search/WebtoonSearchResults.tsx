'use client';

import WebtoonList from '@/components/common/WebtoonList/WebtoonList';
import { useWebtoonSearchService } from '@/lib/service/search/useWebtoonSearchService';
import InfiniteScroll from '@/components/common/Search/InfiniteScroll';
import { useEffect } from 'react';

interface WebtoonSearchResultsProps {
  searchQuery: string;
  limit?: number;
  showTitle?: boolean;
  onResultsFound?: (found: boolean) => void;
}

/**
 * 웹툰 검색 결과를 표시하는 컴포넌트
 * 검색 페이지 우측에 배치하여 웹툰 검색 결과를 보여줍니다.
 */
const WebtoonSearchResults: React.FC<WebtoonSearchResultsProps> = ({
  searchQuery,
  limit,
  showTitle = true,
  onResultsFound
}) => {
  // 웹툰 검색 서비스 훅 사용
  const {
    webtoons,
    isLoading,
    currentPage,
    totalPages,
    hasMore,
    loadMore,
    loadError
  } = useWebtoonSearchService(searchQuery, limit);

  // 결과 상태를 부모 컴포넌트에 알림
  useEffect(() => {
    if (onResultsFound) {
      onResultsFound(webtoons.length > 0);
    }
  }, [webtoons, onResultsFound]);

  // 이미지 에러 핸들링 함수
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = '/placeholder-image.png'; // 에러 발생 시 기본 이미지로 대체
  };

  // 디버그 정보 (개발 환경에서만 표시)
  const debugInfo = false && process.env.NODE_ENV === 'development' && (
    <div className="bg-gray-100 p-2 text-xs text-gray-600 rounded mb-2">
      <p>검색어: {searchQuery}</p>
      <p>결과 수: {webtoons.length}</p>
      <p>로딩 중: {isLoading ? 'Yes' : 'No'}</p>
      <p>오류: {loadError || 'None'}</p>
    </div>
  );

  return (
    <div className="w-full">
      {showTitle && (
        <h2 className="text-xl font-bold mb-4">웹툰 검색 결과</h2>
      )}
      
      {debugInfo}
      
      {loadError && !isLoading && (
        <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">
          {loadError}
        </div>
      )}

      {webtoons.length > 0 ? (
        <InfiniteScroll
          loadMore={loadMore}
          hasMore={hasMore}
          isLoading={isLoading}
        >
          <WebtoonList
            webtoons={webtoons}
          />
        </InfiniteScroll>
      ) : (
        <div className="flex flex-col items-center justify-center py-6">
          <p className="text-gray-500 my-2 text-center">
          </p>
        </div>
      )}
    </div>
  );
};

export default WebtoonSearchResults; 