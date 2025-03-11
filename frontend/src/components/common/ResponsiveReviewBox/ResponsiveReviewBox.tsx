'use client';

import { useState, useEffect, useCallback } from 'react';
import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';
import { Button } from '@/components/ui/button';
import { SmallReviewListTwoCols } from '../SmallReviewList/SmallReviewList';
import useReviews from '@/lib/api/review/review';

const TwoColsReviewBox: React.FC<{ webtoonId: number }> = ({ webtoonId }) => {
  const [reviews, setReviews] = useState<ReviewItemResponseDto[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getWebtoonReviews } = useReviews();
  const stableGetWebtoonReviews = useCallback(getWebtoonReviews, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await stableGetWebtoonReviews(webtoonId, currentPage);
        if (data) {
          setReviews(data.content);
          setCurrentPage(data.currentPage);
          setTotalPages(data.totalPages);
        }
      } catch {
        setError('리뷰를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [webtoonId, currentPage, stableGetWebtoonReviews]);

  return (
    <div className="p-4 max-w-9xl mx-auto max-h-[500px] overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">웹툰 리뷰</h1>

      {loading && <p>로딩 중...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && reviews.length > 0 ? (
        <>
          <SmallReviewListTwoCols reviews={reviews} />
          <div className="flex justify-between mt-4">
            <Button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 0))}
              disabled={currentPage === 0}
            >
              이전
            </Button>
            <span className="text-sm">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              onClick={() =>
                setCurrentPage(Math.min(currentPage + 1, totalPages - 1))
              }
              disabled={currentPage >= totalPages - 1}
            >
              다음
            </Button>
          </div>
        </>
      ) : (
        !loading && <p>등록된 리뷰가 없습니다.</p>
      )}
    </div>
  );
};

export default TwoColsReviewBox;
