import { useState, useEffect } from 'react';
import API_BASE_URL from '@/lib/utils/apiConfig';

const socialLoginForKaKaoUrl = `${API_BASE_URL}/oauth2/authorization/kakao`;
const redirectUrlAfterSocialLogin = 'http://localhost:3000';
const socialLogoutUrl = `${API_BASE_URL}/logout`;

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loginId, setId] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/user/info`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Not logged in');
      })
      .then((data) => {
        setIsLoggedIn(true);
        setId(data.userid);
        setNickname(data.nickname);
        setProfileImage(data.profileImage);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setId(null);
        setNickname(null);
        setProfileImage(null);
      });
  }, []);

  const handleLogin = (): void => {
    const currentUrl = window.location.href; // 현재 URL 저장
    localStorage.setItem('lastVisitedPage', currentUrl);
    window.location.href = socialLoginForKaKaoUrl;
  };

  const handleLogout = (): void => {
    fetch(socialLogoutUrl, {
      method: 'GET',
      credentials: 'include',
    })
      .then(() => {
        setIsLoggedIn(false);
        window.location.href = redirectUrlAfterSocialLogin;
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  return {
    isLoggedIn,
    loginId,
    nickname,
    profileImage,
    handleLogin,
    handleLogout,
  };
};
