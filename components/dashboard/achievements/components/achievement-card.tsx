'use client';

import { Edit, Trash2, Trophy } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Achievement } from '../data/schema';

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const handleEdit = () => {
    window.dispatchEvent(
      new CustomEvent('open-achievement-dialog', {
        detail: { type: 'edit', achievement },
      })
    );
  };

  const handleDelete = () => {
    window.dispatchEvent(
      new CustomEvent('open-achievement-dialog', {
        detail: { type: 'delete', achievement },
      })
    );
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 h-24 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex items-center justify-center">
            {achievement.iconUrl ? (
              <img
                src={achievement.iconUrl || '/placeholder.svg'}
                alt={achievement.name}
                className="h-16 w-16 object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = '';
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const fallbackIcon = document.createElement('div');
                    fallbackIcon.innerHTML =
                      '<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M9 9h6"></path><path d="M9 6h6"></path></svg>';
                    parent.appendChild(fallbackIcon);
                  }
                }}
              />
            ) : (
              <Trophy className="h-16 w-16 text-amber-300" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg truncate">{achievement.name}</h3>
            <Badge
              variant="outline"
              className="bg-amber-100 text-amber-800 hover:bg-amber-200"
            >
              {achievement.requiredPoints} điểm
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {achievement.description}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEdit}
                className="h-8 w-8 p-0 hover:bg-amber-100 hover:text-amber-700 transition-colors rounded-full"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-slate-800 text-white">
              <p>Chỉnh sửa</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700 transition-colors rounded-full"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-slate-800 text-white">
              <p>Xóa</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}
