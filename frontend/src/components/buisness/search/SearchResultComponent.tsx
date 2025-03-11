'use client';

import { Button } from '@/components/ui/button';
import { SmallReviewList } from '@/components/common/SmallReviewList/SmallReviewList';
import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';
import { WebtoonDetailDto } from '@/lib/types/webtoon/WebtoonDetailDto';
import WebtoonList from '@/components/common/WebtoonList/WebtoonList';
import SortControl from '@/components/buisness/search/SortControl';

// 검색 결과 타입 정의
type ResultType = 'review' | 'webtoon';

interface SearchResultComponentProps {
  title?: string;
  showTitle?: boolean;
  resultType?: ResultType;
  reviewItems?: ReviewItemResponseDto[];
  webtoonItems?: WebtoonDetailDto[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  sortBy: string;
  onSortChange: (value: string) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  emptyMessage?: string;
  hasMore: boolean;
  loadMore: () => void;
  useInfiniteScroll?: boolean;
}

/**
 * 검색 결과를 표시하는 공통 컴포넌트
 * 리뷰 또는 웹툰 검색 결과를 표시할 수 있습니다.
 */
const SearchResultComponent = ({
  title,
  showTitle = true,
  resultType = 'review',
  reviewItems = [],
  webtoonItems = [],
  isLoading,
  currentPage,
  totalPages,
  sortBy,
  onSortChange,
  onPrevPage,
  onNextPage,
  emptyMessage = '검색 결과가 없습니다.',
  hasMore,
  loadMore,
  useInfiniteScroll = false
}: SearchResultComponentProps) => {
  // 이미지 에러 핸들링 함수
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/placeholder-image.png';  // 에러 발생 시 기본 이미지로 대체
  };

  // 결과가 있는지 확인
  const hasResults = resultType === 'review' 
    ? reviewItems.length > 0 
    : webtoonItems.length > 0;

  // 정렬 변경 핸들러
  const handleSort = (newSortBy: string) => {
    onSortChange(newSortBy);
  };

  // 로딩 컴포넌트
  const loadingIndicator = (
    <div className="flex flex-col items-center py-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-2"></div>
      <p className="text-gray-500 text-sm">로딩 중...</p>
    </div>
  );

  return (
    <div className="max-w-6xl">
      {showTitle && title && (
        <h1 className="text-xl font-bold mb-4">{title}</h1>
      )}
      
      {/* 정렬 옵션 - 리뷰 타입일 때만 표시 */}
      {resultType === 'review' && (
        <SortControl sortBy={sortBy} onSortChange={handleSort} />
      )}
      
      {hasResults ? (
        <>
          {/* 결과 타입에 따라 다른 컴포넌트 렌더링 */}
          {resultType === 'review' ? (
            <SmallReviewList reviews={reviewItems} />
          ) : (
            <WebtoonList webtoons={webtoonItems} />
          )}
          
          {/* 더 보기 버튼 (무한 스크롤이 아닐 때만 표시) */}
          {!useInfiniteScroll && hasMore && (
            <div className="flex justify-center mt-6">
              {isLoading ? (
                loadingIndicator
              ) : (
                <Button 
                  onClick={loadMore} 
                  variant="outline"
                  className="px-6"
                >
                  더 보기 ({currentPage + 1}/{totalPages})
                </Button>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="py-8 text-center">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-2"></div>
              <p className="text-gray-500">검색 중...</p>
            </div>
          ) : (
            <p className="text-gray-500">{emptyMessage}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResultComponent; 