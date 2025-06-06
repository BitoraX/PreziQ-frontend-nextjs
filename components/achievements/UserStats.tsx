import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Badge as BadgeIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { levels } from './data';
import { cn } from '@/lib/utils';

interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  unlocked: boolean;
  progress: number;
  date?: string;
  points: number;
  type: string;
  color: string;
  icon: any;
}

interface UserStatsProps {
  achievements: Achievement[];
}

const UserStats = ({ achievements }: UserStatsProps) => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<{
    level: number;
    name: string;
    points: number;
    color: string;
  } | null>(null);
  const [progress, setProgress] = useState(0);
  const [nextLevel, setNextLevel] = useState<{
    level: number;
    name: string;
    points: number;
    color: string;
  } | null>(null);

  useEffect(() => {
    // Tính tổng điểm
    const points = achievements.reduce((sum, achievement) => {
      if (achievement.unlocked) {
        return sum + achievement.points;
      }
      return sum;
    }, 0);
    setTotalPoints(points);

    // Xác định cấp độ hiện tại và cấp độ tiếp theo
    let current = levels[0];
    let next = levels[1];

    for (let i = levels.length - 1; i >= 0; i--) {
      if (points >= levels[i].points) {
        current = levels[i];
        next =
          i < levels.length - 1 ? levels[i + 1] : levels[levels.length - 1];
        break;
      }
    }

    setCurrentLevel(current);
    setNextLevel(next);

    // Tính phần trăm tiến độ đến cấp độ tiếp theo
    if (next && next.points !== current.points) {
      const levelProgress =
        ((points - current.points) / (next.points - current.points)) * 100;
      setProgress(levelProgress);
    } else {
      setProgress(100);
    }
  }, [achievements]);

  // Animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <motion.div
      className='lg:col-span-8 rounded-xl border shadow-md dark:shadow-primary/5 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900/80 p-6 relative overflow-hidden'
      variants={itemVariants}
      initial='hidden'
      animate='visible'
    >
      {/* Glowing background elements */}
      <div className='absolute top-0 left-1/4 w-24 h-24 bg-primary/10 rounded-full filter blur-xl opacity-60' />
      <div className='absolute bottom-0 right-1/4 w-32 h-32 bg-yellow-500/10 rounded-full filter blur-xl opacity-60' />

      <div className='flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 relative'>
        <div className='flex-shrink-0'>
          {currentLevel && (
            <div className='relative group'>
              <div className='absolute inset-0 bg-gradient-to-r from-primary to-primary-foreground opacity-50 blur-md rounded-full animate-pulse' />
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white relative overflow-hidden group-hover:scale-105 transition-transform ${currentLevel.color}`}
              >
                <div className='absolute top-0 left-0 right-0 h-1/2 bg-white/20' />
                <div className='z-10 flex flex-col items-center justify-center'>
                  <span className='text-3xl font-bold font-mono'>
                    {currentLevel.level}
                  </span>
                  <span className='text-xs font-medium uppercase tracking-wider text-white/80'>
                    Level
                  </span>
                </div>
              </div>

              {/* Pulse animation ring */}
              <motion.div
                className='absolute inset-0 rounded-full opacity-30'
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: 'easeInOut',
                }}
                style={{
                  backgroundColor: currentLevel.color.split('-')[1],
                }}
              />
            </div>
          )}
        </div>
        <div className='flex-grow'>
          <div className='flex flex-wrap items-center gap-2 mb-2'>
            <h3 className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground'>
              {currentLevel?.name}
            </h3>
            {currentLevel?.level && currentLevel.level >= 3 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
              >
                <Badge
                  variant='outline'
                  className='ml-2 bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1'
                >
                  <span className='mr-1'>✦</span> VIP
                </Badge>
              </motion.div>
            )}
          </div>
          <p className='text-muted-foreground mb-4 flex items-center'>
            <span className='mr-2'>Total points:</span>
            <span className='font-mono font-semibold text-xl text-primary'>
              {totalPoints.toLocaleString()}
            </span>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className='ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full'
            >
              +125 this week
            </motion.span>
          </p>

          {nextLevel && nextLevel.points !== currentLevel?.points ? (
            <div className='w-full bg-card p-4 rounded-xl border shadow-sm'>
              <div className='flex justify-between text-sm mb-2 font-medium'>
                <span className='flex items-center'>
                  <span className='w-3 h-3 bg-primary rounded-full mr-2 animate-pulse'></span>
                  Level {currentLevel?.level}
                  <span className='mx-1 text-muted-foreground'>•</span>
                  {currentLevel?.points} points
                </span>
                <span className='flex items-center'>
                  Level {nextLevel?.level}
                  <span className='mx-1 text-muted-foreground'>•</span>
                  {nextLevel?.points} points
                  <span className='w-3 h-3 bg-primary/50 rounded-full ml-2'></span>
                </span>
              </div>
              <div className='relative h-3 bg-muted rounded-full overflow-hidden'>
                <motion.div
                  className='absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-primary-foreground rounded-full'
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{
                    duration: 1.5,
                    delay: 0.5,
                    ease: 'easeOut',
                  }}
                />
                <motion.div
                  className='absolute left-0 top-0 h-full w-full bg-white opacity-20'
                  animate={{
                    x: ['0%', '100%'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </div>
              <div className='mt-2 flex justify-between items-center'>
                <p className='text-xs text-muted-foreground'>
                  Need{' '}
                  <span className='font-semibold text-primary'>
                    {(nextLevel?.points - totalPoints).toLocaleString()}
                  </span>{' '}
                  more points to reach the next level
                </p>
                <p className='text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full'>
                  {progress.toFixed(0)}% Complete
                </p>
              </div>
            </div>
          ) : (
            <div className='w-full bg-card p-4 rounded-xl border shadow-sm'>
              <div className='flex items-center justify-center'>
                <span className='text-sm font-medium text-primary'>
                  <Trophy className='w-4 h-4 inline mr-2' />
                  You've reached the highest level!
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='relative'>
        <h3 className='font-semibold mb-4 flex items-center'>
          <span className='bg-primary/10 text-primary p-1 rounded mr-2'>
            <Trophy className='w-4 h-4' />
          </span>
          Achievement Levels
        </h3>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3'>
          {levels.map((level, index) => (
            <motion.div
              key={level.level}
              className={cn(
                'rounded-xl p-4 text-center relative overflow-hidden',
                currentLevel && level.level <= currentLevel.level
                  ? 'border border-' +
                      level.color.split('-')[1] +
                      '-500/30 bg-gradient-to-br from-white to-' +
                      level.color.split('-')[1] +
                      '-50 dark:from-slate-900 dark:to-' +
                      level.color.split('-')[1] +
                      '-900/20 shadow-sm'
                  : 'border border-muted/50 bg-muted/30'
              )}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{
                y: -5,
                transition: { type: 'spring', stiffness: 300 },
              }}
            >
              <div className='relative mb-1'>
                <div
                  className={cn(
                    'w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-3',
                    currentLevel && level.level <= currentLevel.level
                      ? level.color
                      : 'bg-muted',
                    'text-white'
                  )}
                >
                  <span className='text-xs font-bold'>{level.level}</span>
                </div>
                {currentLevel && level.level === currentLevel.level && (
                  <div className='absolute top-0 right-0 w-4 h-4 bg-yellow-400 rounded-full -mt-1 -mr-1 border-2 border-white dark:border-slate-800 flex items-center justify-center'>
                    <span className='text-[8px] text-white font-bold'>✓</span>
                  </div>
                )}
              </div>
              <h4
                className={cn(
                  'text-xs font-medium',
                  currentLevel && level.level <= currentLevel.level
                    ? ''
                    : 'text-muted-foreground'
                )}
              >
                {level.name}
              </h4>
              <p
                className={cn(
                  'text-[10px] font-mono mt-1',
                  currentLevel && level.level <= currentLevel.level
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {level.points} pts
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default UserStats;
