'use client';

import { PageDto } from '@/lib/types/common/PageDto';
import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';
import { Button } from '@/components/ui/button';
import WideReviewList from '@/components/common/WideReviewList/WideReviewList';

interface WideReviewBoxProps {
  pageData: PageDto<ReviewItemResponseDto>;
  onPageChange: (page: number) => void;
}

const WideReviewBox: React.FC<WideReviewBoxProps> = ({
  pageData,
  onPageChange,
}) => {
  const { content: reviews, currentPage, totalPages } = pageData;

  return (
    <div className="p-4 max-w-9xl mx-auto max-h-[500px] overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">추천 리뷰</h1>
      {reviews.length > 0 ? (
        <>
          <WideReviewList reviews={reviews} />
          <div className="flex justify-between mt-4">
            <Button
              onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
              disabled={currentPage === 0}
            >
              이전
            </Button>
            <span className="text-sm">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              onClick={() =>
                onPageChange(Math.min(currentPage + 1, totalPages - 1))
              }
              disabled={currentPage >= totalPages - 1}
            >
              다음
            </Button>
          </div>
        </>
      ) : (
        <p>추천 리뷰가 없습니다.</p>
      )}
    </div>
  );
};

export default WideReviewBox;
