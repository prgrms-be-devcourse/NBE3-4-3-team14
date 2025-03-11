'use client';
import { useEffect, useState } from 'react';
import useSimilar from '@/lib/api/voting/similar';
import useVote from '@/lib/api/voting/vote';
import { Button } from '@/components/ui/button';
import { useGlobalWebSocket } from '@/lib/utils/WebSocketContext';

interface SimilarWebtoonPanelProps {
  webtoonId: number;
}

type VoteType = 'agree' | 'disagree' | null;

export default function SimilarWebtoonPanel({
  webtoonId,
}: SimilarWebtoonPanelProps) {
  const {
    similarWebtoons,
    setSimilarWebtoons,
    loading,
    error,
    fetchSimilarList,
    hasMore,
    page,
  } = useSimilar(webtoonId);

  const { sendVote, cancelVote, getVoteStatus } = useVote();
  const { voteUpdates } = useGlobalWebSocket();

  const [userVotes, setUserVotes] = useState<Record<number, VoteType>>({});

  useEffect(() => {
    if (voteUpdates && voteUpdates.content) {
      console.log('글로벌 vote 업데이트:', voteUpdates);
      const filtered = voteUpdates.content.filter(
        (vote: any) => vote.targetWebtoonId === webtoonId
      );
      setSimilarWebtoons(filtered);
    }
  }, [voteUpdates, setSimilarWebtoons, webtoonId]);

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

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="h-[60vh] overflow-y-auto p-4">
        {similarWebtoons.length > 0 ? (
          similarWebtoons.map((webtoon) => {
            const userVote = userVotes[webtoon.similarId];
            const totalVotes = webtoon.agreeCount + webtoon.disagreeCount;
            const agreePercentage =
              totalVotes > 0 ? (webtoon.agreeCount / totalVotes) * 100 : 0;

            return (
              <div
                key={webtoon.similarId}
                className="flex flex-row gap-4 border p-3 rounded-lg mb-3 shadow-sm px-4"
              >
                <img
                  src={webtoon.similarThumbnailUrl}
                  alt={`웹툰 ${webtoon.similarWebtoonId}`}
                  className="w-40 h-40 rounded object-cover"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <p className="text-base font-semibold">
                    {webtoon.similarWebtoonName}
                  </p>
                  <div className="text-sm text-gray-700 flex gap-2 items-center">
                    <span>동의: {webtoon.agreeCount}</span>
                    <span>비동의: {webtoon.disagreeCount}</span>
                    <span className="text-gray-400">|</span>
                    <span>결과: {webtoon.similarResult}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded mt-2 relative overflow-hidden">
                    {totalVotes > 0 && (
                      <div
                        className="h-2 absolute top-0 left-0 bg-green-500"
                        style={{ width: `${agreePercentage}%` }}
                      ></div>
                    )}
                    {totalVotes > 0 && agreePercentage < 100 && (
                      <div
                        className="h-2 absolute top-0 right-0 bg-red-500"
                        style={{ width: `${100 - agreePercentage}%` }}
                      ></div>
                    )}
                  </div>

                  <div className="flex justify-between px-4 mt-2">
                    <button
                      className={`text-sm px-3 py-1 rounded ${
                        userVote === 'agree'
                          ? 'bg-green-500 text-white'
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
                      onClick={() => handleVote(webtoon.similarId, 'disagree')}
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
      {/* 페이지 버튼 */}
      <div className="p-4 border-t flex justify-between">
        <Button
          disabled={page === 0}
          onClick={() => fetchSimilarList(page - 1)}
        >
          이전
        </Button>
        <Button disabled={!hasMore} onClick={() => fetchSimilarList(page + 1)}>
          다음
        </Button>
      </div>
    </div>
  );
}
