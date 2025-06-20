'use client';

import { Button } from '@/components/ui/button';
import { useAchievements } from '../context/achievements-context';
import { Plus, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';

export function AchievementPrimaryButtons() {
  const { setOpen, refetch } = useAchievements();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { t } = useLanguage();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="h-9"
      >
        <RefreshCw
          className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
        />
        {t('achievementRefresh')}
      </Button>
      <Button
        onClick={() => setOpen('add')}
        className="h-9 bg-primary hover:bg-primary/90"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t('achievementAdd')}
      </Button>
    </div>
  );
}
