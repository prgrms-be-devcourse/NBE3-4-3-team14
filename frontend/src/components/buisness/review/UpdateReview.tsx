'use client';

import { useRouter } from 'next/navigation';
import useReviews from '@/lib/api/review/review';
import ReviewForm from '@/components/common/ReviewForm/ReviewForm';
import { ReviewRequestDto } from '@/lib/types/review/ReviewRequestDto';
import { ReviewDetailResponseDto } from '@/lib/types/review/ReviewDetailResponseDto';
import { useState } from 'react';

const ReviewUpdate = () => {
  const { updateReview } = useReviews();
  const router = useRouter();

  // sessionStorage에서 review 데이터 가져오기
  const storedReview = sessionStorage.getItem('reviewData');
  const review: ReviewDetailResponseDto | null = storedReview
    ? JSON.parse(storedReview)
    : null;

  const [deletedImages, setDeletedImages] = useState<string[]>([]); // 삭제된 기존 이미지 저장

  if (!review) {
    console.error('Review 데이터가 없습니다.');
    return (
      <p className="text-center text-red-500">
        리뷰 데이터를 불러올 수 없습니다.
      </p>
    );
  }

  const handleUpdateReview = async (reviewRequestDto: ReviewRequestDto) => {
    // 삭제되지 않은 기존 이미지 URL들만 유지
    const remainingImageUrls =
      review.imageUrls?.filter((url) => !deletedImages.includes(url)) ?? [];

    // 기존 이미지 URL을 File 객체로 변환하는 함수
    const convertUrlToFile = async (imageUrl: string): Promise<File> => {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new File([blob], imageUrl.split('/').pop() || 'image.jpg', {
        type: blob.type,
      });
    };

    // 유지할 기존 이미지를 File 객체로 변환
    const remainingImageFiles = await Promise.all(
      remainingImageUrls.map((url) => convertUrlToFile(url))
    );

    // 기존 이미지 + 새로 추가한 이미지를 병합
    const allImages: File[] = [
      ...remainingImageFiles, // 유지할 기존 이미지
      ...(reviewRequestDto.images ?? []), // 새로 추가된 이미지
    ];

    const formattedRequest: ReviewRequestDto = {
      ...reviewRequestDto,
      spoilerStatus:
        reviewRequestDto.spoilerStatus === 'TRUE' ? 'TRUE' : 'FALSE',
      images: allImages,
    };

    console.log('최종 요청 데이터:', formattedRequest);

    if (!review.reviewId) return null;

    try {
      await updateReview(review.reviewId, formattedRequest);
      console.log('업데이트 성공');
      return review.reviewId;
    } catch (error) {
      console.error('리뷰 수정에 실패했습니다.');
      return null;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] w-full bg-gray-100">
      <ReviewForm
        mode="edit"
        webtoonName={review.webtoon.webtoonName}
        webtoonId={review.webtoon.webtoonId}
        initialTitle={review.title}
        initialContent={review.content}
        initialImages={review.imageUrls ?? []}
        initialSpoilerStatus={review.spoilerStatus === 'TRUE'}
        onSubmit={handleUpdateReview}
        onDeleteImage={(deletedImageUrl) =>
          setDeletedImages((prev) => [...prev, deletedImageUrl])
        } // 삭제된 이미지를 상태에 추가
      />
    </div>
  );
};

export default ReviewUpdate;
