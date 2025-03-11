'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { WebtoonDetailDto } from '@/lib/types/webtoon/WebtoonDetailDto';

const WebtoonItem: React.FC<{ webtoon: WebtoonDetailDto }> = ({ webtoon }) => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/webtoon-detail/${webtoon.webtoonId}`);
  };

  return (
    <Card
      className="flex flex-col sm:flex-row w-full min-w-[200px] max-w-[450px] mx-auto cursor-pointer rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
      onClick={handleNavigate}
    >
      {/* 썸네일 */}
      <div className="w-full sm:w-1/3 flex-shrink-0">
        <img
          src={webtoon.thumbnailUrl}
          alt={webtoon.webtoonName}
          className="w-full h-full object-cover aspect-[3/4] rounded-t-lg sm:rounded-l-lg"
        />
      </div>

      {/* 웹툰 정보 */}
      <CardContent className="flex flex-1 p-4 flex-col justify-between">
        <div>
          <h2 className="text-base md:text-lg font-semibold truncate">
            {webtoon.webtoonName}
          </h2>
          <p className="text-sm md:text-base text-gray-500 line-clamp-2">
            {webtoon.authors}
          </p>
          <p className="text-sm md:text-base text-gray-500">
            {webtoon.finished ? '완결' : '연재중'}
          </p>
        </div>

        {/* 웹툰 보기 버튼 */}
        <a
          href={webtoon.webtoonLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 text-sm md:text-base mt-2 inline-block"
          onClick={(e) => e.stopPropagation()} // 부모 요소 클릭 방지
        >
          웹툰 보기
        </a>
      </CardContent>
    </Card>
  );
};

export default WebtoonItem;
