import { useState, useEffect } from 'react';
import { Quote, Sparkles } from 'lucide-react';

const QUOTES = [
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Your limitation—it's only your imagination.", author: "Unknown" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
  { text: "Little things make big days.", author: "Unknown" },
  { text: "It's going to be hard, but hard does not mean impossible.", author: "Unknown" },
  { text: "Don't wait for opportunity. Create it.", author: "Unknown" },
  { text: "Sometimes we're tested not to show our weaknesses, but to discover our strengths.", author: "Unknown" },
  { text: "The key to success is to focus on goals, not obstacles.", author: "Unknown" },
  { text: "Dream bigger. Do bigger.", author: "Unknown" },
  { text: "Difficult roads often lead to beautiful destinations.", author: "Unknown" },
  { text: "You are capable of amazing things.", author: "Unknown" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "A year from now you may wish you had started today.", author: "Karen Lamb" },
  { text: "Every expert was once a beginner.", author: "Helen Hayes" },
  { text: "Your only limit is you.", author: "Unknown" },
  { text: "Strive for progress, not perfection.", author: "Unknown" },
];

const DailyQuote = () => {
  const [quote, setQuote] = useState({ text: '', author: '' });

  useEffect(() => {
    // Get a quote based on the day of year for consistency
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const quoteIndex = dayOfYear % QUOTES.length;
    setQuote(QUOTES[quoteIndex]);
  }, []);

  return (
    <div className="bg-card rounded-xl p-4 shadow-card border border-border animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-accent/20 shrink-0">
          <Sparkles className="h-4 w-4 text-accent" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-foreground italic leading-relaxed">
            "{quote.text}"
          </p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Quote className="h-3 w-3" />
            {quote.author}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyQuote;
