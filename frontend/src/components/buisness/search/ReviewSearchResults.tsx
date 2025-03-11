'use client';

import { useEffect } from 'react';
import SearchResultComponent from '@/components/buisness/search/SearchResultComponent';
import { useSearchService } from '@/lib/service/search/useSearchService';
import InfiniteScroll from '@/components/common/Search/InfiniteScroll';

interface SearchResultsProps {
  searchQuery: string;
  searchType: 'all' | 'review' | 'webtoon' | 'user';
  limit?: number;
  showTitle?: boolean;
  initialSort?: string;
  onResultsStatus?: (hasResults: boolean) => void;
}

/**
 * 통합 검색 결과 컴포넌트
 * 모든 검색 타입(전체, 리뷰, 웹툰, 사용자)에 대한 결과를 표시할 수 있는 공통 컴포넌트입니다.
 */
const SearchResults: React.FC<SearchResultsProps> = ({
  searchQuery,
  searchType,
  limit,
  showTitle = true,
  initialSort = 'recommend',
  onResultsStatus,
}) => {
  // 검색 서비스 훅 사용
  const {
    searchResults,
    isLoading,
    currentPage,
    totalPages,
    sortBy,
    goToNextPage,
    goToPrevPage,
    handleSortChange,
    hasMore,
    loadMore,
  } = useSearchService(searchQuery, searchType, initialSort, limit);

  // 검색 결과 상태를 부모 컴포넌트에 전달
  useEffect(() => {
    if (onResultsStatus) {
      onResultsStatus(searchResults.length > 0);
    }
  }, [searchResults, onResultsStatus]);

  // 검색어가 없는 경우 처리
  if (!searchQuery.trim()) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">검색어를 입력해주세요.</p>
      </div>
    );
  }

  // 검색 타입에 따른 제목과 빈 결과 메시지 설정
  const getTitleAndEmptyMessage = () => {
    switch (searchType) {
      case 'all':
        return {
          title: '전체 검색 결과',
          emptyMessage: `"${searchQuery}"에 대한 검색 결과가 없습니다.`,
        };
      case 'review':
        return {
          title: '리뷰 검색 결과',
          emptyMessage: `"${searchQuery}"에 대한 리뷰 검색 결과가 없습니다.`,
        };
      case 'webtoon':
        return {
          title: '웹툰의 리뷰 검색 결과',
          emptyMessage: '해당 웹툰에 대한 리뷰를 찾을 수 없습니다.',
        };
      case 'user':
        return {
          title: '사용자의 리뷰 검색 결과',
          emptyMessage: '해당 사용자의 리뷰를 찾을 수 없습니다.',
        };
      default:
        return {
          title: '검색 결과',
          emptyMessage: '검색 결과가 없습니다.',
        };
    }
  };

  const { title, emptyMessage } = getTitleAndEmptyMessage();

  return (
    <div className="w-full">
      <InfiniteScroll
        loadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
      >
        <SearchResultComponent
          title={title}
          showTitle={showTitle}
          resultType="review"
          reviewItems={searchResults}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          onPrevPage={goToPrevPage}
          onNextPage={goToNextPage}
          hasMore={hasMore}
          loadMore={loadMore}
          emptyMessage={searchQuery ? `"${searchQuery}"에 대한 리뷰를 찾을 수 없습니다.` : '검색어를 입력해주세요.'}
          useInfiniteScroll={true}
        />
      </InfiniteScroll>
    </div>
  );
};

export default SearchResults; 