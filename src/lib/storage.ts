// Storage utilities for NEET Tracker data persistence

export interface Task {
  id: string;
  text: string;
  completed: boolean | null; // null = pending, true = done, false = skipped
  date: string; // ISO date string
}

export interface CoachingEntry {
  date: string;
  attended: boolean;
}

export interface StudyHourEntry {
  date: string;
  hours: number;
}

export interface WaterSunEntry {
  date: string;
  completed: boolean;
}

export interface AppData {
  tasks: Task[];
  coaching: CoachingEntry[];
  studyHours: StudyHourEntry[];
  waterSun: WaterSunEntry[];
  lastActiveDate: string;
}

const STORAGE_KEY = 'neet-tracker-data';

const getDefaultData = (): AppData => ({
  tasks: [],
  coaching: [],
  studyHours: [],
  waterSun: [],
  lastActiveDate: new Date().toISOString().split('T')[0],
});

export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return getDefaultData();
    return JSON.parse(stored);
  } catch {
    return getDefaultData();
  }
};

export const saveData = (data: AppData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getDateString = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0];
};

export const getTomorrowString = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getDateString(tomorrow);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    weekday: 'short',
  });
};

export const getLast30Days = (): string[] => {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(getDateString(date));
  }
  return days;
};

export const calculateStreak = (entries: { date: string; completed?: boolean; attended?: boolean }[]): number => {
  if (entries.length === 0) return 0;
  
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  const today = getDateString();
  let currentDate = new Date(today);
  
  for (const entry of sortedEntries) {
    const entryDate = entry.date;
    const expectedDate = getDateString(currentDate);
    
    if (entryDate === expectedDate) {
      const wasCompleted = entry.completed ?? entry.attended;
      if (wasCompleted) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    } else if (new Date(entryDate) < new Date(expectedDate)) {
      break;
    }
  }
  
  return streak;
};

// Improved rank prediction based on study hours and coaching attendance
export const calculatePredictedRank = (
  avgStudyHours: number,
  coachingAttendance: number,
  totalDaysTracked: number = 30
): { rank: string; category: string; color: string } => {
  // Weight factors:
  // - Study hours: 70% weight (10-12h daily = ideal)
  // - Coaching attendance: 30% weight (100% = ideal)
  
  // Normalize study hours (0-12h scale, where 12h = 100%)
  const studyScore = Math.min((avgStudyHours / 12) * 100, 100);
  
  // Coaching attendance is already 0-100%
  const coachingScore = coachingAttendance;
  
  // Consistency bonus: more days tracked = higher reliability
  const consistencyMultiplier = Math.min(totalDaysTracked / 30, 1);
  
  // Weighted final score
  const finalScore = (studyScore * 0.7 + coachingScore * 0.3) * consistencyMultiplier;
  
  if (finalScore >= 90) {
    return { rank: 'Top 100', category: 'AIIMS Delhi Level', color: 'success' };
  } else if (finalScore >= 80) {
    return { rank: '100 - 1,000', category: 'Top Government Medical Colleges', color: 'success' };
  } else if (finalScore >= 70) {
    return { rank: '1,000 - 5,000', category: 'Government Medical Colleges', color: 'primary' };
  } else if (finalScore >= 60) {
    return { rank: '5,000 - 20,000', category: 'State Government Colleges', color: 'primary' };
  } else if (finalScore >= 50) {
    return { rank: '20,000 - 50,000', category: 'Private Medical Colleges', color: 'accent' };
  } else if (finalScore >= 35) {
    return { rank: '50,000 - 1,00,000', category: 'MBBS Possible', color: 'muted' };
  } else {
    return { rank: '1,00,000+', category: 'Increase Study Hours & Coaching', color: 'destructive' };
  }
};
