import axios from 'axios';
import API_BASE_URL from '@/lib/utils/apiConfig';

export interface FavoriteDto {
  webtoonId: string;
}

export const addFavoriteWebtoon = async (webtoonId: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/favorite/${webtoonId}`,
      {}, // 빈 객체를 request body로 전달 (POST 요청이므로 필요)
      {
        withCredentials: true, // 쿠키 인증 추가
      }
    );
    return response.status === 200;
  } catch (error) {
    console.error('Failed to add favorite webtoon:', error);
    return false;
  }
};

export const deleteFavoriteWebtoon = async (webtoonId: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/favorite/${webtoonId}`,
      {
        withCredentials: true,
      }
    );
    return response.status === 200;
  } catch (error) {
    console.error('관심 웹툰 여부 확인 실패:', error);
    return false;
  }
};

export const getFavoriteWebtoonList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/favorite/list`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('관심 웹툰 목록 가져오기 실패:', error);
    return [];
  }
};

export const checkFavoriteWebtoon = async (webtoonId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/favorite/${webtoonId}`, {
      withCredentials: true, // 쿠키 인증 추가
    });
    return response.data;
  } catch (error) {
    console.error('관심 웹툰 여부 확인 실패:', error);
    return false;
  }
};
