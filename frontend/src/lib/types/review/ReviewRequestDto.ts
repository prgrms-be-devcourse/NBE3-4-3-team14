export interface ReviewRequestDto {
  title: string;
  content: string;
  webtoonId: number; // Long 타입
  spoilerStatus: string;
  images?: File[]; // 이미지 배열
}
