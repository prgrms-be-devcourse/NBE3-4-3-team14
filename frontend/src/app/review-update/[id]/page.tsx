'use client';

import NavigationBar from '@/components/common/NavigationBar/NavigationBar';
import ReviewUpdate from '@/components/buisness/review/UpdateReview';

const ReviewUpdatePage = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <NavigationBar />
      <ReviewUpdate />
    </main>
  );
};

export default ReviewUpdatePage;
