'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface SearchTabProps {
  activeTab: string;
  searchQuery?: string;
  onTabChange?: (tab: string) => void;
}

/**
 * 검색 탭 컴포넌트
 * 전체, 웹툰, 사용자, 리뷰 탭을 표시하고 탭 전환 기능을 제공합니다.
 */
const SearchTab: React.FC<SearchTabProps> = ({ 
  activeTab, 
  searchQuery = '',
  onTabChange 
}) => {
  const router = useRouter();

  // 탭 변경 처리 함수
  const handleTabChange = useCallback((tab: string) => {
    if (onTabChange) {
      // 상위 컴포넌트에서 제공한 핸들러 사용
      onTabChange(tab);
    } else if (searchQuery) {
      // 기본 동작: URL 변경
      router.push(`/search?query=${encodeURIComponent(searchQuery)}&type=${tab}`);
    }
  }, [onTabChange, searchQuery, router]);

  // 탭 데이터 정의
  const tabs = [
    { id: 'all', label: '전체' },
    { id: 'webtoon', label: '웹툰명' },
    { id: 'user', label: '닉네임' },
    { id: 'review', label: '리뷰제목 및 내용' }
  ];

  return (
    <div className="border-b border-gray-200 w-full">
      <div className="flex">
        {tabs.map(tab => (
          <TabButton 
            key={tab.id}
            active={activeTab === tab.id} 
            onClick={() => handleTabChange(tab.id)}
            label={tab.label}
          />
        ))}
      </div>
    </div>
  );
};

// 탭 버튼 컴포넌트
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 text-sm font-medium text-center transition-colors ${
        active 
          ? 'border-b-2 border-black font-semibold'
          : 'text-gray-500 hover:text-gray-700'
      }`}
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </button>
  );
};

export default SearchTab;
