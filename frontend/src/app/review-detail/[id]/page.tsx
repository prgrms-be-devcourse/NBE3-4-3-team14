'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import NavigationBar from '@/components/common/NavigationBar/NavigationBar';
import useReviews from '@/lib/api/review/review';
import ReviewDetail from '@/components/buisness/review/ReviewDetail';
import { getRecommendationStatus } from '@/lib/api/review/recommend';
import { useAuth } from '@/lib/api/security/useAuth';
import ReviewCommentSection from '@/components/buisness/reviewComment/ReviewCommentSection';

export default function Page() {
  const params = useParams();
  const id = params?.id;
  const { fetchReviewById } = useReviews();
  const { isLoggedIn, loginId } = useAuth();
  const reviewId = Number(id);

  const [review, setReview] = useState<any>(null);
  const [recommendationStatus, setRecommendationStatus] = useState<{
    likes: boolean;
    hates: boolean;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef<boolean>(false);

  useEffect(() => {
    if (isLoggedIn === null) return;
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      try {
        const reviewData = await fetchReviewById(reviewId);
        setReview(reviewData);
        if (isLoggedIn) {
          const recommendationData = await getRecommendationStatus(reviewId);
          setRecommendationStatus(recommendationData);
        } else {
          setRecommendationStatus({ likes: false, hates: false });
        }
      } catch (err) {
        setError('리뷰 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reviewId, isLoggedIn, fetchReviewById]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div>
      <NavigationBar />
      <div className="h-5" />
      <div className="container mx-auto px-4">
        <ReviewDetail
          review={review}
          recommendationStatus={recommendationStatus}
          isLoggedIn={isLoggedIn ?? false}
          id={loginId}
        />

        {/* 댓글 섹션 */}
        <ReviewCommentSection reviewId={reviewId} />
      </div>
    </div>
  );
}