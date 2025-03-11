import { UserDataResponseDto } from '@/lib/types/user/UserDataResponseDto';
import { CommentResponseDto } from '@/lib/types/reviewComment/CommentResponseDto';
import { CommentRequestDto } from '@/lib/types/reviewComment/CommentRequestDto';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: CommentResponseDto[];
  currentUserId: number;
  onEdit: (commentId: number, commentRequestDto: CommentRequestDto) => Promise<CommentResponseDto | null>;
  onDelete: (commentId: number) => Promise<void>;
  onReply: (commentRequestDto: CommentRequestDto) => Promise<CommentResponseDto | null>;
  existingUsers?: UserDataResponseDto[];
  error?: string | null;
  isLoading?: boolean;
  isLoggedIn: boolean;
}
/**
 * TODO[O]: 로그인상태가 아니라면 답글/수정/삭제가 안되어야함
 * TODO[O]: 댓글 작성 시 멘션 기능 구현 
 * TODO: 에러시에 각 Snackbar or Toast UI 구현
 */
const CommentList = ({
  comments,
  currentUserId,
  onEdit,
  onDelete,
  onReply,
  existingUsers = [],
  error,
  isLoading,
  isLoggedIn
}: CommentListProps) => {
  if (isLoading) {
    return <div className="text-center text-gray-500">댓글을 불러오는 중...</div>;
  }

  if (!comments || comments.length === 0) {
    return <div className="text-center text-gray-500">아직 댓글이 없습니다.</div>;
  }

  // ✅ 루트 댓글만 필터링하여 전달 (백엔드가 이미 childComments를 포함하여 응답을 줌)
  const rootComments = comments.filter(comment => !comment.parentId || comment.parentId === 0);

  return (
    <div className="space-y-6">
      {
      (Boolean(error)&&<div className="text-center text-red-500 p-4 rounded-lg bg-red-50">
        {error}
      </div>)}
      {rootComments.map((comment) => (
        <CommentItem
          key={comment.commentId}
          comment={comment}
          currentUserId={currentUserId}
          onEdit={onEdit}
          onDelete={onDelete}
          onReply={onReply}
          existingUsers={existingUsers}
          isLoggedIn={isLoggedIn}
        />
      ))}
    </div>
  );
};

export default CommentList;
