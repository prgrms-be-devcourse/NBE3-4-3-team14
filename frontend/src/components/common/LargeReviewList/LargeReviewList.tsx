import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';
import LargeReviewItem from './LargeReviewItem';

interface LargeReviewListProps {
  reviews: ReviewItemResponseDto[];
}

export const LargeReviewList: React.FC<LargeReviewListProps> = ({
  reviews,
}) => {
  return (
    <div className="grid grid-cols-1 gap-3 mt-3">
      {reviews.map((review) => (
        <LargeReviewItem key={review.reviewId} review={review} />
      ))}
    </div>
  );
};
