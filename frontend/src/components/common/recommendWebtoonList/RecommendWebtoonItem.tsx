'use client';

import { useRouter } from 'next/navigation';
import { WebtoonDetailDto } from '@/lib/types/webtoon/WebtoonDetailDto';

const RecommendWebtoonItem: React.FC<{ webtoon: WebtoonDetailDto }> = ({ webtoon }) => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/webtoon-detail/${webtoon.webtoonId}`);
  };

  return (
     
      <div onClick={handleNavigate} className='cursor-pointer'>
         {/* 썸네일 */}
          <img
            src={webtoon.thumbnailUrl}
            alt={webtoon.webtoonName}
            className="w-[150px] h-full object-cover aspect-[3/4] rounded-t-lg sm:rounded-l-lg
                        min-w-[140px]"
          />
      </div>


  );
};

export default RecommendWebtoonItem;
