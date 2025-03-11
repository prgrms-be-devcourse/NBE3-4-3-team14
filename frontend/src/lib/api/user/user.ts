import { useState } from 'react';
import API_BASE_URL from '@/lib/utils/apiConfig';

export const user = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 닉네임 변경 및 상태 업데이트
  const handleNicknameChange = async (
    newNickname: string,
    setNewNickname: (value: string) => void
  ) => {
    if (newNickname.trim() === '') return alert('닉네임을 입력하세요.');
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/user/nickname`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nickname: newNickname }),
      });
      if (!response.ok) throw new Error('닉네임 변경 실패');
      await response.json();
      setNewNickname('');
      alert('닉네임이 변경되었습니다.');
      window.location.reload();
    } catch (err) {
      setError('닉네임 변경 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 프로필 이미지 변경 및 상태 업데이트
  const handleProfileImageChange = async (
    selectedFile: File | null,
    setSelectedFile: (value: File | null) => void
  ) => {
    if (!selectedFile) return alert('이미지를 선택하세요.');
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`${API_BASE_URL}/user/profileImage`, {
        method: 'PATCH',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) throw new Error('프로필 이미지 변경 실패');
      await response.json();
      setSelectedFile(null);
      alert('프로필 이미지가 변경되었습니다.');
      window.location.reload();
    } catch (err) {
      setError('프로필 이미지 변경 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('정말로 계정을 삭제하시겠습니까?')) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/user/users`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('계정 삭제 실패');
      alert('계정이 삭제되었습니다.');
      window.location.href = '/'; // 홈으로 이동 (또는 로그인 페이지)
    } catch (err) {
      setError('계정 삭제 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleNicknameChange,
    handleProfileImageChange,
    handleDeleteAccount,
    loading,
    error,
  };
};
