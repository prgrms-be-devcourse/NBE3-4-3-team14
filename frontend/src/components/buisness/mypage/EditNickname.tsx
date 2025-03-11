'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

interface EditNicknameProps {
  nickname: string;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  handleNicknameChange: (
    nickname: string,
    callback: (newNickname: string) => void
  ) => void;
}

const EditNickname: React.FC<EditNicknameProps> = ({
  nickname,
  isEditing,
  setIsEditing,
  handleNicknameChange,
}) => {
  const [newNickname, setNewNickname] = useState(nickname || '');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSaveNickname = () => {
    if (newNickname.trim() === '') return alert('닉네임을 입력하세요.');
    handleNicknameChange(newNickname, setNewNickname);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        {!isEditing ? (
          <>
            <p className="text-lg font-medium mr-4">닉네임: {nickname}</p>
            <Button variant="ghost" size="icon" onClick={handleEditClick}>
              <Pencil size={16} />
              <span>수정</span>
            </Button>
          </>
        ) : (
          <>
            <Input
              ref={inputRef}
              type="text"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              className="border rounded px-2 py-1"
            />
            <Button
              onClick={handleSaveNickname}
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              저장
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default EditNickname;
