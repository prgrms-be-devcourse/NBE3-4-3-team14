'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 페이지 이동을 위해 추가
import { useAuth } from '@/lib/api/security/useAuth';
import LogInOutDialog from '../LogInOutDialog/LogInOutDialog';
import { usePathname } from 'next/navigation';
import { HIDDEN_ELEMENTS } from './hiddenElements';
import WriteReviewModal from '@/components/common/ReviewWriteModal/ReviewWriteModal';
import { Button } from '@/components/ui/button';

const NavigationBar: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const router = useRouter(); // 페이지 이동을 위한 useRouter 훅
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* 로고 */}
      <Link href="/" className="flex items-center">
        <img src="/assets/logo.svg" alt="Webty Logo" className="h-10 w-auto" />
      </Link>

      {/* 버튼 그룹 */}
      <div className="nav-buttons">
        {!HIDDEN_ELEMENTS.writeButton.some((route) =>
          pathname.startsWith(route)
        ) &&
          isLoggedIn && (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="mx-5 write-btn"
            >
              글 작성
            </Button>
          )}

        {isLoggedIn && (
          <Link href="/mypage">
            <Button variant="ghost">마이페이지</Button>
          </Link>
        )}

        <LogInOutDialog />
      </div>
      <WriteReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </nav>
  );
};

export default NavigationBar;
