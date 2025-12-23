import { useState } from 'react';
import { Stethoscope } from 'lucide-react';
import CountdownTimer from '@/components/CountdownTimer';
import TodoList from '@/components/TodoList';
import CoachingAttendance from '@/components/CoachingAttendance';
import StudyHours from '@/components/StudyHours';
import WaterToSun from '@/components/WaterToSun';
import StatsPanel from '@/components/StatsPanel';
import Navigation from '@/components/Navigation';
import DailyQuote from '@/components/DailyQuote';
import WeeklyGoals from '@/components/WeeklyGoals';

const Index = () => {
  const [activeTab, setActiveTab] = useState('todo');

  const renderContent = () => {
    switch (activeTab) {
      case 'todo':
        return <TodoList />;
      case 'coaching':
        return <CoachingAttendance />;
      case 'study':
        return (
          <div className="space-y-6">
            <StudyHours />
            <WeeklyGoals />
          </div>
        );
      case 'water':
        return <WaterToSun />;
      case 'stats':
        return <StatsPanel />;
      default:
        return <TodoList />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl gradient-primary shadow-glow">
              <Stethoscope className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">NEET 2026 Tracker</h1>
              <p className="text-xs text-muted-foreground">Your path to MBBS starts here</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Countdown - Always visible */}
        <CountdownTimer />
        
        {/* Daily Quote */}
        <DailyQuote />

        {/* Tab Content */}
        <div className="animate-fade-in" key={activeTab}>
          {renderContent()}
        </div>
      </main>

      {/* Bottom Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;