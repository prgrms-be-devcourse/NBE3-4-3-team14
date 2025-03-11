'use client';
import { useEffect, useState } from 'react';
import useSimilar from '@/lib/api/voting/similar';
import useVote from '@/lib/api/voting/vote';
import { Button } from '@/components/ui/button';
import SimilarWebtoonSearchModal from '@/components/common/SimilarWebtoonSearchModal/SimilarWebtoonSearchModal';
import { useGlobalWebSocket } from '@/lib/utils/WebSocketContext';

interface SimilarWebtoonPanelProps {
  isOpen: boolean;
  onClose: () => void;
  webtoonId: number;
}

type VoteType = 'agree' | 'disagree' | null;

export default function SimilarWebtoonPanel({
  isOpen,
  onClose,
  webtoonId,
}: SimilarWebtoonPanelProps) {
  const {
    similarWebtoons,
    setSimilarWebtoons,
    createSimilar,
    deleteSimilar,
    loading,
    error,
    fetchSimilarList,
    hasMore,
    page,
  } = useSimilar(webtoonId);

  const { sendVote, cancelVote, getVoteStatus } = useVote();
  const { voteUpdates } = useGlobalWebSocket();

  const [userVotes, setUserVotes] = useState<Record<number, VoteType>>({});
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // 패널 열릴 때 한 번만 목록 조회
  useEffect(() => {
    if (isOpen) {
      fetchSimilarList();
    }
  }, [isOpen]);

  // WebSocket 업데이트
  useEffect(() => {
    if (voteUpdates && voteUpdates.content) {
      console.log('글로벌 vote 업데이트:', voteUpdates);
      const filtered = voteUpdates.content.filter(
        (vote: any) => vote.targetWebtoonId === webtoonId
      );
      setSimilarWebtoons(filtered);
    }
  }, [voteUpdates, setSimilarWebtoons, webtoonId]);

  // 투표 상태 조회
  useEffect(() => {
    similarWebtoons.forEach((webtoon) => {
      if (userVotes[webtoon.similarId] === undefined) {
        (async () => {
          const statusResponse = await getVoteStatus(webtoon.similarId);
          setUserVotes((prev) => ({
            ...prev,
            [webtoon.similarId]: statusResponse?.voteType
              ? (statusResponse.voteType.toLowerCase() as VoteType)
              : null,
          }));
        })();
      }
    });
  }, [similarWebtoons, getVoteStatus]);

  // 투표/취소 로직
  const handleVote = async (similarId: number, vote: 'agree' | 'disagree') => {
    try {
      const currentVote = userVotes[similarId];
      if (currentVote === vote) {
        const res = await cancelVote(similarId);
        if (res?.status === 200) {
          setUserVotes((prev) => ({ ...prev, [similarId]: null }));
        }
      } else {
        const res = await sendVote(similarId, vote);
        if (res?.status === 200) {
          setUserVotes((prev) => ({ ...prev, [similarId]: vote }));
        }
      }
    } catch (err) {
      console.error('투표 요청 실패:', err);
    }
  };

  // 유사 웹툰 등록
  const handleRegisterSimilar = async (choiceWebtoonId: number) => {
    await createSimilar(choiceWebtoonId);
    setIsSearchModalOpen(false);
  };

  // 패널 스타일 (폭: 400px로 확대, 기본 글자 크기 text-base)
  const panelStyle = `
    fixed top-0 right-0 
    h-full w-[400px] 
    bg-white border-l border-gray-300 shadow-lg 
    transform transition-transform duration-300
    text-base
    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
  `;

  return (
    <div className={panelStyle} style={{ zIndex: 9999 }}>
      <div className="relative h-full flex flex-col">
        {/* 패널 헤더 */}
        <h2 className="text-xl font-bold p-4 border-b">유사 웹툰 목록</h2>
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-lg"
          onClick={onClose}
        >
          ✖
        </button>

        {/* 로딩/에러 */}
        {loading && (
          <p className="text-center text-gray-600 mt-4">로딩 중...</p>
        )}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        {/* 목록 */}
        <div className="flex-1 overflow-y-auto p-4">
          {similarWebtoons.length > 0 ? (
            similarWebtoons.map((webtoon) => {
              const userVote = userVotes[webtoon.similarId];
              return (
                <div
                  key={webtoon.similarId}
                  className="flex items-center gap-4 border p-3 rounded-lg mb-3 shadow-sm"
                >
                  {/* 썸네일 (조금 더 크게) */}
                  <img
                    src={webtoon.similarThumbnailUrl}
                    alt={`웹툰 ${webtoon.similarWebtoonId}`}
                    className="w-20 h-20 rounded object-cover"
                  />

                  {/* 정보 영역 */}
                  <div className="flex-1 flex flex-col">
                    <p className="text-base font-semibold mb-2">
                      {webtoon.similarWebtoonName}
                    </p>
                    <div className="text-sm text-gray-700 flex gap-2 items-center">
                      <span>동의: {webtoon.agreeCount}</span>
                      <span>비동의: {webtoon.disagreeCount}</span>
                      <span className="text-gray-400">|</span>
                      <span>결과: {webtoon.similarResult}</span>
                    </div>
                    {userVote === 'agree' && (
                      <p className="text-blue-500 text-sm mt-1">
                        내 투표: 동의
                      </p>
                    )}
                    {userVote === 'disagree' && (
                      <p className="text-red-500 text-sm mt-1">
                        내 투표: 비동의
                      </p>
                    )}
                  </div>

                  {/* 액션 버튼들 */}
                  <div className="flex flex-col gap-2 items-center">
                    <button
                      className="text-red-500 hover:text-red-700 transition text-lg"
                      onClick={() => deleteSimilar(webtoon.similarId)}
                    >
                      ❌
                    </button>

                    <div className="flex gap-1">
                      <button
                        className={`text-sm px-3 py-1 rounded ${
                          userVote === 'agree'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-black'
                        }`}
                        onClick={() => handleVote(webtoon.similarId, 'agree')}
                      >
                        👍
                      </button>
                      <button
                        className={`text-sm px-3 py-1 rounded ${
                          userVote === 'disagree'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 text-black'
                        }`}
                        onClick={() =>
                          handleVote(webtoon.similarId, 'disagree')
                        }
                      >
                        👎
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 mt-4">
              등록된 유사 웹툰이 없습니다.
            </p>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-between items-center p-4 border-t">
          <Button
            disabled={page === 0}
            onClick={() => fetchSimilarList(page - 1)}
            className="mr-2"
          >
            이전
          </Button>
          <Button
            disabled={!hasMore}
            onClick={() => fetchSimilarList(page + 1)}
            className="mr-auto"
          >
            다음
          </Button>
          <Button onClick={() => setIsSearchModalOpen(true)}>+ 추가</Button>
        </div>
      </div>

      {/* 유사 웹툰 검색 모달 */}
      {isSearchModalOpen && (
        <SimilarWebtoonSearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          onWebtoonSelect={handleRegisterSimilar}
        />
      )}
    </div>
  );
}
