'use client';

import React from 'react';

interface ReviewInfoProps {
  actionButtons: React.ReactNode;
  viewCount: number;
  createdAt: string;
  updatedAt: string | null;
  showButtons: boolean;
}

const ReviewInfo: React.FC<ReviewInfoProps> = ({
  actionButtons,
  viewCount,
  createdAt,
  updatedAt,
  showButtons,
}) => {
  return (
    <div className="flex flex-col space-y-2 p-4 bg-gray-100 rounded-lg shadow">
      <div className="flex items-center">
        {showButtons && <div>{actionButtons}</div>}
        <p className="text-gray-600 ml-auto">조회수: {viewCount}</p>
      </div>
      <p className="text-gray-600">
        작성일자: {new Date(createdAt).toLocaleString()}
      </p>
      {/* 수정일자 (수정하지 않았다면 표시하지 않음) */}
      {updatedAt && (
        <p className="text-gray-600">
          수정일자: {new Date(updatedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default ReviewInfo;
