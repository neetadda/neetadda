import { useState, useEffect } from 'react';
import { Bell, BellRing, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNotifications } from '@/hooks/useNotifications';

const NotificationPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { requestPermission } = useNotifications();

  useEffect(() => {
    // Check if notifications are supported and not yet granted
    if ('Notification' in window && Notification.permission === 'default') {
      // Check if user has dismissed before
      const wasDismissed = localStorage.getItem('notification-prompt-dismissed');
      if (!wasDismissed) {
        // Show after 5 seconds
        const timer = setTimeout(() => setShowPrompt(true), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleEnable = async () => {
    const granted = await requestPermission();
    if (granted) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('notification-prompt-dismissed', 'true');
  };

  if (!showPrompt || dismissed) return null;

  return (
    <Card className="fixed bottom-24 left-4 right-4 max-w-md mx-auto p-4 bg-card border-primary/20 shadow-lg z-50 animate-slide-up">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>
      
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/20 shrink-0">
          <BellRing className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">Enable Notifications</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Get daily reminders for study goals, coaching attendance, and tomorrow's tasks!
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDismiss}
              className="text-xs"
            >
              Not now
            </Button>
            <Button
              size="sm"
              onClick={handleEnable}
              className="text-xs gradient-primary text-primary-foreground"
            >
              <Bell className="h-3 w-3 mr-1" />
              Enable
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NotificationPrompt;
