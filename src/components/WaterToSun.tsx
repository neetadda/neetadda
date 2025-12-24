import { useState, useEffect } from 'react';
import { Sun, Check, X, Calendar, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WaterSunEntry, loadData, saveData, getDateString, getLast30Days, calculateStreak } from '@/lib/storage';
import { toast } from 'sonner';
import DateDisplay from '@/components/DateDisplay';
import HistoryBox from '@/components/HistoryBox';

const WaterToSun = () => {
  const [entries, setEntries] = useState<WaterSunEntry[]>([]);
  const today = getDateString();

  useEffect(() => {
    const data = loadData();
    setEntries(data.waterSun);
  }, []);

  const todayEntry = entries.find(e => e.date === today);
  const streak = calculateStreak(entries);
  const last30Days = getLast30Days();
  const completionRate = entries.length > 0 
    ? Math.round((entries.filter(e => e.completed).length / entries.length) * 100)
    : 0;

  const markCompletion = (completed: boolean) => {
    const data = loadData();
    const existing = entries.findIndex(e => e.date === today);
    let updatedEntries: WaterSunEntry[];

    if (existing >= 0) {
      updatedEntries = entries.map((e, i) => 
        i === existing ? { ...e, completed } : e
      );
    } else {
      updatedEntries = [...entries, { date: today, completed }];
    }

    setEntries(updatedEntries);
    saveData({ ...data, waterSun: updatedEntries });
    toast.success(completed ? 'Blessed! Surya Namaskar complete!' : 'Marked as not done');
  };

  return (
    <Card className="shadow-card animate-slide-up">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, hsl(40, 95%, 55%) 0%, hsl(25, 90%, 50%) 100%)' }}>
            <Sun className="h-4 w-4 text-foreground" />
          </div>
          Water to Sun
          <Droplets className="h-4 w-4 text-primary ml-1" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Date Display */}
        <DateDisplay />

        {/* Today's Status */}
        <div className="bg-muted/50 rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-3">Did you offer water to sun today?</p>
          {!todayEntry ? (
            <div className="flex gap-3">
              <Button
                onClick={() => markCompletion(true)}
                className="flex-1 gradient-success text-success-foreground hover:opacity-90"
              >
                <Check className="h-4 w-4 mr-2" />
                Yes, I did
              </Button>
              <Button
                onClick={() => markCompletion(false)}
                variant="outline"
                className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4 mr-2" />
                No, I didn't
              </Button>
            </div>
          ) : (
            <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
              todayEntry.completed 
                ? 'bg-success/20 text-success' 
                : 'bg-destructive/20 text-destructive'
            }`}>
              {todayEntry.completed ? (
                <>
                  <Sun className="h-5 w-5" />
                  <span className="font-medium">Blessed today!</span>
                </>
              ) : (
                <>
                  <X className="h-5 w-5" />
                  <span className="font-medium">Not done today</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-accent/20 rounded-xl">
            <p className="text-2xl font-bold text-accent">{streak}</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </div>
          <div className="text-center p-4 bg-primary/10 rounded-xl">
            <p className="text-2xl font-bold text-primary">{completionRate}%</p>
            <p className="text-sm text-muted-foreground">Completion</p>
          </div>
        </div>

        {/* 30-Day History with clickable boxes */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Last 30 Days</span>
            <span className="text-xs text-muted-foreground">(tap to see date)</span>
          </div>
          <div className="grid grid-cols-10 gap-1">
            {last30Days.map((date) => {
              const entry = entries.find(e => e.date === date);
              const isToday = date === today;
              const status = entry?.completed === true ? 'completed' : entry?.completed === false ? 'missed' : 'none';
              
              return (
                <HistoryBox
                  key={date}
                  date={date}
                  status={status}
                  isToday={isToday}
                  type="sun"
                />
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WaterToSun;
