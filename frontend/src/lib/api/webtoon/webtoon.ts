import axios from 'axios';
import { WebtoonDetailDto } from '@/lib/types/webtoon/WebtoonDetailDto';
import { PageDto } from '@/lib/types/common/PageDto';
import API_BASE_URL from '@/lib/utils/apiConfig';

// API 호출 함수
export const fetchWebtoonById = async (
  id: string
): Promise<WebtoonDetailDto> => {
  try {
    const response = await axios.get<WebtoonDetailDto>(
      `${API_BASE_URL}/webtoons/${id}`
    );
    return response.data;
  } catch (error) {
    console.error('웹툰 데이터 호출에 실패했습니다.', error);
    throw error;
  }
};

// 웹툰 검색 함수
export const fetchWebtoons = async (
  page: number,
  size: number = 10,
  params: Record<string, any>
): Promise<PageDto<WebtoonDetailDto> | null> => {
  if (!params.webtoonName) return null; // 빈 검색어 방지

  try {
    const response = await axios.get<PageDto<WebtoonDetailDto>>(
      `${API_BASE_URL}/webtoons`,
      {
        params: {
          ...params,
          page,
          size,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('웹툰 데이터를 불러오는 중 오류 발생', error);
    return null;
  }
};
