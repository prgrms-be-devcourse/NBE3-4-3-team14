'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { WebtoonSummaryDto } from '@/lib/types/webtoon/WebtoonSummaryDto';

const ReviewWebtoonBox: React.FC<{ webtoon: WebtoonSummaryDto }> = ({
  webtoon,
}) => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/webtoon-detail/${webtoon.webtoonId}`);
  };

  return (
    <Card
      className="flex flex-col w-full min-w-[200px] max-w-[450px] mx-auto cursor-pointer rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
      onClick={handleNavigate}
    >
      <CardContent className="flex flex-1 p-4 flex-col justify-between">
        {/* 썸네일 */}
        <div className="w-full flex-shrink-0 flex justify-center items-center">
          <img  
            src={webtoon.thumbnailUrl}
            alt={webtoon.webtoonName}
            className="w-full p-2 object-cover aspect-[3/4] rounded-t-lg sm:rounded-l-lg"
          />
        </div>
        {/* 제목 */}
        <div>
          <h2 className="text-base p-2 md:text-lg font-semibold">
            {webtoon.webtoonName}
          </h2>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewWebtoonBox;
