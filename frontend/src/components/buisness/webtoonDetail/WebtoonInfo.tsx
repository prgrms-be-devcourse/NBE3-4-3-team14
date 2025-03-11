'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import FavoriteDialog from '@/components/common/FavoriteDialog/FavoriteDialog';
import {
  addFavoriteWebtoon,
  checkFavoriteWebtoon,
  deleteFavoriteWebtoon,
} from '@/lib/api/webtoon/favorite';
import { useAuth } from '@/lib/api/security/useAuth';
import { WebtoonDetailDto } from '@/lib/types/webtoon/WebtoonDetailDto';
import { logUserActivity } from '@/lib/api/userActivity/logUserActivity';
import { WebtoonSummaryDto } from '@/lib/types/webtoon/WebtoonSummaryDto';

interface WebtoonDetailProps {
  webtoon: WebtoonDetailDto;
}

export default function WebtoonDetail({ webtoon }: WebtoonDetailProps) {
  const { isLoggedIn } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
 
  const { loginId } = useAuth();

  useEffect(() => {
    console.log("WebtoonDetail렌더링됨",{ isLoggedIn, loginId });
    if (webtoon) {  
      if (isLoggedIn && loginId) {
        console.log("로그기록", { isLoggedIn, loginId });
        // SummaryDto로 변환
        const webtoonSummary: WebtoonSummaryDto = {
          webtoonId: webtoon.webtoonId,
          webtoonName: webtoon.webtoonName, 
          thumbnailUrl: webtoon.thumbnailUrl,
        };
        logUserActivity(loginId, webtoonSummary);
      }
    }
  }, [isLoggedIn,loginId]);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (isLoggedIn) {
        const isFav = await checkFavoriteWebtoon(webtoon.webtoonId.toString());
        setIsFavorite(isFav);
      } else {
        setIsFavorite(false); // 로그인되지 않은 경우, 기본값인 false로 설정
      }
    };

    fetchFavoriteStatus();
  }, [isLoggedIn, webtoon.webtoonId]);

  const handleFavoriteClick = () => {
    if (!isLoggedIn) {
      alert('로그인해주세요');
      return;
    }
    handleFavoriteToggle();
  };

  const handleFavoriteToggle = async () => {
    if (loading) return;
    setLoading(true);

    try {
      let success = false;
      if (isFavorite) {
        success = await deleteFavoriteWebtoon(webtoon.webtoonId.toString());
        setDialogMessage('관심 웹툰이 삭제되었습니다.');
      } else {
        success = await addFavoriteWebtoon(webtoon.webtoonId.toString());
        setDialogMessage('관심 웹툰으로 등록되었습니다.');
      }

      if (success) {
        setIsFavorite((prev) => !prev);
        setDialogOpen(true); // Dialog 열기
      }
    } catch (error) {
      console.error('관심 웹툰 추가/삭제 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Dialog 컴포넌트 */}
      <FavoriteDialog
        isOpen={dialogOpen}
        message={dialogMessage}
        onClose={() => setDialogOpen(false)}
      />

      {/* Card 컴포넌트 */}
      <Card className="w-full max-w-7xl p-6 mx-auto">
        <CardContent className="flex items-center gap-16">
          {/* 썸네일 */}
          <div className="relative flex-shrink-0">
            <img
              src={webtoon.thumbnailUrl}
              alt={`${webtoon.webtoonName} Thumbnail`}
              className="w-[400px] h-[500px] object-cover rounded-lg shadow-lg"
            />
            {/* 관심 웹툰 하트 버튼 */}
            <button
              onClick={handleFavoriteClick}
              disabled={loading}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
            >
              <Heart
                size={24}
                className={`transition-all duration-300 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                }`}
              />
            </button>
          </div>

          {/* 상세 정보 */}
          <div className="flex flex-col justify-between flex-grow h-[400px]">
            <h1 className="text-3xl font-bold mb-4">{webtoon.webtoonName}</h1>
            <p className="text-xl font-semibold mb-2">
              작가: {webtoon.authors}
            </p>
            <Badge
              variant={webtoon.finished ? 'default' : 'outline'}
              className="inline-flex items-center justify-center text-lg px-4 py-2 mb-4"
              style={{ minWidth: 'auto', width: 'fit-content' }}
            >
              {webtoon.finished ? '완결' : '연재 중'}
            </Badge>
            <p className="text-xl font-semibold mb-4">
              플랫폼: {webtoon.platform}
            </p>
            <Button
              asChild
              className="px-5 py-2 text-lg"
              style={{ minWidth: 'auto', width: 'fit-content' }}
            >
              <a
                href={webtoon.webtoonLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                바로가기
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
