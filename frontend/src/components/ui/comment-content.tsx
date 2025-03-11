import { cn } from '@/lib/utils/utils';
import { HTMLAttributes } from 'react';

interface CommentContentProps extends HTMLAttributes<HTMLDivElement> {
  content: string;
  mentions?: string[];
}

export function CommentContent({
  className,
  content,
  mentions = [],
  ...props
}: CommentContentProps) {
  const renderContent = () => {
    if (!content) return null;
  
    // 공백이 포함된 멘션을 처리하기 위한 정규식
    const parts = content.split(/(@\S+)/g).filter(Boolean);
    
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        const nickname = part.slice(1).replace('\u200B', '').trim(); // @ 제거 및 제로 위드 스페이스 제거
        const isMentioned = mentions && mentions.includes(nickname);
        
        return (
          <span
            key={index}
            className={cn(
              isMentioned 
                ? "inline-flex items-center bg-blue-50 text-blue-600 font-semibold rounded px-1.5 py-0.5 mx-0.5" 
                : "text-gray-900"
            )}
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div
      className={cn('mt-2 text-sm text-foreground/90 whitespace-pre-wrap', className)}
      {...props}
    >
      {renderContent()}
    </div>
  );
}