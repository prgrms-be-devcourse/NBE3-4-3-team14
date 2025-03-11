export interface WebtoonSearchRequestDto {
  webtoonName?: string; // @Size(max = 100) → Optional (TypeScript에서 직접 길이 제한은 안 하지만 UI에서 처리 가능)
  platform?: 'NAVER' | 'KAKAO_PAGE'; // @Pattern 제한 적용
  authors?: string; // @Size(max = 100)
  finished?: boolean; // Boolean → boolean (TypeScript는 기본적으로 undefined 허용)
  page?: number; // 기본값 0
  size?: number; // 기본값 10
  sortBy?: 'WEBTOON_NAME' | 'AUTHORS' | 'PLATFORM' | 'FINISHED'; // Enum-like string 제한 적용
  sortDirection?: 'asc' | 'desc'; // @Pattern 제한 적용
}
