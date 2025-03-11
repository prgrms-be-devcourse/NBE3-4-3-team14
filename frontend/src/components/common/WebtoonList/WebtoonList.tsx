import WebtoonItem from '@/components/common/WebtoonList/WebtoonItem';
import { WebtoonDetailDto } from '@/lib/types/webtoon/WebtoonDetailDto';

interface WebtoonListProps {
  webtoons: WebtoonDetailDto[];
  isHorizontal?: boolean; // 가로 배치 여부 추가
}
const WebtoonList: React.FC<WebtoonListProps> = ({
  webtoons,
  isHorizontal = false,
}) => {
  return (
    <div
      className={
        isHorizontal
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' // 가로 배치 (반응형)
          : 'grid grid-cols-1 gap-4' // 기본 세로 배치
      }
    >
      {webtoons.map((webtoon) => (
        <WebtoonItem key={webtoon.webtoonId} webtoon={webtoon} />
      ))}
    </div>
  );
};

export default WebtoonList;
