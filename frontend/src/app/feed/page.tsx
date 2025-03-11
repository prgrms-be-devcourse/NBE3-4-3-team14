'use client';

import RecommendWebtoon from '@/components/buisness/recommendWebtoon/RecommendWebtoon';
import FeedReview from '@/components/buisness/review/FeedReview';
import NavigationBar from '@/components/common/NavigationBar/NavigationBar';
import SearchContainer from '@/components/common/Search/SearchContainer';
import useReviews from '@/lib/api/review/review';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const FeedPage = () => {
  const { reviews, loading, error, fetchReviews } = useReviews();
  const router = useRouter();

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSearch = (query: string, type: string) => {
    router.push(`/search?query=${encodeURIComponent(query)}&type=${type}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <NavigationBar />
      <SearchContainer onSearch={handleSearch} showTabs={true} />
      <RecommendWebtoon />
      <FeedReview />
    </>
  );
};

export default FeedPage;
