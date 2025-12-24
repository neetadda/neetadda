import { useState, useEffect } from 'react';
import { Clock, Plus, Minus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StudyHourEntry, loadData, saveData, getDateString, getLast30Days, formatDate } from '@/lib/storage';
import { toast } from 'sonner';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DateDisplay from '@/components/DateDisplay';

const StudyHours = () => {
  const [entries, setEntries] = useState<StudyHourEntry[]>([]);
  const [hours, setHours] = useState(0);
  const today = getDateString();

  useEffect(() => {
    const data = loadData();
    setEntries(data.studyHours);
    const todayEntry = data.studyHours.find(e => e.date === today);
    if (todayEntry) {
      setHours(todayEntry.hours);
    }
  }, []);

  const avgHours = entries.length > 0
    ? (entries.reduce((sum, e) => sum + e.hours, 0) / entries.length).toFixed(1)
    : '0';

  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);

  const updateHours = (newHours: number) => {
    if (newHours < 0 || newHours > 24) return;
    
    const data = loadData();
    const existing = entries.findIndex(e => e.date === today);
    let updatedEntries: StudyHourEntry[];

    if (existing >= 0) {
      updatedEntries = entries.map((e, i) => 
        i === existing ? { ...e, hours: newHours } : e
      );
    } else {
      updatedEntries = [...entries, { date: today, hours: newHours }];
    }

    setHours(newHours);
    setEntries(updatedEntries);
    saveData({ ...data, studyHours: updatedEntries });
    toast.success(`Study hours updated to ${newHours}h`);
  };

  const last30Days = getLast30Days();
  const chartData = last30Days.map(date => {
    const entry = entries.find(e => e.date === date);
    return {
      date: new Date(date).getDate().toString(),
      hours: entry?.hours || 0,
      fullDate: formatDate(date),
    };
  });

  return (
    <Card className="shadow-card animate-slide-up">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg gradient-accent">
            <Clock className="h-4 w-4 text-accent-foreground" />
          </div>
          Study Hours
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Date Display */}
        <DateDisplay />

        {/* Today's Hours */}
        <div className="bg-muted/50 rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-3 text-center">Today's Study Hours</p>
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={() => updateHours(hours - 0.5)}
              variant="outline"
              size="icon"
              disabled={hours <= 0}
              className="h-12 w-12 rounded-full"
            >
              <Minus className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <span className="text-4xl font-bold text-primary">{hours}</span>
              <span className="text-xl text-muted-foreground ml-1">hrs</span>
            </div>
            <Button
              onClick={() => updateHours(hours + 0.5)}
              variant="outline"
              size="icon"
              disabled={hours >= 24}
              className="h-12 w-12 rounded-full"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Tap +/- to adjust (0.5 hr increments)
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-primary/10 rounded-xl">
            <p className="text-2xl font-bold text-primary">{avgHours}h</p>
            <p className="text-sm text-muted-foreground">Daily Avg</p>
          </div>
          <div className="text-center p-4 bg-success/10 rounded-xl">
            <p className="text-2xl font-bold text-success">{totalHours}h</p>
            <p className="text-sm text-muted-foreground">Total Hours</p>
          </div>
        </div>

        {/* Chart */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">30-Day History</span>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="studyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(195, 85%, 40%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(195, 85%, 40%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(215, 15%, 50%)' }}
                  interval={4}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(215, 15%, 50%)' }}
                  domain={[0, 'auto']}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border rounded-lg p-2 shadow-lg">
                          <p className="text-sm font-medium">{payload[0].payload.fullDate}</p>
                          <p className="text-primary font-bold">{payload[0].value}h studied</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="hsl(195, 85%, 40%)"
                  strokeWidth={2}
                  fill="url(#studyGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyHours;
