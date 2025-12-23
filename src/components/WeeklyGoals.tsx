import { useState, useEffect } from 'react';
import { Target, Plus, Minus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { loadData, getDateString } from '@/lib/storage';

const WeeklyGoals = () => {
  const [targetHours, setTargetHours] = useState(35);
  const [currentHours, setCurrentHours] = useState(0);
  const [weekDays, setWeekDays] = useState<string[]>([]);

  useEffect(() => {
    // Get current week dates (Monday to Sunday)
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    const days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      days.push(getDateString(day));
    }
    setWeekDays(days);

    // Load study hours for the week
    const data = loadData();
    const weekHours = data.studyHours
      .filter(entry => days.includes(entry.date))
      .reduce((sum, entry) => sum + entry.hours, 0);
    setCurrentHours(weekHours);

    // Load saved target (could be extended to save to localStorage)
    const savedTarget = localStorage.getItem('weekly-target-hours');
    if (savedTarget) {
      setTargetHours(parseInt(savedTarget));
    }
  }, []);

  const updateTarget = (newTarget: number) => {
    if (newTarget < 5 || newTarget > 100) return;
    setTargetHours(newTarget);
    localStorage.setItem('weekly-target-hours', newTarget.toString());
  };

  const progress = Math.min((currentHours / targetHours) * 100, 100);
  const remaining = Math.max(targetHours - currentHours, 0);
  const daysLeft = 7 - weekDays.filter(d => new Date(d) <= new Date()).length + 1;
  const dailyNeeded = daysLeft > 0 ? (remaining / daysLeft).toFixed(1) : 0;

  return (
    <Card className="shadow-card animate-slide-up">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg gradient-success">
            <Target className="h-4 w-4 text-success-foreground" />
          </div>
          Weekly Study Goal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Target Setter */}
        <div className="bg-muted/50 rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-3 text-center">Weekly Target Hours</p>
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={() => updateTarget(targetHours - 5)}
              variant="outline"
              size="icon"
              disabled={targetHours <= 5}
              className="h-10 w-10 rounded-full"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <span className="text-3xl font-bold text-primary">{targetHours}</span>
              <span className="text-lg text-muted-foreground ml-1">hrs</span>
            </div>
            <Button
              onClick={() => updateTarget(targetHours + 5)}
              variant="outline"
              size="icon"
              disabled={targetHours >= 100}
              className="h-10 w-10 rounded-full"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-primary">{currentHours}h / {targetHours}h</span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{progress.toFixed(0)}% complete</span>
            <span>{remaining}h remaining</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-4 bg-primary/10 rounded-xl">
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold text-primary">{dailyNeeded}h</p>
            <p className="text-xs text-muted-foreground">Daily needed</p>
          </div>
          <div className="text-center p-4 bg-accent/20 rounded-xl">
            <Target className="h-5 w-5 mx-auto mb-1 text-accent" />
            <p className="text-lg font-bold text-accent">{daysLeft}</p>
            <p className="text-xs text-muted-foreground">Days left</p>
          </div>
        </div>

        {progress >= 100 && (
          <div className="text-center p-3 bg-success/20 rounded-xl text-success font-medium">
            🎉 Weekly goal achieved! Keep it up!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyGoals;
