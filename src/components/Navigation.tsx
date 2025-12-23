import { useState } from 'react';
import { ListTodo, GraduationCap, Clock, Sun, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: 'todo', label: 'Tasks', icon: ListTodo },
    { id: 'coaching', label: 'Coaching', icon: GraduationCap },
    { id: 'study', label: 'Study', icon: Clock },
    { id: 'water', label: 'Sun', icon: Sun },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50 safe-area-inset-bottom">
      <div className="max-w-2xl mx-auto px-2">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200',
                  isActive 
                    ? 'gradient-primary text-primary-foreground scale-105' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;