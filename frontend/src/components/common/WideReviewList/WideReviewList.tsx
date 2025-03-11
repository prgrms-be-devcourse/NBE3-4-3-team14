import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';
import WideReviewItem from '@/components/common/WideReviewList/WideReviewItem';

export const WideReviewList: React.FC<{ reviews: ReviewItemResponseDto[] }> = ({
  reviews,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      {reviews.map((review) => (
        <WideReviewItem key={review.reviewId} review={review} />
      ))}
    </div>
  );
};

export default WideReviewList;
