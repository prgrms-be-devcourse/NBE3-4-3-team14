import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const WideReviewItem: React.FC<{ review: ReviewItemResponseDto }> = ({
  review,
}) => {
  const [showSpoiler, setShowSpoiler] = useState(false);
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/review-detail/${review.reviewId}`);
  };

  return (
    <div
      className="border p-4 rounded-lg shadow-md flex items-start cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={handleNavigate} // 클릭 시 라우터 작동
    >
      {/* 왼쪽 영역 (2) */}
      <div className="flex flex-col w-2/12 items-center">
        <img
          src={review.userDataResponse.profileImage}
          alt={review.userDataResponse.nickname}
          className="w-12 h-12 rounded-full object-cover mb-2"
        />
        <span className="text-sm font-medium">
          {review.userDataResponse.nickname}
        </span>
        <div className="text-xs text-gray-400 mt-2">
          <p>추천: {review.recommendCount}</p>
          <p>댓글: {review.commentCount}</p>
        </div>
      </div>

      {/* 중간 영역 (5) */}
      <div className="flex-1">
        {/* 제목 */}
        <h2 className="text-lg font-bold">
          {review.title}{' '}
          {review.spoilerStatus === 'TRUE' && (
            <span className="text-red-500 text-sm">🚨 [스포일러]</span>
          )}
        </h2>

        {/* 내용 */}
        {review.spoilerStatus === 'TRUE' && !showSpoiler ? (
          <div className="bg-red-100 text-red-500 p-2 rounded mt-2 flex items-center justify-between">
            <span>⚠️ 이 리뷰에는 스포일러가 포함되어 있습니다.</span>
            <button
              onClick={(e) => {
                e.stopPropagation(); // 클릭 이벤트 전파 방지
                setShowSpoiler(true);
              }}
              className="text-blue-500 underline text-sm"
            >
              보기
            </button>
          </div>
        ) : (
          <p className="text-gray-500 mt-1 line-clamp-3">{review.content}</p>
        )}
      </div>

      {/* 구분선 */}
      <div className="w-px bg-gray-300 mx-4"></div>

      {/* 오른쪽 영역 (3) */}
      <div className="w-3/12 flex flex-col items-center">
        <p className="text-sm text-gray-600 mb-2">
          {review.webtoon.webtoonName}
        </p>
        <img
          src={review.webtoon.thumbnailUrl}
          alt={review.webtoon.webtoonName}
          className="w-24 h-24 object-cover rounded"
        />
      </div>
    </div>
  );
};

export default WideReviewItem;
