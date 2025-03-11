'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CallbackPage = () => {
  const router = useRouter();

  useEffect(() => {
    const lastVisitedPage = localStorage.getItem('lastVisitedPage') || '/';
    localStorage.removeItem('lastVisitedPage'); // 사용 후 제거함
    router.replace(lastVisitedPage);
  }, [router]);

  return <div>로그인 중...</div>;
};

export default CallbackPage;
