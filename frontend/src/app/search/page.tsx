'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// 동적 임포트
const SearchContent = dynamic(
  () => import('@/components/buisness/search/SearchContent'),
  { ssr: false }
);

/**
 * 검색 페이지
 */
export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">로딩 중...</div>}>
      <SearchContent />
    </Suspense>
  );
}
