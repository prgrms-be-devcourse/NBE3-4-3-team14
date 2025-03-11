'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPopularSearchTerms, clearSearchCache } from '@/lib/api/search/api/search';
import { Loader2, Trash2 } from 'lucide-react';

interface PopularSearchTermsProps {
  onTermClick?: (term: string) => void;
  className?: string;
  minScore?: number;
  limit?: number;
  recentDays?: number;
  showRank?: boolean;
}

/**
 * 인기 검색어 목록을 표시하는 컴포넌트
 */
const PopularSearchTerms: React.FC<PopularSearchTermsProps> = ({ 
  onTermClick,
  className = '',
  minScore = 5, // 최소 인기 점수
  limit = 10, // 최대 표시 개수
  recentDays = 7, // 최근 7일 동안의 데이터
  showRank = true // 순위 표시 여부
}) => {
  const router = useRouter();
  const [popularTerms, setPopularTerms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // fetchPopularTerms 함수를 컴포넌트 레벨로 이동
  const fetchPopularTerms = async () => {
    try {
      setIsLoading(true);
      // 개선된 API 함수 호출 (minScore, limit, recentDays 파라미터 추가)
      const response = await getPopularSearchTerms(minScore, limit, recentDays);
      
      if (response && response.suggestions.length > 0) {
        setPopularTerms(response.suggestions);
      } else {
        // API에서 결과가 없으면 빈 배열 설정 (안내 메시지는 렌더링 시 표시)
        setPopularTerms([]);
      }
    } catch (err) {
      console.error('인기 검색어 조회 중 오류 발생:', err);
      setError(err instanceof Error ? err : new Error('인기 검색어를 불러오는데 실패했습니다.'));
      // 오류 발생시 빈 배열 설정
      setPopularTerms([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularTerms();
  }, [minScore, limit, recentDays]);

  const handleTermClick = (term: string) => {
    if (onTermClick) {
      onTermClick(term);
    } else {
      router.push(`/search?query=${encodeURIComponent(term)}&type=all`);
    }
  };

  const handleClearCache = async () => {
    try {
      setIsClearing(true);
      const success = await clearSearchCache();
      
      if (success) {
        alert('검색 기록이 삭제되었습니다.');
        // 인기 검색어 다시 불러오기
        fetchPopularTerms();
      } else {
        alert('검색 기록 삭제 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('캐시 삭제 중 오류 발생:', err);
      alert('검색 기록 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsClearing(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span>인기 검색어 로딩 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-500 p-4 ${className}`}>
        인기 검색어를 불러오는데 실패했습니다.
      </div>
    );
  }

  if (popularTerms.length === 0) {
    return (
      <div className={`text-gray-500 p-4 ${className}`}>
        <p>5회 이상 검색된 검색어 중, 인기순위 상위 10개만 표시됩니다.</p>
      </div>
    );
  }

  return (
    <div className={`p-4 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">인기 검색어</h3>
        <button
          onClick={handleClearCache}
          disabled={isClearing}
          className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors"
        >
          {isClearing ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              삭제 중...
            </>
          ) : (
            <>
              <Trash2 className="h-3 w-3" />
              검색기록 삭제
            </>
          )}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {popularTerms.map((term, index) => (
          <button
            key={index}
            onClick={() => handleTermClick(term)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
          >
            {showRank && <span className="font-bold text-blue-500 mr-1">{index + 1}</span>} {term}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularSearchTerms; 