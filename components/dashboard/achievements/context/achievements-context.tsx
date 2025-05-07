'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import type { Achievement } from '../data/schema';

type AchievementContextType = {
  createAchievement: (achievement: Omit<Achievement, 'id'>) => Promise<void>;
  updateAchievement: (
    id: string,
    achievement: Partial<Achievement>
  ) => Promise<void>;
  deleteAchievement: (id: string) => Promise<void>;
};

const AchievementContext = createContext<AchievementContextType | undefined>(
  undefined
);

export function AchievementProvider({ children }: { children: ReactNode }) {
  // Trong thực tế, các hàm này sẽ gọi API để thực hiện CRUD
  const createAchievement = async (achievement: Omit<Achievement, 'id'>) => {
    try {
      console.log('Creating achievement:', achievement);
      // Gọi API tạo thành tựu mới
      return Promise.resolve();
    } catch (error) {
      console.error('Error creating achievement:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tạo thành tựu mới. Vui lòng thử lại.',
        variant: 'destructive',
      });
      return Promise.reject(error);
    }
  };

  const updateAchievement = async (
    id: string,
    achievement: Partial<Achievement>
  ) => {
    try {
      console.log('Updating achievement:', id, achievement);
      // Gọi API cập nhật thành tựu
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating achievement:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thành tựu. Vui lòng thử lại.',
        variant: 'destructive',
      });
      return Promise.reject(error);
    }
  };

  const deleteAchievement = async (id: string) => {
    try {
      console.log('Deleting achievement:', id);
      // Gọi API xóa thành tựu
      return Promise.resolve();
    } catch (error) {
      console.error('Error deleting achievement:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa thành tựu. Vui lòng thử lại.',
        variant: 'destructive',
      });
      return Promise.reject(error);
    }
  };

  return (
    <AchievementContext.Provider
      value={{
        createAchievement,
        updateAchievement,
        deleteAchievement,
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error(
      'useAchievements must be used within an AchievementProvider'
    );
  }
  return context;
}
