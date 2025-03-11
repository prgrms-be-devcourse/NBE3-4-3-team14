'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CommentRequestDto } from '@/lib/types/reviewComment/CommentRequestDto';
import { UserDataResponseDto } from '@/lib/types/user/UserDataResponseDto';
import MentionSuggestions from './MentionSuggestions';

interface CommentAreaProps {
  onSubmit: (commentRequestDto: CommentRequestDto) => Promise<any>;
  onCancel?: () => void;
  placeholder?: string;
  initialContent?: string;
  existingUsers?: UserDataResponseDto[];
  parentCommentId?: number | null;
}

const CommentArea: React.FC<CommentAreaProps> = ({
  onSubmit,
  onCancel,
  placeholder = '댓글을 입력하세요...',
  initialContent = '',
  existingUsers = [],
  parentCommentId = null,
}) => {
  const [content, setContent] = useState(initialContent);
  const [mentions, setMentions] = useState<string[]>([]);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 멘션 검색어에 맞는 사용자 필터링
  const filteredUsers = existingUsers.filter(user =>
    user.nickname.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  // 텍스트 영역의 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const position = e.target.selectionStart;
    setContent(newContent);
    setCursorPosition(position);

    // @ 문자 이후의 텍스트 확인
    const lastAtSymbol = newContent.lastIndexOf('@', position);
    if (lastAtSymbol !== -1 && lastAtSymbol < position) {
      const searchText = newContent.slice(lastAtSymbol + 1, position);
      setMentionSearch(searchText);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  // 멘션 선택 처리
  const handleMentionSelect = (user: UserDataResponseDto) => {
    const lastAtSymbol = content.lastIndexOf('@', cursorPosition);
    const beforeMention = content.slice(0, lastAtSymbol);
    const afterMention = content.slice(cursorPosition);
    const newContent = `${beforeMention}@${user.nickname} ${afterMention}`;
    
    setContent(newContent);
    setShowMentions(false);
    setMentions([...mentions, user.nickname]);

    // 커서 위치 조정
    if (textareaRef.current) {
      const newPosition = lastAtSymbol + user.nickname.length + 2; // @ + nickname + space
      textareaRef.current.focus();
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = newPosition;
          textareaRef.current.selectionEnd = newPosition;
        }
      }, 0);
    }
  };

  // 제출 처리
  const handleSubmit = async () => {
    if (!content.trim()) return;

    const commentRequestDto: CommentRequestDto = {
      content: content.trim(),
      mentions,
      parentCommentId: parentCommentId || 0
    };

    try {
      await onSubmit(commentRequestDto);
      setContent('');
      setMentions([]);
    } catch (error) {
      console.error('댓글 작성 중 오류 발생:', error);
    }
  };

  // ESC 키로 멘션 창 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowMentions(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative space-y-2">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          placeholder={placeholder}
          className="min-h-[100px] p-4"
        />
        {showMentions && filteredUsers.length > 0 && (
          <MentionSuggestions
            users={filteredUsers}
            onSelect={handleMentionSelect}
          />
        )}
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
          >
            취소
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={!content.trim()}
        >
          등록
        </Button>
      </div>
    </div>
  );
};

export default CommentArea;
