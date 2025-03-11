import { useState, useEffect } from 'react';
import axios from 'axios';
import { SimilarRequest } from '@/lib/types/similar/SimilarRequest';
import { SimilarResponse } from '@/lib/types/similar/SimilarResponse';
import { PageDto } from '@/lib/types/common/PageDto';
import API_BASE_URL from '@/lib/utils/apiConfig';

const useSimilar = (targetWebtoonId: number) => {
  const [similarWebtoons, setSimilarWebtoons] = useState<SimilarResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchSimilarList = async (newPage = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<PageDto<SimilarResponse>>(
        `${API_BASE_URL}/similar?targetWebtoonId=${targetWebtoonId}&page=${newPage}&size=10`
      );

      console.log('📌 가져온 유사 웹툰 목록:', response.data);

      setSimilarWebtoons(response.data.content);
      setPage(newPage);
      setHasMore(!response.data.isLast);
    } catch (err) {
      setError('Failed to fetch similar webtoon list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (targetWebtoonId) {
      fetchSimilarList();
    }
  }, [targetWebtoonId]);

  // 유사 웹툰 등록
  const createSimilar = async (choiceWebtoonId: number) => {
    const requestData: SimilarRequest = {
      targetWebtoonId,
      choiceWebtoonId,
    };

    console.log('타겟웹툰:', targetWebtoonId, '선택웹툰:', choiceWebtoonId);

    try {
      const response = await axios.post<SimilarResponse>(
        `${API_BASE_URL}/similar`,
        requestData,
        { withCredentials: true }
      );

      setSimilarWebtoons((prev) => [...prev, response.data]);

      return response.data;
    } catch (err) {
      setError('Failed to create similar webtoon');
      return null;
    }
  };

  // 유사 웹툰 삭제 API 호출
  const deleteSimilar = async (similarId: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/similar/${similarId}`, {
        withCredentials: true,
      });

      setSimilarWebtoons((prev) =>
        prev.filter((webtoon) => webtoon.similarId !== similarId)
      );
    } catch (err) {
      setError('Failed to delete similar webtoon');
    }
  };

  return {
    similarWebtoons,
    setSimilarWebtoons,
    loading,
    error,
    fetchSimilarList,
    createSimilar,
    deleteSimilar,
    hasMore,
    page,
  };
};

export default useSimilar;
