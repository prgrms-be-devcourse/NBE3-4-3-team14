'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';
import SimilarWebtoonPanel from '@/components/buisness/voting/SimilarWebtoonPannel';

interface LargeReviewItemProps {
  review: ReviewItemResponseDto;
}

const LargeReviewItem: React.FC<LargeReviewItemProps> = ({ review }) => {
  const [showSpoiler, setShowSpoiler] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false); // 패널 열림 여부
  const router = useRouter();

  // 리뷰 카드 클릭 시 리뷰 상세 페이지 이동
  const handleNavigate = (e: React.MouseEvent) => {
    // .noNavigate 클래스를 가진 요소가 클릭된 경우, 상세 페이지 이동 차단
    if ((e.target as HTMLElement).closest('.noNavigate')) {
      e.stopPropagation();
      return;
    }
    router.push(`/review-detail/${review.reviewId}`);
  };

  // 웹툰 썸네일 클릭 → 패널 열기
  const handleWebtoonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('🔵 웹툰 썸네일 클릭됨');
    setIsPanelOpen(true);
  };

  return (
    <>
      <Card
        className="relative flex mx-3 cursor-pointer border border-gray-300 rounded-lg bg-white p-4"
        onClick={handleNavigate}
      >
        <div className="flex flex-col flex-1 justify-between">
          {/* 상단 영역: 유저 이미지, 닉네임, 조회수 등 */}
          <div className="flex items-center mb-2 justify-between">
            <div className="flex items-center">
              <img
                src={review.userDataResponse.profileImage}
                className="border border-gray-300 w-[28px] h-[28px] rounded-full object-cover"
              />
              <p className="mx-2 text-[15px] text-gray-500">
                {review.userDataResponse.nickname}
              </p>
            </div>
            <div className="flex space-x-2 mx-2">
              <p className="mx-2 text-xs text-gray-500">
                조회수: {review.viewCount}
              </p>
              <p className="mx-2 text-xs text-gray-500">
                추천수: {review.recommendCount}
              </p>
              <p className="mx-2 text-xs text-gray-500">
                댓글: {review.commentCount}
              </p>
            </div>
          </div>

          {/* 리뷰 제목 / 스포일러 */}
          <h2 className="text-lg font-semibold text-gray-800 mb-1 flex items-center">
            {review.title}
            {review.spoilerStatus === 'TRUE' && (
              <span className="text-red-500 text-sm">🚨 [스포일러]</span>
            )}
          </h2>

          {/* 스포일러 처리 */}
          {review.spoilerStatus === 'TRUE' && !showSpoiler ? (
            <div className="bg-red-100 text-red-500 p-2 rounded mt-2 mr-2 flex items-center justify-between">
              <span>⚠️ 이 리뷰에는 스포일러가 포함되어 있습니다.</span>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 클릭 이벤트 전파 방지
                  setShowSpoiler(true);
                }}
                className="text-blue-500 underline text-sm noNavigate"
              >
                보기
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-600 line-clamp-1">
              {review.content}
            </p>
          )}

          {/* 리뷰 이미지 (스포일러 X 상태이거나 스포일러 해제 시) */}
          <div className="flex flex-row space-x-2 mt-2">
            {(review.spoilerStatus === 'FALSE' || showSpoiler) &&
              review.imageUrls?.length > 0 &&
              review.imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`리뷰 이미지 ${index + 1}`}
                  className="border border-gray-300 w-[200px] h-[150px] object-cover"
                />
              ))}
          </div>
        </div>

        {/* 오른쪽 영역: 웹툰 썸네일 */}
        <div className="flex flex-row m-0">
          <button
            onClick={handleWebtoonClick}
            className="noNavigate border-0 p-0 bg-transparent"
          >
            <img
              src={review.webtoon.thumbnailUrl}
              alt="웹툰 썸네일"
              className="w-[150px] h-[calc(100%-16px)] object-cover rounded cursor-pointer hover:opacity-80 transition"
            />
          </button>
        </div>
      </Card>

      {/* 오른쪽 고정 패널 (SimilarWebtoonPanel) */}
      <SimilarWebtoonPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        webtoonId={review.webtoon.webtoonId}
      />
    </>
  );
};

export default LargeReviewItem;
