'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWebtoonById } from '@/lib/api/webtoon/webtoon';
import WebtoonDetail from '@/components/buisness/webtoonDetail/WebtoonInfo';
import NavigationBar from '@/components/common/NavigationBar/NavigationBar';
import WebtoonDrawerTaps from '@/components/buisness/webtoonDetail/WebtoonDrawerTaps';
import ExpandableDrawer from '@/components/common/ExpandableDrawer/ExpandableDrawer';
import { WebtoonDetailDto } from '@/lib/types/webtoon/WebtoonDetailDto';

export default function Page({ params }: { params: Promise<{ id?: string }> }) {
  const { id } = use(params); // use()로 params 언랩
  const router = useRouter();
  const [webtoon, setWebtoon] = useState<WebtoonDetailDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const webtoonId = id ? Number(id) : null;

  useEffect(() => {
    if (!id) {
      setError('잘못된 요청입니다.');
      return;
    }

    const fetchWebtoon = async () => {
      try {
        const data = await fetchWebtoonById(id);
        setWebtoon(data);
      } catch (err) {
        setError('웹툰 데이터를 불러오는데 실패했습니다.');
      }
    };

    fetchWebtoon();
  }, [id]);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!webtoon) {
    return <div className="text-center text-gray-500">로딩 중...</div>;
  }

  return (
    <>
      <NavigationBar />
      <WebtoonDetail webtoon={webtoon} />
      <ExpandableDrawer
        children={<WebtoonDrawerTaps webtoonId={webtoonId!} />}
      />
    </>
  );
}
