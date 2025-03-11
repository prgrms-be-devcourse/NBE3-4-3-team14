'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CommentArea from './CommentArea';
import { UserDataResponseDto } from '@/lib/types/user/UserDataResponseDto';
import { CommentResponseDto } from '@/lib/types/reviewComment/CommentResponseDto';
import { CommentContainer } from '@/components/ui/comment-container';
import { CommentHeader } from '@/components/ui/comment-header';
import { CommentContent } from '@/components/ui/comment-content';
import { formatDate } from '@/lib/utils/formatDate';
import { CommentRequestDto } from '@/lib/types/reviewComment/CommentRequestDto';

interface NestedCommentItemProps {
  comment: CommentResponseDto;
  currentUserId: number;
  existingUsers?: UserDataResponseDto[];
  onEdit: (commentId: number, commentRequestDto: CommentRequestDto) => Promise<CommentResponseDto | null>;
  onDelete: (commentId: number) => Promise<void>;
  isLoggedIn: boolean;
}

const NestedCommentItem = ({
  comment,
  currentUserId,
  existingUsers = [],
  onEdit,
  onDelete,
  isLoggedIn
}: NestedCommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = async (commentRequestDto: CommentRequestDto): Promise<CommentResponseDto | null> => {
    if (!commentRequestDto.content.trim()) return null;
    try {
      const updatedComment = await onEdit(comment.commentId, commentRequestDto);
      if (updatedComment) {
        setIsEditing(false);
      }
      return updatedComment;
    } catch (error) {
      console.error("❌ 대댓글 수정 중 오류 발생:", error);
      return null;
    }
  };

  const handleDelete = async (): Promise<void> => {
    try {
      await onDelete(comment.commentId);
    } catch (error) {
      console.error("❌ 대댓글 삭제 중 오류 발생:", error);
    }
  };

  const formattedDate = formatDate(comment.createdAt);
  const isModified = comment.modifiedAt
    ? new Date(comment.modifiedAt).getTime() > new Date(comment.createdAt).getTime()
    : false;

  return (
    <div className="ml-6 border-l-2 pl-4">
      <CommentContainer>
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
                <div className="flex items-center space-x-2 mt-2">
                  {isLoggedIn && comment.user.userid === currentUserId && (
                    <>
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
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </CommentContainer>
    </div>
  );
};

export default NestedCommentItem;
