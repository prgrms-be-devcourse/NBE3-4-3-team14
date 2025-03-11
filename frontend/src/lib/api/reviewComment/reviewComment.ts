import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { CommentResponseDto } from '@/lib/types/reviewComment/CommentResponseDto';
import { PageDto } from '@/lib/types/common/PageDto';
import { CommentRequestDto } from '@/lib/types/reviewComment/CommentRequestDto';
import API_BASE_URL from '@/lib/utils/apiConfig';

// 리뷰 댓글 API 훅
export const useReviewComments = (reviewId: number) => {
  const [comments, setComments] = useState<CommentResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  // 댓글 조회
  const fetchComments = useCallback(async () => {
    if (!reviewId) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<PageDto<CommentResponseDto>>(
        `${API_BASE_URL}/reviews/${reviewId}/comments`,
        {
          params: { page, size },
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      if (response.data) {
        setComments(response.data.content || []);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (err: any) {
      console.error('댓글 조회 중 오류 발생:', err);
      setError(
        err.response?.data?.message || '댓글을 불러오는데 실패했습니다.'
      );
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  }, [reviewId, page, size]);

  // 댓글 생성
  const handleCreateComment = useCallback(
    async (
      commentRequestDto: CommentRequestDto
    ): Promise<CommentResponseDto | null> => {
      if (!commentRequestDto.content.trim()) {
        setError('댓글 내용을 입력해주세요.');
        return null;
      }

      try {
        const response = await axios.post<CommentResponseDto>(
          `${API_BASE_URL}/reviews/${reviewId}/comments`,
          {
            content: commentRequestDto.content.trim(),
            parentCommentId: commentRequestDto.parentCommentId || null,
            mentions: commentRequestDto.mentions || [],
          },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
        );

        if (response.data) {
          await fetchComments();
          return response.data;
        }
        return null;
      } catch (err: any) {
        console.error('댓글 작성 중 오류 발생:', err);
        setError(err.response?.data?.message || '댓글 작성에 실패했습니다.');
        return null;
      }
    },
    [reviewId, fetchComments]
  );

  // 댓글 수정
  const handleUpdateComment = useCallback(
    async (
      commentId: number,
      commentRequestDto: CommentRequestDto
    ): Promise<CommentResponseDto | null> => {
      if (!commentRequestDto.content.trim()) {
        setError('댓글 내용을 입력해주세요.');
        return null;
      }

      try {
        const response = await axios.put<CommentResponseDto>(
          `${API_BASE_URL}/reviews/${reviewId}/comments/${commentId}`,
          commentRequestDto,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
        );

        if (response.data) {
          await fetchComments();
          return response.data;
        }
        return null;
      } catch (err: any) {
        console.error('댓글 수정 중 오류 발생:', err);
        setError(err.response?.data?.message || '댓글 수정에 실패했습니다.');
        return null;
      }
    },
    [reviewId, fetchComments]
  );

  // 댓글 삭제
  const handleDeleteComment = useCallback(
    async (commentId: number) => {
      try {
        await axios.delete(
          `${API_BASE_URL}/reviews/${reviewId}/comments/${commentId}`,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
        );
        await fetchComments();
      } catch (err: any) {
        console.error('댓글 삭제 중 오류 발생:', err);
        setError(err.response?.data?.message || '댓글 삭제에 실패했습니다.');
      }
    },
    [reviewId, fetchComments]
  );

  useEffect(() => {
    if (reviewId) {
      fetchComments();
    }
  }, [fetchComments, reviewId]);

  return {
    comments,
    isLoading,
    error,
    handleCreateComment,
    handleUpdateComment,
    handleDeleteComment,
    page,
    setPage,
    totalPages,
    fetchComments,
  };
};
