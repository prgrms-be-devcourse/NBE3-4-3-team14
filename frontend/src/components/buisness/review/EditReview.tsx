'use client';

import { useRouter } from 'next/navigation';
import useReviews from '@/lib/api/review/review';
import ReviewForm from '@/components/common/ReviewForm/ReviewForm';
import { ReviewRequestDto } from '@/lib/types/review/ReviewRequestDto';

interface EditReviewPageProps {
  webtoonName: string; // 검색한 웹툰 이름
  webtoonId: number; // 검색한 웹툰 ID
}

const EditReviewPage: React.FC<EditReviewPageProps> = ({
  webtoonName,
  webtoonId,
}) => {
  const router = useRouter();
  const { createReview } = useReviews();

  const handleCreateReview = async (reviewRequestDto: ReviewRequestDto) => {
    const reviewId = await createReview(reviewRequestDto);
    if (reviewId !== null) {
      console.log('리뷰 작성 성공! ID:', reviewId);
      return reviewId;
    }
    console.error('리뷰 작성 실패');
    return null;
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] w-full max-w-[100vw] p-0 bg-gray-100">
      <ReviewForm
        mode="write"
        webtoonName={webtoonName}
        webtoonId={webtoonId}
        onSubmit={handleCreateReview}
      />
    </div>
  );
};

export default EditReviewPage;
