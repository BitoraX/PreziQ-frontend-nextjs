'use client';

import { useEffect, useState } from 'react';
import { AchievementActionDialog } from './achievement-action-dialog';
import { AchievementDeleteDialog } from './achievement-delete-dialog';
import type { Achievement } from '../data/schema';
import { useAchievements } from '../context/achievements-context';

export function AchievementDialogs() {
  const { createAchievement, updateAchievement, deleteAchievement } =
    useAchievements();
  const [dialogState, setDialogState] = useState<{
    type: 'add' | 'edit' | 'delete' | null;
    achievement: Achievement | null;
  }>({
    type: null,
    achievement: null,
  });

  useEffect(() => {
    const handleOpenDialog = (e: Event) => {
      const customEvent = e as CustomEvent;
      setDialogState({
        type: customEvent.detail.type,
        achievement: customEvent.detail.achievement || null,
      });
    };

    window.addEventListener('open-achievement-dialog', handleOpenDialog);
    return () => {
      window.removeEventListener('open-achievement-dialog', handleOpenDialog);
    };
  }, []);

  const handleCloseDialog = () => {
    setDialogState({ type: null, achievement: null });
  };

  return (
    <>
      <AchievementActionDialog
        open={dialogState.type === 'add'}
        onOpenChange={(open) => !open && handleCloseDialog()}
        onSubmit={createAchievement}
      />

      {dialogState.achievement && (
        <>
          <AchievementActionDialog
            open={dialogState.type === 'edit'}
            onOpenChange={(open) => !open && handleCloseDialog()}
            achievement={dialogState.achievement}
            onSubmit={(values) =>
              updateAchievement(dialogState.achievement!.id, values)
            }
            isEdit
          />

          <AchievementDeleteDialog
            open={dialogState.type === 'delete'}
            onOpenChange={(open) => !open && handleCloseDialog()}
            achievement={dialogState.achievement}
            onDelete={deleteAchievement}
          />
        </>
      )}
    </>
  );
}
