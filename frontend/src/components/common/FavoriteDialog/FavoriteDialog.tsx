'use client';

import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface FavoriteDialogProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const FavoriteDialog = ({ isOpen, message, onClose }: FavoriteDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
      <AlertDialogContent className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/3 bg-white rounded-lg shadow-lg p-6 w-96">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold">
            알림
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-700 mt-2">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex justify-end">
          <Button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            확인
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FavoriteDialog;
