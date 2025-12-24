import { useState, useEffect } from 'react';
import { Atom, Leaf, FlaskConical, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SubjectHours {
  physics: number;
  chemistry: number;
  biology: number;
}

const SubjectTracker = () => {
  const [hours, setHours] = useState<SubjectHours>({ physics: 0, chemistry: 0, biology: 0 });
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const stored = localStorage.getItem(`subject-hours-${today}`);
    if (stored) {
      setHours(JSON.parse(stored));
    }
  }, [today]);

  const updateHours = (subject: keyof SubjectHours, delta: number) => {
    const newValue = Math.max(0, Math.min(12, hours[subject] + delta));
    const updated = { ...hours, [subject]: newValue };
    setHours(updated);
    localStorage.setItem(`subject-hours-${today}`, JSON.stringify(updated));
    toast.success(`${subject.charAt(0).toUpperCase() + subject.slice(1)} hours updated`);
  };

  const totalHours = hours.physics + hours.chemistry + hours.biology;
  const maxTotal = 12;

  const subjects = [
    { key: 'physics' as const, name: 'Physics', icon: Atom, color: 'primary', bgColor: 'bg-primary/20' },
    { key: 'chemistry' as const, name: 'Chemistry', icon: FlaskConical, color: 'accent', bgColor: 'bg-accent/20' },
    { key: 'biology' as const, name: 'Biology', icon: Leaf, color: 'success', bgColor: 'bg-success/20' },
  ];

  return (
    <Card className="shadow-card animate-slide-up">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg gradient-hero">
            <TrendingUp className="h-4 w-4 text-primary-foreground" />
          </div>
          Subject-wise Study
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {subjects.map((subject) => {
          const Icon = subject.icon;
          const percentage = (hours[subject.key] / 4) * 100; // 4h ideal per subject
          
          return (
            <div key={subject.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${subject.bgColor}`}>
                    <Icon className={`h-4 w-4 text-${subject.color}`} />
                  </div>
                  <span className="font-medium text-sm">{subject.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 w-7 p-0"
                    onClick={() => updateHours(subject.key, -0.5)}
                    disabled={hours[subject.key] <= 0}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-bold">{hours[subject.key]}h</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 w-7 p-0"
                    onClick={() => updateHours(subject.key, 0.5)}
                    disabled={hours[subject.key] >= 12}
                  >
                    +
                  </Button>
                </div>
              </div>
              <Progress 
                value={Math.min(percentage, 100)} 
                className="h-2"
              />
            </div>
          );
        })}
        
        <div className="pt-2 mt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Today</span>
            <span className="font-bold text-primary">{totalHours}h / {maxTotal}h</span>
          </div>
          <Progress 
            value={(totalHours / maxTotal) * 100} 
            className="h-3 mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectTracker;
