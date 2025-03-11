'use client';

import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { memo, useCallback, useState } from 'react';
import NavigationBar from '@/components/common/NavigationBar/NavigationBar';
import SearchContainer from '@/components/common/Search/SearchContainer';

// 동적 임포트
const SearchResults = dynamic(
  () => import('@/components/buisness/search/ReviewSearchResults'),
  { ssr: false }
);

const WebtoonSearchResults = dynamic(
  () => import('@/components/buisness/search/WebtoonSearchResults'),
  { ssr: false }
);

// 메모이제이션 처리
const MemoizedSearchResults = memo(SearchResults);
const MemoizedWebtoonSearchResults = memo(WebtoonSearchResults);

export default function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL 파라미터에서 검색어와 타입 가져오기
  const searchQuery = searchParams.get('query') || '';
  const searchType = searchParams.get('type') || 'all';
  const sortBy = searchParams.get('sort') || 'recommend';

  // 현재 활성화된 탭과 정렬 상태
  const [activeTab, setActiveTab] = useState(searchType);
  const [activeSort, setActiveSort] = useState(sortBy);

  // 검색 결과 상태
  const [hasResults, setHasResults] = useState(true);
  const [hasWebtoonResults, setHasWebtoonResults] = useState(false);

  // 검색 핸들러
  const handleSearch = useCallback(
    (query: string, type: string) => {
      if (!query.trim()) return;

      // URL 업데이트
      const params = new URLSearchParams();
      params.set('query', query);
      params.set('type', type);
      params.set('sort', activeSort);
      router.push(`/search?${params.toString()}`);

      // 탭 상태 업데이트
      setActiveTab(type);
    },
    [router, activeSort]
  );

  // 탭 변경 핸들러
  const handleTabChange = useCallback(
    (tab: string) => {
      if (tab === activeTab) return;

      // URL 업데이트
      const params = new URLSearchParams();
      params.set('query', searchQuery);
      params.set('type', tab);
      params.set('sort', activeSort);
      router.push(`/search?${params.toString()}`);

      // 탭 상태 업데이트
      setActiveTab(tab);
    },
    [searchQuery, activeTab, activeSort, router]
  );

  // 정렬 변경 핸들러
  const handleSortChange = useCallback(
    (sort: string) => {
      if (sort === activeSort) return;

      // URL 업데이트
      const params = new URLSearchParams();
      params.set('query', searchQuery);
      params.set('type', activeTab);
      params.set('sort', sort);
      router.push(`/search?${params.toString()}`);

      // 정렬 상태 업데이트
      setActiveSort(sort);
    },
    [searchQuery, activeTab, activeSort, router]
  );

  // 검색 결과 상태 업데이트 핸들러
  const handleResultsStatus = useCallback((status: boolean) => {
    setHasResults(status);
  }, []);

  // 웹툰 검색 결과 상태 업데이트 핸들러
  const handleWebtoonResultsFound = useCallback((found: boolean) => {
    setHasWebtoonResults(found);
  }, []);

  // 검색 결과 렌더링
  const renderSearchResults = () => {
    const titles = {
      all: '전체 검색 결과',
      webtoon: '웹툰명 검색 결과',
      review: '리뷰제목 및 내용 검색 결과',
      user: '닉네임 검색 결과'
    };

    return (
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">{titles[activeTab as keyof typeof titles]}</h2>
        <MemoizedSearchResults
          key={`search-${searchQuery}-${activeTab}-${activeSort}`}
          searchQuery={searchQuery}
          searchType={activeTab as 'all' | 'review' | 'webtoon' | 'user'}
          initialSort={activeSort}
          showTitle={false}
          onResultsStatus={handleResultsStatus}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchContainer
            initialQuery={searchQuery}
            initialType={activeTab}
            showTabs={true}
            onSearch={handleSearch}
            onTabChange={handleTabChange}
            className="w-full"
          />
        </div>

        {searchQuery ? (
          <div className="flex flex-col md:flex-row gap-6">
            {/* 메인 검색 결과 */}
            <div className="w-full">
              {renderSearchResults()}
            </div>
            
            {/* 웹툰 검색 결과 */}
            <div className="w-full md:w-1/3">
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-bold mb-4 text-blue-600">웹툰 검색 결과</h2>
                <MemoizedWebtoonSearchResults
                  key={`webtoon-${searchQuery}`}
                  searchQuery={searchQuery}
                  showTitle={false}
                  onResultsFound={handleWebtoonResultsFound}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">검색어를 입력해주세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
