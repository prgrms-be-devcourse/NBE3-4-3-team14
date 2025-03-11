'use client';

import { useAuth } from '@/lib/api/security/useAuth';
import { user } from '@/lib/api/user/user';
import NavigationBar from '@/components/common/NavigationBar/NavigationBar';
import ProfileSection from '@/components/buisness/mypage/ProfileSection';
import ExpandableDrawer from '@/components/common/ExpandableDrawer/ExpandableDrawer';
import UserDrawerTaps from '@/components/buisness/mypage/UserDrawerTaps';

const MyPage = () => {
  const { isLoggedIn, loginId, nickname, profileImage } = useAuth();
  const {
    handleNicknameChange,
    handleProfileImageChange,
    handleDeleteAccount,
    loading,
    error,
  } = user();

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl font-semibold">로그인이 필요합니다.</p>
      </div>
    );
  }

  return (
    <>
      <NavigationBar /> {/* 네비게이션 바 추가 */}
      <div className="flex flex-col items-start justify-start min-h-screen p-8">
        {/* 타이틀 */}
        <h1 className="text-3xl font-bold mb-4 mt-4">
          My Page <span className="text-gray-600">(내 정보)</span>
        </h1>
        <hr className="w-full border-gray-300 mb-6" />

        {/* 프로필 섹션 */}
        <ProfileSection
          profileImage={profileImage!}
          nickname={nickname!}
          handleNicknameChange={handleNicknameChange}
          handleProfileImageChange={handleProfileImageChange}
          handleDeleteAccount={handleDeleteAccount}
        />

        <ExpandableDrawer
          children={<UserDrawerTaps loginId={loginId as number} />}
        />

        {/* 오류 메시지 */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </>
  );
};

export default MyPage;
