import { WebtoonSummaryDto } from '../webtoon/WebtoonSummaryDto';

export interface ReviewDetailResponseDto {
  reviewId: number;
  userDataResponse: {
    userid: number;
    nickname: string;
    profileImage: string;
  };
  webtoon: WebtoonSummaryDto;
  content: string;
  title: string;
  viewCount: number;
  spoilerStatus: 'TRUE' | 'FALSE';
  imageUrls: string[];
  commentResponses: {
    content: any[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
    hasPrevious: boolean;
    last: boolean;
  };
  createdAt: string;
  updatedAt: string | null;
  recommendCount: {
    hates: number;
    likes: number;
  };
}
