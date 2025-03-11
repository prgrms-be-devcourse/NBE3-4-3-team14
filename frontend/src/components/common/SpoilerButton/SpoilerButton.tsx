import { useState } from 'react';
import useReviews from '@/lib/api/review/review';

const SpoilerButton = ({ reviewId }: { reviewId: number }) => {
  const { spoilerReview } = useReviews();
  const [loading, setLoading] = useState(false);

  const handleSpoiler = async () => {
    setLoading(true);
    await spoilerReview(reviewId);
    setLoading(false);
    window.alert('🚨 신고가 완료되었습니다!');
    window.location.reload();
  };

  return (
    <button
      onClick={handleSpoiler}
      disabled={loading}
      className={`flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-md
                     transition duration-200 hover:bg-red-600 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed`}
    >
      <span className="text-lg">🚨</span>
      <span>{loading ? '신고 중...' : '스포일러 신고'}</span>
    </button>
  );
};

export default SpoilerButton;
