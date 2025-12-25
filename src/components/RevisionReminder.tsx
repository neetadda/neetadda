import { useEffect, useMemo, useState } from 'react';
import { BookMarked, Plus, Trash2, Bell, Clock, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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

const subjectBadgeClass: Record<RevisionTopic['subject'], string> = {
  Physics: 'bg-primary/15 text-primary border border-primary/25',
  Chemistry: 'bg-accent/15 text-accent-foreground border border-accent/25',
  Biology: 'bg-secondary/30 text-secondary-foreground border border-border',
};

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
    const updated = topics.map((t) => {
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
    const updated = topics.filter((t) => t.id !== topicId);
    setTopics(updated);
    localStorage.setItem('revision-topics', JSON.stringify(updated));
    toast.success('Topic removed');
  };

  const dueToday = useMemo(() => topics.filter((t) => t.nextRevision <= today), [topics, today]);
  const upcoming = useMemo(
    () => topics.filter((t) => t.nextRevision > today).slice(0, 3),
    [topics, today]
  );

  const faqJsonLd = useMemo(() => {
    const mainEntity = [
      {
        '@type': 'Question',
        name: 'What is the best revision strategy for NEET 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'A strong NEET revision strategy is spaced repetition + daily practice questions. Revise the same topic after 1, 3, 7, 14, and 30 days to improve retention and reduce silly mistakes.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does this NEET revision tracker help me?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'This NEET revision tracker schedules your next revision date automatically and shows what is due today, so you revise consistently across Physics, Chemistry and Biology (PCB).',
        },
      },
      {
        '@type': 'Question',
        name: 'How many topics should I revise daily for NEET?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Start with 5–15 high-impact topics per day, prioritizing weak areas and recent mistakes. Consistency matters more than volume—revise daily and add MCQs to lock concepts.',
        },
      },
      {
        '@type': 'Question',
        name: 'Should I revise PCB every day?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Yes—daily PCB revision keeps concepts active. Rotate subjects (e.g., Physics + Bio today, Chemistry tomorrow) while maintaining a short revision slot for each subject every week.',
        },
      },
    ];

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity,
    };
  }, []);

  useEffect(() => {
    const id = 'revision-faq-jsonld';
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(faqJsonLd);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [faqJsonLd]);

  return (
    <Card className="shadow-card animate-slide-up">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-primary/10">
            <BookMarked className="h-4 w-4 text-primary" />
          </div>
          NEET Revision Tracker (Spaced Repetition)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          This page helps NEET aspirants retain concepts by scheduling smart revisions and showing exactly what to revise today.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new topic */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Add NEET topic to revise (e.g., Thermodynamics, Human Physiology)…"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTopic()}
              className="flex-1"
            />
            <Button onClick={addTopic} size="icon" className="gradient-primary text-primary-foreground" aria-label="Add topic">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            {(['Physics', 'Chemistry', 'Biology'] as const).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={subject === s ? 'default' : 'outline'}
                className="text-xs"
                onClick={() => setSubject(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        {/* Due today */}
        {dueToday.length > 0 && (
          <section aria-label="Revision topics due today">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Due Today ({dueToday.length})</span>
            </div>
            <div className="space-y-2">
              {dueToday.map((topic) => (
                <article
                  key={topic.id}
                  className="flex items-center gap-2 p-2 bg-muted/40 rounded-lg border border-border"
                >
                  <span className={`text-xs px-2 py-0.5 rounded ${subjectBadgeClass[topic.subject]}`}>
                    {topic.subject.slice(0, 3)}
                  </span>
                  <span className="flex-1 text-sm font-medium text-foreground">{topic.topic}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-foreground hover:bg-muted"
                    onClick={() => markRevised(topic.id)}
                  >
                    Done
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                    onClick={() => deleteTopic(topic.id)}
                    aria-label="Delete topic"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section aria-label="Upcoming revision topics">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Upcoming</span>
            </div>
            <div className="space-y-1">
              {upcoming.map((topic) => (
                <article
                  key={topic.id}
                  className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg text-sm"
                >
                  <span className="text-xs text-muted-foreground">
                    {new Date(topic.nextRevision).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                  <span className="flex-1 text-foreground">{topic.topic}</span>
                  <span className="text-xs text-muted-foreground">{topic.revisionCount}x</span>
                </article>
              ))}
            </div>
          </section>
        )}

        {topics.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-4">
            Add NEET topics you studied today—this tracker will remind you using spaced repetition.
          </p>
        )}

        {/* FAQ */}
        <section className="pt-2" aria-labelledby="revision-faq-title">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            <h3 id="revision-faq-title" className="text-sm font-semibold text-foreground">
              NEET Revision FAQ (Spaced Repetition)
            </h3>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>What is the best revision strategy for NEET 2026?</AccordionTrigger>
              <AccordionContent>
                Use spaced repetition + daily MCQs: revise after 1, 3, 7, 14, and 30 days to retain concepts and reduce silly mistakes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q2">
              <AccordionTrigger>How does this NEET revision tracker help?</AccordionTrigger>
              <AccordionContent>
                It auto-schedules your next revision date and shows what is due today, so you revise consistently across Physics, Chemistry and Biology.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q3">
              <AccordionTrigger>How many topics should I revise daily for NEET?</AccordionTrigger>
              <AccordionContent>
                Start with 5–15 high-impact topics daily, prioritizing weak areas and recent mistakes, then add 20–60 MCQs to lock the concepts.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q4">
              <AccordionTrigger>Should I revise PCB every day?</AccordionTrigger>
              <AccordionContent>
                Yes—rotate focus (e.g., Physics + Bio today, Chemistry tomorrow) but keep a small daily revision slot so PCB stays active all week.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </CardContent>
    </Card>
  );
};

export default RevisionReminder;
