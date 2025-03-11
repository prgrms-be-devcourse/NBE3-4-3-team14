import React from 'react';
import { ReviewDetailResponseDto } from '@/lib/types/review/ReviewDetailResponseDto';
import SpoilerButton from '@/components/common/SpoilerButton/SpoilerButton';

interface ReviewContentBoxProps {
  review: ReviewDetailResponseDto;
}

const ReviewContentBox: React.FC<ReviewContentBoxProps> = ({ review }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* 제목 & 신고 버튼 */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold flex-grow">{review.title}</h2>
        {review.spoilerStatus === 'FALSE' && (
          <SpoilerButton reviewId={review.reviewId} />
        )}
      </div>

      {/* 스포일러 경고 */}
      {review.spoilerStatus === 'TRUE' && (
        <p className="text-red-500 font-semibold mb-4">⚠️ 스포일러 포함</p>
      )}

      {/* 프로필 정보 */}
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={review.userDataResponse.profileImage}
          alt={`${review.userDataResponse.nickname}의 프로필 이미지`}
          className="w-12 h-12 rounded-full object-cover"
        />
        <span className="text-lg font-semibold">
          {review.userDataResponse.nickname}
        </span>
      </div>

      {/* 이미지 리스트 */}
      {review.imageUrls.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-start gap-2">
          {review.imageUrls.map((url, index) => (
            <div key={index} className="flex justify-center items-center">
              <img
                src={url}
                alt={`리뷰 이미지 ${index + 1}`}
                className="w-auto h-auto max-w-[300px] max-h-[225px] object-contain rounded-md"
              />
            </div>
          ))}
        </div>
      )}

      {/* 본문 내용 */}
      <p className="text-gray-700 mt-4">{review.content}</p>
    </div>
  );
};

export default ReviewContentBox;
