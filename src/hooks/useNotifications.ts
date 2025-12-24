import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { loadData, getDateString } from '@/lib/storage';

export const useNotifications = () => {
  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }, []);

  // Show notification
  const showNotification = useCallback((title: string, body: string, icon?: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'neet-tracker',
        requireInteraction: true,
      });
    }
  }, []);

  // Check for daily reminders
  const checkDailyReminders = useCallback(() => {
    const data = loadData();
    const today = getDateString();
    const now = new Date();
    const hour = now.getHours();

    // Morning reminder (8 AM) - Study and Water to Sun
    if (hour === 8) {
      const waterSunDone = data.waterSun.find(e => e.date === today && e.completed);
      if (!waterSunDone) {
        showNotification(
          '🌅 Good Morning, Future Doctor!',
          'Have you offered water to sun today? Start your day blessed!'
        );
      }
    }

    // Afternoon reminder (2 PM) - Study hours check
    if (hour === 14) {
      const studyEntry = data.studyHours.find(e => e.date === today);
      if (!studyEntry || studyEntry.hours < 4) {
        showNotification(
          '📚 Study Reminder',
          "How's your study going? Log your hours and stay on track for NEET!"
        );
      }
    }

    // Evening reminder (6 PM) - Coaching check
    if (hour === 18) {
      const coachingDone = data.coaching.find(e => e.date === today);
      if (!coachingDone) {
        showNotification(
          '🎓 Coaching Check',
          "Did you attend coaching today? Mark your attendance!"
        );
      }
    }

    // Night reminder (9 PM) - Tomorrow's tasks
    if (hour === 21) {
      const tomorrowTasks = data.tasks.filter(t => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return t.date === tomorrow.toISOString().split('T')[0];
      });
      
      if (tomorrowTasks.length === 0) {
        showNotification(
          '📝 Plan Tomorrow',
          "Don't forget to add your tasks for tomorrow before sleeping!"
        );
      }
    }
  }, [showNotification]);

  // Check for admin messages
  const checkAdminMessages = useCallback(async () => {
    try {
      const now = new Date();
      
      const { data: messages, error } = await supabase
        .from('admin_messages')
        .select('*')
        .eq('sent', false)
        .lte('scheduled_at', now.toISOString())
        .order('scheduled_at', { ascending: true });

      if (error) {
        console.error('Error fetching admin messages:', error);
        return;
      }

      if (messages && messages.length > 0) {
        for (const msg of messages) {
          // Show notification
          showNotification('📢 Message from Coach', msg.message);
          
          // Also show as toast for in-app visibility
          toast.info(msg.message, {
            duration: 10000,
            icon: '📢',
          });

          // Mark as sent (we can't update due to RLS, so we just skip)
          // In a real app, you'd have an edge function to mark messages as sent
        }
      }
    } catch (error) {
      console.error('Error checking admin messages:', error);
    }
  }, [showNotification]);

  // Initialize notifications
  useEffect(() => {
    requestPermission().then((granted) => {
      if (granted) {
        // Check immediately
        checkDailyReminders();
        checkAdminMessages();

        // Set up intervals
        const reminderInterval = setInterval(checkDailyReminders, 60 * 60 * 1000); // Every hour
        const messageInterval = setInterval(checkAdminMessages, 5 * 60 * 1000); // Every 5 minutes

        return () => {
          clearInterval(reminderInterval);
          clearInterval(messageInterval);
        };
      }
    });
  }, [requestPermission, checkDailyReminders, checkAdminMessages]);

  return { requestPermission, showNotification };
};
