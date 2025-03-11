'use client';

import React from 'react';

interface SortControlProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

/**
 * 정렬 컨트롤 컴포넌트
 * 추천순, 조회순, 최신순 정렬 옵션을 제공합니다.
 */
const SortControl: React.FC<SortControlProps> = ({ sortBy, onSortChange }) => {
  return (
    <div className="mb-4">
      <div className="flex gap-4 text-sm border-b border-gray-200">
        <SortButton 
          active={sortBy === 'recommend'}
          onClick={() => onSortChange('recommend')}
          label="추천순"
        />
        <SortButton 
          active={sortBy === 'viewCount'}
          onClick={() => onSortChange('viewCount')}
          label="조회순"
        />
        <SortButton 
          active={sortBy === 'recent'}
          onClick={() => onSortChange('recent')}
          label="최신순"
        />
      </div>
    </div>
  );
};

// 정렬 버튼 컴포넌트
interface SortButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

const SortButton = ({ active, onClick, label }: SortButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 ${
        active 
          ? 'font-semibold text-black border-b-2 border-black'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
    </button>
  );
};

export default SortControl; 