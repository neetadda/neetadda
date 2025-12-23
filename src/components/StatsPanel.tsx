import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Flame, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { loadData, calculateStreak, calculatePredictedRank } from '@/lib/storage';

const StatsPanel = () => {
  const [stats, setStats] = useState({
    coachingStreak: 0,
    waterSunStreak: 0,
    avgStudyHours: 0,
    coachingRate: 0,
    predictedRank: { rank: '—', category: 'Start tracking!', color: 'muted' },
  });

  useEffect(() => {
    const data = loadData();
    
    const coachingStreak = calculateStreak(
      data.coaching.map(e => ({ date: e.date, completed: e.attended }))
    );
    const waterSunStreak = calculateStreak(data.waterSun);
    
    const avgStudyHours = data.studyHours.length > 0
      ? data.studyHours.reduce((sum, e) => sum + e.hours, 0) / data.studyHours.length
      : 0;
    
    const coachingRate = data.coaching.length > 0
      ? (data.coaching.filter(e => e.attended).length / data.coaching.length) * 100
      : 0;

    const predictedRank = calculatePredictedRank(avgStudyHours, coachingRate);

    setStats({
      coachingStreak,
      waterSunStreak,
      avgStudyHours,
      coachingRate,
      predictedRank,
    });
  }, []);

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    suffix = '',
    gradient 
  }: { 
    icon: typeof Trophy; 
    label: string; 
    value: number | string;
    suffix?: string;
    gradient: string;
  }) => (
    <div className={`${gradient} rounded-xl p-4 text-center transform transition-all hover:scale-105`}>
      <Icon className="h-6 w-6 mx-auto mb-2 text-primary-foreground/90" />
      <p className="text-2xl font-bold text-primary-foreground">
        {value}{suffix}
      </p>
      <p className="text-xs text-primary-foreground/70">{label}</p>
    </div>
  );

  return (
    <Card className="shadow-card animate-slide-up">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg gradient-success">
            <Trophy className="h-4 w-4 text-success-foreground" />
          </div>
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Streaks */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={Flame}
            label="Coaching Streak"
            value={stats.coachingStreak}
            suffix=" days"
            gradient="gradient-accent"
          />
          <StatCard
            icon={Flame}
            label="Water to Sun Streak"
            value={stats.waterSunStreak}
            suffix=" days"
            gradient="gradient-primary"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={TrendingUp}
            label="Avg Study Hours"
            value={stats.avgStudyHours.toFixed(1)}
            suffix="h"
            gradient="gradient-success"
          />
          <StatCard
            icon={Target}
            label="Coaching Rate"
            value={Math.round(stats.coachingRate)}
            suffix="%"
            gradient="gradient-hero"
          />
        </div>

        {/* Predicted Rank */}
        <div className={`rounded-xl p-6 text-center border-2 ${
          stats.predictedRank.color === 'success' ? 'border-success bg-success/10' :
          stats.predictedRank.color === 'primary' ? 'border-primary bg-primary/10' :
          stats.predictedRank.color === 'accent' ? 'border-accent bg-accent/10' :
          stats.predictedRank.color === 'destructive' ? 'border-destructive bg-destructive/10' :
          'border-muted bg-muted/50'
        }`}>
          <Award className={`h-8 w-8 mx-auto mb-2 ${
            stats.predictedRank.color === 'success' ? 'text-success' :
            stats.predictedRank.color === 'primary' ? 'text-primary' :
            stats.predictedRank.color === 'accent' ? 'text-accent' :
            stats.predictedRank.color === 'destructive' ? 'text-destructive' :
            'text-muted-foreground'
          }`} />
          <p className="text-sm text-muted-foreground mb-1">Predicted NEET Rank</p>
          <p className={`text-2xl font-bold ${
            stats.predictedRank.color === 'success' ? 'text-success' :
            stats.predictedRank.color === 'primary' ? 'text-primary' :
            stats.predictedRank.color === 'accent' ? 'text-accent' :
            stats.predictedRank.color === 'destructive' ? 'text-destructive' :
            'text-muted-foreground'
          }`}>
            {stats.predictedRank.rank}
          </p>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            {stats.predictedRank.category}
          </p>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          *Rank prediction is based on your study consistency. Keep pushing! 💪
        </p>
      </CardContent>
    </Card>
  );
};

export default StatsPanel;