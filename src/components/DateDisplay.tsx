import { Calendar } from 'lucide-react';
import { getDateString, formatDate } from '@/lib/storage';

const DateDisplay = () => {
  const today = getDateString();
  const formattedDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex items-center justify-center gap-2 py-2 px-4 bg-muted/50 rounded-lg text-sm">
      <Calendar className="h-4 w-4 text-primary" />
      <span className="text-foreground font-medium">{formattedDate}</span>
    </div>
  );
};

export default DateDisplay;
