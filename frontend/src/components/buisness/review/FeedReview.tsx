'use client';
import { useState, useEffect, useRef } from 'react';
import { LargeReviewList } from '@/components/common/LargeReviewList/LargeReviewList';
import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';
import { PageDto } from '@/lib/types/common/PageDto';

const FeedReview: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItemResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1); // totalPages 상태 추가
  const [isLastPage, setIsLastPage] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  // 서버에서 리뷰 데이터를 가져오는 함수
  const fetchReviews = async (page: number) => {
    if (loading || isLastPage) return; // 로딩 중이거나 마지막 페이지면 중복 호출 방지
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/reviews?page=${page}`);
      if (!res.ok) throw new Error('서버 응답 오류');

      const data: PageDto<ReviewItemResponseDto> = await res.json();

      setTotalPages(data.totalPages);

      // 기존 리뷰 + 새로운 리뷰 → 중복 제거
      setReviews((prev) => {
        const allReviews = [...prev, ...data.content];

        // 중복된 reviewId를 제거하기 위해 Map 사용
        const uniqueReviews = Array.from(
          new Map(
            allReviews.map((review) => [review.reviewId, review])
          ).values()
        );

        return uniqueReviews;
      });

      setIsLastPage(page >= data.totalPages - 1); // 마지막 페이지 여부 업데이트
    } catch (err) {
      setError('리뷰를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 페이지 변경 시 데이터 가져오기
  useEffect(() => {
    if (currentPage < totalPages) {
      fetchReviews(currentPage);
    }
  }, [currentPage, totalPages]);

  // IntersectionObserver 설정
  useEffect(() => {
    if (!observerRef.current || isLastPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setCurrentPage((prev) => {
            if (prev + 1 < totalPages) {
              return prev + 1; // 다음 페이지 요청
            }
            return prev; // 마지막 페이지면 변경 안 함
          });
        }
      },
      { threshold: 0.8 }
    );
    const currentRef = observerRef.current;
    observer.observe(currentRef);

    return () => observer.unobserve(currentRef);
  }, [loading, isLastPage]);

  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <>
      {/* reviews 리스트를 그대로 전달 */}
      <LargeReviewList reviews={reviews} />

      {/* 무한 스크롤 감지용 요소 */}
      <div ref={observerRef} className="h-10"></div>

      {/* 로딩 표시 */}
      {loading && <div className="text-center p-4">로딩 중...</div>}
    </>
  );
};

export default FeedReview;
