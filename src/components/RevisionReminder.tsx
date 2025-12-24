import { useState, useEffect } from 'react';
import { BookMarked, Plus, Trash2, Bell, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface RevisionTopic {
  id: string;
  topic: string;
  subject: 'Physics' | 'Chemistry' | 'Biology';
  addedDate: string;
  nextRevision: string;
  revisionCount: number;
}

const SPACED_REPETITION_DAYS = [1, 3, 7, 14, 30]; // Days after which to revise

const RevisionReminder = () => {
  const [topics, setTopics] = useState<RevisionTopic[]>([]);
  const [newTopic, setNewTopic] = useState('');
  const [subject, setSubject] = useState<'Physics' | 'Chemistry' | 'Biology'>('Physics');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const stored = localStorage.getItem('revision-topics');
    if (stored) {
      setTopics(JSON.parse(stored));
    }
  }, []);

  const calculateNextRevision = (addedDate: string, revisionCount: number): string => {
    const date = new Date(addedDate);
    const daysToAdd = SPACED_REPETITION_DAYS[Math.min(revisionCount, SPACED_REPETITION_DAYS.length - 1)];
    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString().split('T')[0];
  };

  const addTopic = () => {
    if (!newTopic.trim()) return;

    const topic: RevisionTopic = {
      id: Date.now().toString(),
      topic: newTopic.trim(),
      subject,
      addedDate: today,
      nextRevision: calculateNextRevision(today, 0),
      revisionCount: 0,
    };

    const updated = [...topics, topic];
    setTopics(updated);
    localStorage.setItem('revision-topics', JSON.stringify(updated));
    setNewTopic('');
    toast.success('Topic added for revision!');
  };

  const markRevised = (topicId: string) => {
    const updated = topics.map(t => {
      if (t.id === topicId) {
        const newCount = t.revisionCount + 1;
        return {
          ...t,
          revisionCount: newCount,
          nextRevision: calculateNextRevision(today, newCount),
        };
      }
      return t;
    });
    setTopics(updated);
    localStorage.setItem('revision-topics', JSON.stringify(updated));
    toast.success('Great job! Topic revised!');
  };

  const deleteTopic = (topicId: string) => {
    const updated = topics.filter(t => t.id !== topicId);
    setTopics(updated);
    localStorage.setItem('revision-topics', JSON.stringify(updated));
    toast.success('Topic removed');
  };

  const dueToday = topics.filter(t => t.nextRevision <= today);
  const upcoming = topics.filter(t => t.nextRevision > today).slice(0, 3);

  const subjectColors = {
    Physics: 'primary',
    Chemistry: 'accent',
    Biology: 'success',
  };

  return (
    <Card className="shadow-card animate-slide-up">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-amber-500/20">
            <BookMarked className="h-4 w-4 text-amber-500" />
          </div>
          Revision Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new topic */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Add topic to revise..."
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTopic()}
              className="flex-1"
            />
            <Button onClick={addTopic} size="icon" className="gradient-primary text-primary-foreground">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            {(['Physics', 'Chemistry', 'Biology'] as const).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={subject === s ? 'default' : 'outline'}
                className={`text-xs ${subject === s ? `bg-${subjectColors[s]}/80` : ''}`}
                onClick={() => setSubject(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        {/* Due today */}
        {dueToday.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-500">Due Today ({dueToday.length})</span>
            </div>
            <div className="space-y-2">
              {dueToday.map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-center gap-2 p-2 bg-amber-500/10 rounded-lg border border-amber-500/30"
                >
                  <span className={`text-xs px-2 py-0.5 rounded bg-${subjectColors[topic.subject]}/20 text-${subjectColors[topic.subject]}`}>
                    {topic.subject.slice(0, 3)}
                  </span>
                  <span className="flex-1 text-sm font-medium">{topic.topic}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-success hover:bg-success/20"
                    onClick={() => markRevised(topic.id)}
                  >
                    Done
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-destructive hover:bg-destructive/20"
                    onClick={() => deleteTopic(topic.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Upcoming</span>
            </div>
            <div className="space-y-1">
              {upcoming.map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg text-sm"
                >
                  <span className="text-xs text-muted-foreground">
                    {new Date(topic.nextRevision).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                  <span className="flex-1">{topic.topic}</span>
                  <span className="text-xs text-muted-foreground">{topic.revisionCount}x</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {topics.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-4">
            Add topics you've studied for spaced repetition reminders!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RevisionReminder;
