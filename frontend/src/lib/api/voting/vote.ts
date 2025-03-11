import { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/lib/utils/apiConfig';

const useVote = () => {
  const [error, setError] = useState<string | null>(null);

  const axiosInstance = axios.create({
    withCredentials: true,
  });

  // 투표 요청 (POST)
  const sendVote = async (
    similarId: number,
    voteType: 'agree' | 'disagree',
    page: number = 0,
    size: number = 10
  ) => {
    try {
      setError(null); // 이전 오류 초기화

      const response = await axiosInstance.post(
        `${API_BASE_URL}/vote/${similarId}`,
        null,
        {
          params: { voteType, page, size },
        }
      );

      if (response.status === 200) {
        console.log(`${similarId}번 유사 웹툰에 "${voteType}" 투표 완료`);
      }
      return response;
    } catch (err) {
      setError('Failed to send vote');
      console.error('❌ 투표 요청 중 오류 발생:', err);
    }
  };

  // 투표 취소 요청 (DELETE)
  const cancelVote = async (
    similarId: number,
    page: number = 0,
    size: number = 10
  ) => {
    try {
      setError(null);

      const response = await axiosInstance.delete(
        `${API_BASE_URL}/vote/${similarId}`,
        {
          params: { page, size },
        }
      );

      if (response.status === 200) {
        console.log(`${similarId}번 유사 웹툰 투표 취소 완료`);
      }
      return response;
    } catch (err) {
      setError('Failed to cancel vote');
      console.error('❌ 투표 취소 요청 중 오류 발생:', err);
    }
  };

  // 투표 상태 조회 요청 (GET)
  const getVoteStatus = async (
    similarId: number,
    page: number = 0,
    size: number = 10
  ) => {
    try {
      setError(null);

      const response = await axiosInstance.get(
        `${API_BASE_URL}/vote/${similarId}/status`,
        {
          withCredentials: true, // 로그인한 사용자만 자신의 투표 상태를 확인할 수 있도록 설정
        }
      );

      if (response.status === 200) {
        console.log(
          `${similarId}번 유사 웹툰 투표 상태 조회 완료`,
          response.data
        );
      }
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 401) {
        // 로그인 안 한 경우 조용히 무시
        console.warn('로그인하지 않은 사용자 - 투표 상태 조회 건너뜀');
        return null;
      }

      setError('Failed to get vote status'); // 다른 오류일 경우만 에러 표시
      console.error('❌ 투표 상태 조회 중 오류 발생:', err);
      return null;
    }
  };

  return {
    sendVote,
    cancelVote,
    getVoteStatus,
    error,
  };
};

export default useVote;
