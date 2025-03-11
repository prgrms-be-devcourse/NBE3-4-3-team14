import { UserDataResponseDto } from '../user/UserDataResponseDto';
import { WebtoonSummaryDto } from '../webtoon/WebtoonSummaryDto';

export interface ReviewItemResponseDto {
  reviewId: number;
  userDataResponse: UserDataResponseDto; // 사용자 프로필, 닉네임
  content: string;
  title: string;
  viewCount: number;
  spoilerStatus: 'TRUE' | 'FALSE';
  webtoon: WebtoonSummaryDto;
  imageUrls: string[];
  commentCount: number;
  recommendCount: number;
}
