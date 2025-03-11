import API_BASE_URL from '@/lib/utils/apiConfig';

export type RecommendationType = 'like' | 'hate';

const sendRequest = async (
  id: number,
  type: RecommendationType,
  method: 'POST' | 'DELETE'
) => {
  try {
    const url = `${API_BASE_URL}/recommend/${id}?type=${type}`;
    const response = await fetch(url, {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error('Failed to send recommendation request:', error);
    throw error;
  }
};

export const recommendLike = (id: number) => sendRequest(id, 'like', 'POST');
export const recommendHate = (id: number) => sendRequest(id, 'hate', 'POST');
export const removeRecommendLike = (id: number) =>
  sendRequest(id, 'like', 'DELETE');
export const removeRecommendHate = (id: number) =>
  sendRequest(id, 'hate', 'DELETE');

export const getRecommendationStatus = async (id: number) => {
  try {
    const url = `${API_BASE_URL}/recommend/${id}/recommendation`;
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch recommendation status:', error);
    throw error;
  }
};

export const fetchRecommendedReviews = async (userId: number, page: number) => {
  try {
    const url = `${API_BASE_URL}/recommend/user/${userId}?page=${page}`;
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch recommended reviews:', error);
    throw error;
  }
};
