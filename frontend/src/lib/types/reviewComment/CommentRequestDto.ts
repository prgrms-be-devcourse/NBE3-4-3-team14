export interface CommentRequestDto {
  content: string;
  parentCommentId: number;
  mentions: string[];
}
