'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CommentArea from './CommentArea';
import { CommentRequestDto } from '@/lib/types/reviewComment/CommentRequestDto';
import { CommentResponseDto } from '@/lib/types/reviewComment/CommentResponseDto';
import { UserDataResponseDto } from '@/lib/types/user/UserDataResponseDto';
import { CommentContainer } from '@/components/ui/comment-container';
import { CommentHeader } from '@/components/ui/comment-header';
import { CommentContent } from '@/components/ui/comment-content';
import { formatDate } from '@/lib/utils/formatDate';
import NestedCommentItem from './NestedCommentItem';

interface CommentItemProps {
  comment: CommentResponseDto;
  currentUserId: number;
  existingUsers?: UserDataResponseDto[];
  onEdit: (commentId: number, commentRequestDto: CommentRequestDto) => Promise<CommentResponseDto | null>;
  onDelete: (commentId: number) => Promise<void>;
  onReply?: (commentRequestDto: CommentRequestDto) => Promise<CommentResponseDto | null>;
  isLoggedIn: boolean;
}

const CommentItem = ({
  comment,
  currentUserId,
  existingUsers = [],
  onEdit,
  onDelete,
  onReply,
  isLoggedIn
}: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const handleEdit = async (commentRequestDto: CommentRequestDto): Promise<CommentResponseDto | null> => {
    if (!commentRequestDto.content.trim()) return null;
    try {
      const updatedComment = await onEdit(comment.commentId, commentRequestDto);
      setIsEditing(false);
      return updatedComment;
    } catch (error) {
      console.error("❌ 댓글 수정 중 오류 발생:", error);
      return null;
    }
  };

  const handleCreate = async (commentRequestDto: CommentRequestDto): Promise<CommentResponseDto | null> => {
    if (!onReply) return null;
    try {
      const newComment = await onReply(commentRequestDto);
      if (newComment) {
        setIsReplying(false);
      }
      return newComment;
    } catch (error) {
      console.error("❌ 댓글 작성 중 오류 발생:", error);
      return null;
    }
  };

  const handleDelete = async (): Promise<void> => {
    try {
      await onDelete(comment.commentId);
    } catch (error) {
      console.error("❌ 댓글 삭제 중 오류 발생:", error);
    }
  };

  const formattedDate = formatDate(comment.createdAt);
  const isModified = comment.modifiedAt
    ? new Date(comment.modifiedAt).getTime() > new Date(comment.createdAt).getTime()
    : false;

  // 대댓글이 아닌 경우에만 메인 댓글 컴포넌트를 렌더링
  if (!comment.parentId) {
    return (
      <div className="space-y-4">
        <CommentContainer>
          <div className="flex flex-col">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <img
                  src={comment.user.profileImage || '/images/default-profile.png'}
                  alt={`${comment.user.nickname}의 프로필`}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <CommentHeader 
                  author={comment.user.nickname} 
                  timestamp={formattedDate}
                  isModified={isModified}
                />  

                {isEditing ? (
                  <CommentArea
                    onSubmit={handleEdit}
                    onCancel={() => setIsEditing(false)}
                    initialContent={comment.content}
                    existingUsers={existingUsers}
                    parentCommentId={comment.parentId}
                  />
                ) : ( 
                  <>
                    <CommentContent 
                      content={comment.content} 
                      mentions={comment.mentions || []} 
                    />
                    {isLoggedIn?<div className="flex items-center space-x-2 mt-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsReplying(!isReplying)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        답글
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsEditing(true)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        수정
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDelete}
                        className="text-red-500 hover:text-red-600"
                      >
                        삭제
                      </Button>
                    </div>:undefined}
                  </>
                )}
              </div>
            </div>
          </div>
        </CommentContainer>

        {isReplying && (
          <div className="ml-6">
            <CommentArea
              onSubmit={handleCreate}
              onCancel={() => setIsReplying(false)}
              placeholder="답글을 입력하세요."
              existingUsers={existingUsers}
              parentCommentId={comment.commentId}
            />
          </div>
        )}

        {comment.childComments.length > 0 && (
          <div className="ml-4 space-y-4">
            {comment.childComments.map((reply) => (
              <NestedCommentItem
                key={reply.commentId}
                comment={reply}
                currentUserId={currentUserId}
                onEdit={onEdit}
                onDelete={onDelete}
                existingUsers={existingUsers}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // 대댓글인 경우 NestedCommentItem을 사용
  return (
    <NestedCommentItem
      comment={comment}
      currentUserId={currentUserId}
      onEdit={onEdit}
      onDelete={onDelete}
      existingUsers={existingUsers}
      isLoggedIn={isLoggedIn}
    />
  );
};

export default CommentItem;
