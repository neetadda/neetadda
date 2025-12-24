import { useState } from 'react';
import { X, Check, Sun, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/storage';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface HistoryBoxProps {
  date: string;
  status: 'completed' | 'missed' | 'none';
  isToday: boolean;
  type: 'coaching' | 'sun';
}

const HistoryBox = ({ date, status, isToday, type }: HistoryBoxProps) => {
  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const statusText = status === 'completed' 
    ? type === 'coaching' ? 'Attended' : 'Completed'
    : status === 'missed' 
    ? type === 'coaching' ? 'Missed' : 'Not done'
    : 'No data';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`aspect-square rounded-md flex items-center justify-center text-xs transition-all cursor-pointer hover:scale-110 ${
            isToday ? type === 'coaching' ? 'ring-2 ring-primary ring-offset-2' : 'ring-2 ring-accent ring-offset-2' : ''
          } ${
            status === 'completed'
              ? 'bg-success text-success-foreground'
              : status === 'missed'
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {status === 'completed' && (type === 'coaching' ? <Check className="h-3 w-3" /> : <Sun className="h-3 w-3" />)}
          {status === 'missed' && <X className="h-3 w-3" />}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" side="top">
        <div className="text-center">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">{formattedDate}</span>
          </div>
          <p className={`text-xs ${
            status === 'completed' ? 'text-success' : 
            status === 'missed' ? 'text-destructive' : 
            'text-muted-foreground'
          }`}>
            {statusText}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default HistoryBox;
