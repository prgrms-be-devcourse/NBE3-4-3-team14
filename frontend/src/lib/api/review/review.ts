import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ReviewRequestDto } from '@/lib/types/review/ReviewRequestDto';
import { PageDto } from '@/lib/types/common/PageDto';
import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';
import { ReviewDetailResponseDto } from '@/lib/types/review/ReviewDetailResponseDto';
import API_BASE_URL from '@/lib/utils/apiConfig';

interface ReviewRequest {
  title: string;
  content: string;
  images?: File[];
}

const useReviews = (page: number = 0, size: number = 10) => {
  const [reviews, setReviews] = useState<ReviewItemResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 전체 조회
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<PageDto<ReviewItemResponseDto>>(
        `${API_BASE_URL}/reviews`,
        { params: { page, size } }
      );
      console.log(response.data);
      setReviews(response.data.content);
    } catch (err) {
      setError('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Id로 상세 조회
  const fetchReviewById = async (
    reviewId: number
  ): Promise<ReviewDetailResponseDto | undefined> => {
    try {
      const response = await axios.get<ReviewDetailResponseDto>(
        `${API_BASE_URL}/reviews/${reviewId}`
      );
      console.log('상세조회 API 호출');
      console.log(response.data);
      return response.data;
    } catch (err) {
      setError('Failed to fetch review details');
      return undefined;
    }
  };

  //작성한 게시글 목록 조회
  const fetchUserReviews = async (page: number) => {
    try {
      const response = await axios.get<PageDto<ReviewItemResponseDto>>(
        `${API_BASE_URL}/reviews/me?page=${page}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      setError('Failed to fetch user reviews:');
    }
  };
  // 사용자 리뷰 개수 조회
  const fetchReviewCountByUser = async () => {
    try {
      const response = await axios.get<number>('/reviews/me/count');
      return response.data;
    } catch (err) {
      setError('Failed to fetch review count');
    }
  };

  // 조회수 내림차순으로 모든 리뷰 조회
  const fetchReviewsSortedByViewCount = async () => {
    try {
      const response = await axios.get<PageDto<ReviewItemResponseDto>>(
        `${API_BASE_URL}/reviews/view-count-desc`,
        {
          params: { page, size },
        }
      );
      return response.data.content;
    } catch (err) {
      setError('Failed to fetch sorted reviews');
    }
  };

  // 리뷰 검색
  const searchReviews = async (title: string, page: number) => {
    if (!title) return null; // 빈 검색어 방지

    try {
      const response = await axios.get<PageDto<ReviewItemResponseDto>>(
        `${API_BASE_URL}/reviews/search`,
        {
          params: { page, size, title },
        }
      );

      return response.data; // 전체 데이터 반환
    } catch (err) {
      setError('Failed to search reviews');
    }
  };

  // 게시글 생성
  const createReview = async (
    reviewRequestDto: ReviewRequestDto
  ): Promise<number | null> => {
    const { title, content, webtoonId, spoilerStatus, images } =
      reviewRequestDto;

    // FormData 생성
    const formData = new FormData();

    const reviewRequest = {
      webtoonId,
      title,
      content,
      spoilerStatus,
    };

    // JSON 데이터 추가
    formData.append(
      'reviewRequest',
      new Blob([JSON.stringify(reviewRequest)], { type: 'application/json' })
    );

    // 이미지 파일 추가
    if (images) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }
    // reviewRequestDto.images?.forEach((image) =>
    //   formData.append('images', image)
    // );

    try {
      const response = await fetch(`${API_BASE_URL}/reviews/create`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      console.log('Response Status', response.status);

      if (!response.ok) {
        console.error('리뷰 작성 실패:', await response.text());
        return null;
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('리뷰 작성 중 오류 발생:', error);
      return null;
    }
  };

  // 게시글 수정
  const updateReview = async (reviewId: number, request: ReviewRequest) => {
    const formData = new FormData();
    formData.append(
      'reviewRequest',
      new Blob([JSON.stringify(request)], { type: 'application/json' })
    );

    request.images?.forEach((image) => formData.append('images', image));

    console.log('요청 데이터', formData);

    try {
      await axios.put(`${API_BASE_URL}/reviews/put/${reviewId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      fetchReviews();
    } catch (err) {
      setError('Failed to update review');
    }
  };

  // 게시글 삭제
  const deleteReview = async (reviewId: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/reviews/delete/${reviewId}`, {
        withCredentials: true,
      });
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.reviewId !== reviewId)
      );
    } catch (err) {
      setError('Failed to delete review');
    }
  };

  // 웹툰 ID에 해당하는 리뷰 조회
  const getWebtoonReviews = async (
    webtoonId: number,
    page: number,
    size: number = 10
  ) => {
    if (!webtoonId) return;

    try {
      const response = await axios.get<PageDto<ReviewItemResponseDto>>(
        `${API_BASE_URL}/reviews/webtoon/${webtoonId}`,
        { params: { page, size } }
      );
      return response.data;
    } catch (err) {
      setError('Failed to fetch reviews');
    }
  };

  // 게시글 스포일러 요청
  const spoilerReview = async (reviewId: number) => {
    try {
      await axios.patch(`${API_BASE_URL}/reviews/spoiler/${reviewId}`);
    } catch (err: any) {
      setError('리뷰를 스포일러 등록하는데 실패했습니다.');
    }
  };

  return {
    reviews,
    loading,
    error,
    fetchReviews,
    fetchReviewById,
    fetchUserReviews,
    fetchReviewCountByUser,
    fetchReviewsSortedByViewCount,
    searchReviews,
    createReview,
    updateReview,
    deleteReview,
    getWebtoonReviews,
    spoilerReview,
  };
};

export default useReviews;
