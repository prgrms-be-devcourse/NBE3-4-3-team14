import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SmallReviewItem: React.FC<{ review: ReviewItemResponseDto }> = ({
  review,
}) => {
  const [showSpoiler, setShowSpoiler] = useState(false);
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/review-detail/${review.reviewId}`);
  };

  return (
    <div
      className="border p-4 rounded-lg shadow-md flex justify-between items-start cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={handleNavigate} // 클릭 시 라우터 작동
    >
      {/* 왼쪽 컨텐츠 */}
      <div className="flex-1">
        {/* 웹툰 ID & 조회수/댓글 */}
        <div className="flex justify-between items-center text-xs text-gray-400">
          <p>웹툰명: {review.webtoon.webtoonName}</p>
          <div className="flex space-x-2">
            <p>조회수: {review.viewCount}</p>
            <p>추천수: {review.recommendCount}</p>
            <p>댓글: {review.commentCount}</p>
          </div>
        </div>

        {/* 제목 (스포일러 표시 포함) */}
        <h2 className="text-lg font-bold mt-1">
          {review.title}{' '}
          {review.spoilerStatus === 'TRUE' && (
            <span className="text-red-500 text-sm">🚨 [스포일러]</span>
          )}
        </h2>

        {/* 내용 (스포일러 시 가리기) */}
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
          <p className="text-gray-500 line-clamp-3 mt-1">{review.content}</p>
        )}

        {/* 유저 정보 */}
        <div className="flex items-center mt-2">
          <img
            src={`${review.userDataResponse.profileImage}`}
            alt={review.userDataResponse.nickname}
            className="w-8 h-8 rounded-full mr-2 object-cover"
          />
          <span className="text-sm font-medium">
            {review.userDataResponse.nickname}
          </span>
        </div>
      </div>

      {/* 오른쪽 이미지 (가로 배치) */}
      {(review.spoilerStatus === 'FALSE' || showSpoiler) &&
        review.imageUrls?.length > 0 && (
          <div
            className={`grid ${review.imageUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}
          >
            {review.imageUrls.slice(0, 2).map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`추가 이미지 ${index + 1}`}
                className="w-40 h-40 object-cover rounded"
              />
            ))}
          </div>
        )}
    </div>
  );
};

export default SmallReviewItem;
