'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import type { Achievement } from '../data/schema';

interface AchievementDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievement: Achievement;
  onDelete: (id: string) => void;
}

export function AchievementDeleteDialog({
  open,
  onOpenChange,
  achievement,
  onDelete,
}: AchievementDeleteDialogProps) {
  const handleDelete = () => {
    onDelete(achievement.id);
    onOpenChange(false);
    toast({
      title: 'Đã xóa thành tựu',
      description: `Thành tựu "${achievement.name}" đã được xóa thành công.`,
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này sẽ xóa vĩnh viễn thành tựu "{achievement.name}" và
            không thể khôi phục.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
