'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AchievementCard } from '@/components/dashboard/achievements/components/achievement-card';
import { AchievementProvider } from '@/components/dashboard/achievements/context/achievements-context';
import { AchievementDialogs } from '@/components/dashboard/achievements/components/achievement-dialogs';

export default function AchievementsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Dữ liệu mẫu - trong thực tế sẽ được lấy từ API
  const achievements = [
    {
      id: '1',
      name: 'NOVICE',
      description: 'Begin your journey!',
      iconUrl: '/icons/novice.png',
      requiredPoints: 50,
    },
    {
      id: '2',
      name: 'EXPLORER',
      description: 'Discover new territories',
      iconUrl: '/icons/explorer.png',
      requiredPoints: 200,
    },
    {
      id: '3',
      name: 'MASTER',
      description: 'Become a true master',
      iconUrl: '/icons/master.png',
      requiredPoints: 500,
    },
    {
      id: '4',
      name: 'LEGEND',
      description: 'Your name will be remembered',
      iconUrl: '/icons/legend.png',
      requiredPoints: 1000,
    },
  ];

  const filteredAchievements = achievements.filter(
    (achievement) =>
      achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAchievement = () => {
    window.dispatchEvent(
      new CustomEvent('open-achievement-dialog', { detail: { type: 'add' } })
    );
  };

  return (
    <AchievementProvider>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Quản lý Thành tựu
            </h1>
            <p className="text-muted-foreground">
              Tạo và quản lý các thành tựu cho người dùng của bạn.
            </p>
          </div>
          <Button onClick={handleAddAchievement}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm thành tựu
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>

        <AchievementDialogs />
      </div>
    </AchievementProvider>
  );
}
