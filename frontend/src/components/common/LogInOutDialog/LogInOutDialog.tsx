'use client';

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useAuth } from '@/lib/api/security/useAuth';

const LogInOutDialog = () => {
  const { isLoggedIn, handleLogin, handleLogout } = useAuth();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="write-btn">
          {isLoggedIn ? '로그아웃' : '로그인'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isLoggedIn ? '로그아웃 하시겠습니까?' : '로그인'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isLoggedIn
              ? '로그아웃하려면 아래 버튼을 클릭하세요.'
              : '카카오 로그인을 진행하려면 아래 버튼을 클릭하세요.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {isLoggedIn ? (
            <Button
              onClick={handleLogout}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              로그아웃
            </Button>
          ) : (
            <div
              onClick={handleLogin}
              className="cursor-pointer flex items-center"
            >
              <Image
                src="/assets/kakao_login_medium_wide.png"
                alt="카카오 로그인"
                width={300}
                height={45}
              />
            </div>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogInOutDialog;
