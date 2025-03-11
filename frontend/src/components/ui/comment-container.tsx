import { cn } from '@/lib/utils/utils';
import { HTMLAttributes } from 'react';

interface CommentContainerProps extends HTMLAttributes<HTMLDivElement> {}

export function CommentContainer({
  className,
  children,
  ...props
}: CommentContainerProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-4 text-card-foreground shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
