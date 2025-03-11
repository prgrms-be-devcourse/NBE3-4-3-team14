'use client';

import { useEffect, useState } from 'react';
import {
  GhostTabs,
  GhostTabsList,
  GhostTabsTrigger,
  GhostTabsContent,
} from '@/components/common/GhostTabs/GhostTabs';
import { getFavoriteWebtoonList } from '@/lib/api/webtoon/favorite';
import { fetchRecommendedReviews } from '@/lib/api/review/recommend';
import { WebtoonDetailDto } from '@/lib/types/webtoon/WebtoonDetailDto';
import { PageDto } from '@/lib/types/common/PageDto';
import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';
import WebtoonList from '@/components/common/WebtoonList/WebtoonList';
import WideReviewBox from '@/components/common/WideReviewBox/WideReviewBox';
import useReviews from '@/lib/api/review/review';

const initialPageState: PageDto<ReviewItemResponseDto> = {
  content: [],
  currentPage: 0,
  totalPages: 1,
  totalElements: 0,
  hasNext: false,
  hasPrevious: false,
  isLast: true,
};

const UserDrawerTaps = ({ loginId }: { loginId: number }) => {
  const [favoriteWebtoons, setFavoriteWebtoons] = useState<WebtoonDetailDto[]>(
    []
  );
  const [recommendedReviews, setRecommendedReviews] =
    useState(initialPageState);
  const [userReviews, setUserReviews] = useState(initialPageState);
  const [currentPage, setCurrentPage] = useState(0);
  const [userReviewPage, setUserReviewPage] = useState(0);
  const { fetchUserReviews } = useReviews();

  useEffect(() => {
    (async () => {
      try {
        const data = await getFavoriteWebtoonList();
        setFavoriteWebtoons(data);
      } catch (error) {
        console.error('Failed to fetch favorite webtoons:', error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchRecommendedReviews(loginId, currentPage);
        setRecommendedReviews(data ?? initialPageState);
      } catch (error) {
        console.error('Failed to fetch recommended reviews:', error);
        setRecommendedReviews(initialPageState);
      }
    })();
  }, [loginId, currentPage]);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchUserReviews(userReviewPage);
        setUserReviews(data ?? initialPageState);
      } catch (error) {
        console.error('Failed to fetch user reviews:', error);
        setUserReviews(initialPageState);
      }
    })();
  }, [userReviewPage]);

  return (
    <GhostTabs defaultValue="firstTap">
      <GhostTabsList>
        <GhostTabsTrigger value="firstTap">관심 웹툰 목록</GhostTabsTrigger>
        <GhostTabsTrigger value="secondTap">게시글 보기</GhostTabsTrigger>
        <GhostTabsTrigger value="thirdTap">추천내역</GhostTabsTrigger>
      </GhostTabsList>

      <GhostTabsContent value="firstTap">
        <WebtoonList webtoons={favoriteWebtoons} isHorizontal />
      </GhostTabsContent>
      <GhostTabsContent value="secondTap">
        <WideReviewBox
          pageData={userReviews}
          onPageChange={setUserReviewPage}
        />
      </GhostTabsContent>
      <GhostTabsContent value="thirdTap">
        <WideReviewBox
          pageData={recommendedReviews}
          onPageChange={setCurrentPage}
        />
      </GhostTabsContent>
    </GhostTabs>
  );
};

export default UserDrawerTaps;
