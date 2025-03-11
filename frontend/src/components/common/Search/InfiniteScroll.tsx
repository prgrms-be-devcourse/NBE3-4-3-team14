'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface InfiniteScrollProps {
  loadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  loadingComponent?: ReactNode;
  endMessage?: ReactNode;
  threshold?: number;
  children: ReactNode;
}

/**
 * 무한 스크롤 컴포넌트
 * 스크롤이 하단에 도달하면 추가 데이터를 로드합니다.
 */
const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  loadMore,
  hasMore,
  isLoading,
  loadingComponent = (
    <div className="flex flex-col items-center py-4">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-2"></div>
      <p className="text-gray-500 text-sm">콘텐츠를 불러오는 중...</p>
    </div>
  ),
  endMessage = (
    <div className="text-center py-4 text-sm text-gray-500">
      <div className="w-full max-w-sm mx-auto border-t border-gray-200 pt-4">
        모든 결과를 불러왔습니다.
      </div>
    </div>
  ),
  threshold = 0.8,
  children,
}) => {
  // 관찰 대상이 될 요소의 ref
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // IntersectionObserver 객체 생성
    const observer = new IntersectionObserver(
      (entries) => {
        // 관찰 대상이 화면에 들어왔는지 확인
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      {
        // 화면의 얼마나 보이는지에 따라 콜백 실행 (0.8은 80% 보일 때)
        threshold: threshold,
        // rootMargin을 사용하여 미리 로드 시작 (화면 하단에서 200px 전에)
        rootMargin: '0px 0px 200px 0px',
      }
    );

    // 관찰 대상 요소가 있으면 관찰 시작
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    // 컴포넌트 언마운트 시 IntersectionObserver 해제
    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
      observer.disconnect();
    };
  }, [loadMore, hasMore, isLoading, threshold]);

  return (
    <>
      {children}
      
      {/* 관찰 대상 요소 */}
      <div ref={observerTarget} className="h-10">
        {isLoading && loadingComponent}
        {!hasMore && !isLoading && endMessage}
      </div>
    </>
  );
};

export default InfiniteScroll; 