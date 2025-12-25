import { useMemo, useState } from "react";
import { Stethoscope } from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer";
import TodoList from "@/components/TodoList";
import CoachingAttendance from "@/components/CoachingAttendance";
import StudyHours from "@/components/StudyHours";
import WaterToSun from "@/components/WaterToSun";
import StatsPanel from "@/components/StatsPanel";
import Navigation from "@/components/Navigation";
import DailyQuote from "@/components/DailyQuote";
import WeeklyGoals from "@/components/WeeklyGoals";
import SubjectTracker from "@/components/SubjectTracker";
import RevisionReminder from "@/components/RevisionReminder";
import NotificationPrompt from "@/components/NotificationPrompt";
import { useNotifications } from "@/hooks/useNotifications";

const Index = () => {
  const [activeTab, setActiveTab] = useState("todo");

  // Initialize notifications
  useNotifications();

  const TAB_SEO: Record<string, { title: string; description: string }> = useMemo(
    () => ({
      todo: {
        title: "Daily NEET To‑Do List & Revision Plan",
        description:
          "Turn your NEET syllabus into a daily action plan—track tasks and spaced‑repetition revision so you stay consistent till NEET 2026.",
      },
      coaching: {
        title: "Coaching Attendance Tracker for NEET",
        description:
          "Mark coaching attendance and build discipline—small daily consistency compounds into better NEET performance and fewer missed classes.",
      },
      study: {
        title: "Study Hours & Subject‑Wise Tracking (PCB)",
        description:
          "Log daily study hours and Physics/Chemistry/Biology time to balance PCB, fix weak areas, and maintain NEET-level accuracy and speed.",
      },
      water: {
        title: "Water‑to‑Sun Habit Tracker (Daily Routine)",
        description:
          "Keep your morning routine consistent—healthy habits support focus, mood, and long NEET study sessions across the year.",
      },
      stats: {
        title: "NEET Preparation Stats & Progress Overview",
        description:
          "See your progress at a glance—study trends and discipline metrics help you course-correct early and stay exam-ready.",
      },
    }),
    []
  );

  const tabSeo = TAB_SEO[activeTab] ?? TAB_SEO.todo;

  const renderContent = () => {
    switch (activeTab) {
      case "todo":
        return (
          <>
            <TodoList />
            <RevisionReminder />
          </>
        );
      case "coaching":
        return <CoachingAttendance />;
      case "study":
        return (
          <>
            <StudyHours />
            <SubjectTracker />
            <WeeklyGoals />
          </>
        );
      case "water":
        return <WaterToSun />;
      case "stats":
        return <StatsPanel />;
      default:
        return <TodoList />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl gradient-primary shadow-glow">
              <Stethoscope className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">NEET 2026 Study Tracker</h1>
              <p className="text-xs text-muted-foreground">
                Daily NEET routine: tasks, revision, study hours, coaching attendance & progress
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <CountdownTimer />
        <DailyQuote />

        <section className="animate-fade-in space-y-4" key={activeTab} aria-labelledby="tab-title">
          <header className="space-y-1">
            <h2 id="tab-title" className="text-base font-semibold text-foreground">
              {tabSeo.title}
            </h2>
            <p className="text-sm text-muted-foreground">{tabSeo.description}</p>
          </header>

          <div className="space-y-6">{renderContent()}</div>
        </section>
      </main>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <NotificationPrompt />
    </div>
  );
};

export default Index;
