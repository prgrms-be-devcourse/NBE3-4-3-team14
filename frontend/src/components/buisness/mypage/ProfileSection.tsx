'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import EditNickname from './EditNickname';

interface ProfileSectionProps {
  profileImage: string;
  nickname: string;
  handleNicknameChange: (
    nickname: string,
    callback: (newNickname: string) => void
  ) => void;
  handleProfileImageChange: (
    file: File,
    setSelectedFile: (value: File | null) => void
  ) => void;
  handleDeleteAccount: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  profileImage,
  nickname,
  handleNicknameChange,
  handleProfileImageChange,
  handleDeleteAccount,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // 파일 선택 시 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file)); // 미리보기 기능
    }
  };

  // 이미지 업로드 버튼 클릭 시
  const handleUploadClick = () => {
    if (!selectedFile) return alert('이미지를 선택하세요!');
    handleProfileImageChange(selectedFile, setSelectedFile);
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-6">
        {/* 프로필 이미지 */}
        <div className="relative">
          <img
            src={previewImage || profileImage} // 변경 전 미리보기 표시
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />
          <Button
            variant="outline"
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs px-1 py-1"
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            변경
          </Button>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* 업로드 버튼 */}
        {selectedFile && (
          <Button
            onClick={handleUploadClick}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            업로드
          </Button>
        )}

        {/* 닉네임 변경 */}
        <EditNickname
          nickname={nickname}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleNicknameChange={handleNicknameChange}
        />
      </div>

      {/* 계정 삭제 버튼 */}
      <Button
        onClick={handleDeleteAccount}
        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
      >
        계정 삭제
      </Button>
    </div>
  );
};

export default ProfileSection;
