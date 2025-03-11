import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { fetchWebtoons } from '@/lib/api/webtoon/webtoon';
import { WebtoonDetailDto } from '@/lib/types/webtoon/WebtoonDetailDto';

interface SimilarWebtoonSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWebtoonSelect: (choiceWebtoonId: number) => void;
}

export default function SimilarWebtoonSearchModal({
  isOpen,
  onClose,
  onWebtoonSelect,
}: SimilarWebtoonSearchModalProps) {
  const [searchText, setSearchText] = useState('');
  const [webtoons, setWebtoons] = useState<WebtoonDetailDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // ✅ 웹툰 검색 API 호출
  const handleSearch = async (newPage = 0) => {
    if (!searchText.trim()) return;

    setLoading(true);
    console.log(`🔍 검색 요청: ${searchText}, 페이지: ${newPage}`);

    try {
      const result = await fetchWebtoons(newPage, 10, {
        webtoonName: searchText,
      });

      if (result && result.content) {
        console.log('📌 검색 결과:', result.content);
        setWebtoons(result.content);
        setPage(newPage);
        setHasMore(!result.isLast);
      } else {
        console.log('❌ 검색 결과 없음');
        setWebtoons([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('⚠️ 검색 오류 발생:', error);
      setWebtoons([]);
      setHasMore(false);
    }

    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] p-4 bg-white rounded-lg shadow-lg overflow-y-auto">
        <DialogTitle>유사 웹툰 추가</DialogTitle>

        {/* 검색 입력창 */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="웹툰 검색"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(0)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleSearch(0)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            검색
          </button>
        </div>

        {/* 검색 결과 표시 */}
        <div className="flex flex-col gap-4">
          {loading && <p className="text-center text-gray-500">검색 중...</p>}

          {webtoons.length > 0 ? (
            webtoons.map((webtoon) => (
              <div
                key={webtoon.webtoonId}
                className="w-full border p-4 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={webtoon.thumbnailUrl}
                    alt={webtoon.webtoonName}
                    className="w-12 h-12 rounded"
                  />
                  <span>{webtoon.webtoonName}</span>
                </div>
                <button
                  className="mt-2 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                  onClick={() => onWebtoonSelect(webtoon.webtoonId)}
                >
                  등록하기
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">검색 결과가 없습니다.</p>
          )}
        </div>

        {/* 페이지 이동 버튼 */}
        <div className="flex justify-between mt-4 gap-2">
          {/* 이전 페이지 버튼 (첫 페이지일 때 안 보이게) */}
          <button
            onClick={() => handleSearch(page - 1)}
            className={`bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition ${
              page === 0 ? 'invisible' : ''
            }`}
          >
            이전 페이지
          </button>

          {/* 다음 페이지 버튼 (마지막 페이지일 때 안 보이게) */}
          <button
            onClick={() => handleSearch(page + 1)}
            className={`bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition ${
              !hasMore ? 'invisible' : ''
            }`}
          >
            다음 페이지
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
