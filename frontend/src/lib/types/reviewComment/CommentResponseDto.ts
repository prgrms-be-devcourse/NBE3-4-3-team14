import { UserDataResponseDto } from '@/lib/types/user/UserDataResponseDto';

export interface CommentResponseDto {
  user: UserDataResponseDto;
  commentId: number;
  content: string;
  createdAt: string; // LocalDateTime → ISO 8601 문자열
  modifiedAt: string;
  parentId: number | null;
  mentions: string[];
  childComments: CommentResponseDto[];
}
