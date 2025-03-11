import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';
import SmallReviewItem from '@/components/common/SmallReviewList/SmallReviewItem';

export const SmallReviewList: React.FC<{
  reviews: ReviewItemResponseDto[];
}> = ({ reviews }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {' '}
      {/* 고정값으로 설정 */}
      {reviews.map((review) => (
        <SmallReviewItem key={review.reviewId} review={review} />
      ))}
    </div>
  );
};

// 웹툰 게시물 보기에 써보려고 합니다. (백엔드 구현안되서 아직 못써봄)
export const SmallReviewListTwoCols: React.FC<{
  reviews: ReviewItemResponseDto[];
}> = ({ reviews }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {' '}
      {/* 가로 2개씩 정렬 */}
      {reviews.map((review) => (
        <SmallReviewItem key={review.reviewId} review={review} />
      ))}
    </div>
  );
};
