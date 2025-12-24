import { useState, useEffect } from 'react';
import { Quote, Sparkles } from 'lucide-react';

const QUOTES = [
  // Motivational quotes for NEET aspirants
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
  // Medical/NEET specific quotes
  { text: "Wherever the art of medicine is loved, there is also a love of humanity.", author: "Hippocrates" },
  { text: "The good physician treats the disease; the great physician treats the patient.", author: "William Osler" },
  { text: "Medicine is not only a science; it is also an art.", author: "Paracelsus" },
  { text: "To study medicine is to study the nature of life itself.", author: "Unknown" },
  { text: "Every doctor was once a struggling student. Your journey to AIIMS starts today!", author: "Unknown" },
  { text: "NEET is just one exam, but your dedication defines your entire career.", author: "Unknown" },
  { text: "12 hours of study today = A lifetime of saving lives tomorrow.", author: "Unknown" },
  { text: "Your NCERT is your Bible. Master it, and NEET will master nothing over you.", author: "Unknown" },
  { text: "Every MCQ you solve today is a patient you'll save tomorrow.", author: "Unknown" },
  { text: "AIIMS Delhi is not a dream, it's a destination. Keep walking!", author: "Unknown" },
  { text: "Biology is life. Chemistry is change. Physics is motion. Master all three!", author: "Unknown" },
  { text: "The stethoscope around your neck will make all these sacrifices worth it.", author: "Unknown" },
  { text: "Sleep is optional when your dream of MBBS is not!", author: "Unknown" },
  { text: "One year of struggle, lifetime of respect. Keep going, future doctor!", author: "Unknown" },
  { text: "Your rank doesn't define you, but your dedication does.", author: "Unknown" },
  { text: "Chemistry formulas fade, but the habit of hard work stays forever.", author: "Unknown" },
  { text: "Physics problems are tough, but so are you!", author: "Unknown" },
  { text: "Biology is memory, Chemistry is understanding, Physics is logic. Balance all!", author: "Unknown" },
  { text: "Don't count the days, make the days count for NEET 2026!", author: "Unknown" },
  { text: "The white coat is waiting for you. Are you ready to claim it?", author: "Unknown" },
  // Study motivation
  { text: "One more hour of study today, one step closer to your medical seat.", author: "Unknown" },
  { text: "Your parents sacrificed for your coaching. Don't waste their money, ace NEET!", author: "Unknown" },
  { text: "Revision is the mother of learning. Revise daily!", author: "Unknown" },
  { text: "PYQs are gold. Solve them like your rank depends on them—because it does!", author: "Unknown" },
  { text: "Don't compare your Chapter 1 to someone's Chapter 20.", author: "Unknown" },
  { text: "Consistency beats intensity. Study 8 hours daily, not 16 hours once a week.", author: "Unknown" },
  { text: "Mock tests are practice surgeries. The more you do, the better you get!", author: "Unknown" },
  { text: "Your phone is your enemy. Your books are your weapons. Choose wisely!", author: "Unknown" },
  { text: "Every topper was once a backbencher who decided to change.", author: "Unknown" },
  { text: "NEET is a marathon, not a sprint. Pace yourself!", author: "Unknown" },
];

const DailyQuote = () => {
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Get a unique quote for each day based on date
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const quoteIndex = dayOfYear % QUOTES.length;
    setQuote(QUOTES[quoteIndex]);
    
    // Animate on mount
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`bg-card rounded-xl p-4 shadow-card border border-border ${isAnimating ? 'animate-fade-in' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-accent/20 shrink-0">
          <Sparkles className="h-4 w-4 text-accent animate-pulse" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-primary mb-1">Quote of the Day</p>
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
