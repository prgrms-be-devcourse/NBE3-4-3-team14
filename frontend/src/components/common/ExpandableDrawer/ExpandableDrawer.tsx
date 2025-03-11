'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/utils';

const ExpandableDrawer = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleClick = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className={cn('fixed inset-x-0 bottom-0 z-50', className)} {...props}>
      <div
        className={`flex flex-col rounded-t-[10px] border bg-background p-1 transition-all duration-300 ${
          isExpanded ? 'h-[80vh]' : 'h-[300px]'
        }`}
      >
        <div className="w-full" onClick={handleClick}>
          <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
        </div>
        <div className="p-3">{children}</div>
      </div>
    </div>
  );
};

export default ExpandableDrawer;
