import { useState, useEffect } from 'react';
import { GraduationCap, Check, X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CoachingEntry, loadData, saveData, getDateString, getLast30Days, calculateStreak } from '@/lib/storage';
import { toast } from 'sonner';
import DateDisplay from '@/components/DateDisplay';
import HistoryBox from '@/components/HistoryBox';

const CoachingAttendance = () => {
  const [entries, setEntries] = useState<CoachingEntry[]>([]);
  const today = getDateString();

  useEffect(() => {
    const data = loadData();
    setEntries(data.coaching);
  }, []);

  const todayEntry = entries.find(e => e.date === today);
  const streak = calculateStreak(entries.map(e => ({ date: e.date, completed: e.attended })));
  const last30Days = getLast30Days();
  const attendanceRate = entries.length > 0 
    ? Math.round((entries.filter(e => e.attended).length / entries.length) * 100)
    : 0;

  const markAttendance = (attended: boolean) => {
    const data = loadData();
    const existing = entries.findIndex(e => e.date === today);
    let updatedEntries: CoachingEntry[];

    if (existing >= 0) {
      updatedEntries = entries.map((e, i) => 
        i === existing ? { ...e, attended } : e
      );
    } else {
      updatedEntries = [...entries, { date: today, attended }];
    }

    setEntries(updatedEntries);
    saveData({ ...data, coaching: updatedEntries });
    toast.success(attended ? 'Great! Coaching attendance marked!' : 'No problem, rest is important too!');
  };

  return (
    <Card className="shadow-card animate-slide-up">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg gradient-primary">
            <GraduationCap className="h-4 w-4 text-primary-foreground" />
          </div>
          Coaching Attendance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Date Display */}
        <DateDisplay />

        {/* Today's Status */}
        <div className="bg-muted/50 rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-3">Did you attend coaching today?</p>
          {!todayEntry ? (
            <div className="flex gap-3">
              <Button
                onClick={() => markAttendance(true)}
                className="flex-1 gradient-success text-success-foreground hover:opacity-90"
              >
                <Check className="h-4 w-4 mr-2" />
                Yes, I attended
              </Button>
              <Button
                onClick={() => markAttendance(false)}
                variant="outline"
                className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4 mr-2" />
                No, I didn't
              </Button>
            </div>
          ) : (
            <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
              todayEntry.attended 
                ? 'bg-success/20 text-success' 
                : 'bg-destructive/20 text-destructive'
            }`}>
              {todayEntry.attended ? (
                <>
                  <Check className="h-5 w-5" />
                  <span className="font-medium">Attended today!</span>
                </>
              ) : (
                <>
                  <X className="h-5 w-5" />
                  <span className="font-medium">Did not attend</span>
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
            <p className="text-2xl font-bold text-primary">{attendanceRate}%</p>
            <p className="text-sm text-muted-foreground">Attendance</p>
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
              const status = entry?.attended === true ? 'completed' : entry?.attended === false ? 'missed' : 'none';
              
              return (
                <HistoryBox
                  key={date}
                  date={date}
                  status={status}
                  isToday={isToday}
                  type="coaching"
                />
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachingAttendance;
