import React from 'react';
import { useRouter } from 'next/navigation';

interface UpdateDeleteButtonsProps {
  onUpdate: () => void;
  onDelete: () => void;
}

const UpdateDeleteButtons: React.FC<UpdateDeleteButtonsProps> = ({
  onUpdate,
  onDelete,
}) => {
  const router = useRouter();
  const handleDelete = async () => {
    const confirmDelete = confirm('정말 삭제하시겠습니까?');
    if (confirmDelete) {
      await onDelete();
      router.back();
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={onUpdate}
        className="px-3 py-1 bg-white text-black rounded border border-gray-300"
      >
        수정
      </button>
      <button
        onClick={handleDelete}
        className="px-3 py-1 bg-black text-white rounded"
      >
        삭제
      </button>
    </div>
  );
};

export default UpdateDeleteButtons;
