'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/common/Search/SearchBar';
import SearchTab from '@/components/common/Search/SearchTab';

interface SearchContainerProps {
  initialQuery?: string;
  initialType?: string;
  showTabs?: boolean;
  onSearch?: (query: string, type: string) => void;
  onTabChange?: (tab: string) => void;
  className?: string;
}

/**
 * 검색 컨테이너 컴포넌트
 * SearchBar와 SearchTab을 함께 제공하는 통합 컴포넌트입니다.
 * showTabs 속성으로 탭을 표시할지 여부를 결정할 수 있습니다.
 */
const SearchContainer: React.FC<SearchContainerProps> = ({
  initialQuery = '',
  initialType = 'all',
  showTabs = true,
  onSearch,
  onTabChange,
  className = ''
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // 검색 이벤트 핸들러
  const handleSearch = useCallback((query: string, type: string) => {
    setSearchQuery(query);
    
    if (onSearch) {
      onSearch(query, type);
    } else {
      router.push(`/search?query=${encodeURIComponent(query)}&type=${type || activeTab}`);
    }
  }, [router, activeTab, onSearch]);

  // 탭 변경 이벤트 핸들러
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    
    if (onTabChange) {
      onTabChange(tab);
    } else if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}&type=${tab}`);
    }
  }, [router, searchQuery, onTabChange]);

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <SearchBar
        initialQuery={searchQuery}
        initialType={activeTab}
        onSearch={handleSearch}
      />
      {showTabs && (
        <SearchTab
          activeTab={activeTab}
          searchQuery={searchQuery}
          onTabChange={handleTabChange}
        />
      )}
    </div>
  );
};

export default SearchContainer; 