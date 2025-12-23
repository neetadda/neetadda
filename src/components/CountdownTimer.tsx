import { useEffect, useState, useMemo } from 'react';
import { Timer, Target, BookOpen } from 'lucide-react';

// NEET 2026 exam date - May 3, 2026 at 2:00 PM IST
const NEET_DATE = new Date('2026-05-03T14:00:00+05:30');

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (): TimeLeft => {
  const now = new Date();
  const difference = NEET_DATE.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const CountdownTimer = () => {
  // Initialize with calculated value immediately to avoid flash of 0s
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-card/80 backdrop-blur-sm shadow-card flex items-center justify-center border border-primary/20">
          <span className="text-2xl sm:text-3xl font-bold text-primary">
            {value.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="absolute -inset-1 rounded-xl bg-primary/10 blur-sm -z-10" />
      </div>
      <span className="text-xs sm:text-sm text-primary-foreground/80 mt-2 font-medium uppercase tracking-wider">
        {label}
      </span>
    </div>
  );

  return (
    <div className="gradient-hero rounded-2xl p-6 sm:p-8 shadow-soft animate-slide-up">
      <div className="flex items-center justify-center gap-3 mb-6">
        <Target className="w-6 h-6 sm:w-8 sm:h-8 text-accent animate-pulse-glow rounded-full" />
        <h2 className="text-xl sm:text-2xl font-bold text-primary-foreground">NEET 2026 Countdown</h2>
        <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
      </div>
      
      <div className="flex items-center justify-center gap-3 sm:gap-6">
        <TimeBlock value={timeLeft.days} label="Days" />
        <div className="text-2xl text-primary-foreground/60 font-light">:</div>
        <TimeBlock value={timeLeft.hours} label="Hours" />
        <div className="text-2xl text-primary-foreground/60 font-light">:</div>
        <TimeBlock value={timeLeft.minutes} label="Mins" />
        <div className="text-2xl text-primary-foreground/60 font-light hidden sm:block">:</div>
        <div className="hidden sm:block">
          <TimeBlock value={timeLeft.seconds} label="Secs" />
        </div>
      </div>

      <p className="text-center text-primary-foreground/70 mt-6 text-sm">
        <Timer className="w-4 h-4 inline-block mr-1" />
        Exam Date: 3rd May, 2026 at 2:00 PM IST
      </p>
    </div>
  );
};

export default CountdownTimer;
