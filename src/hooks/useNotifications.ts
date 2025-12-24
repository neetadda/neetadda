import { useEffect, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { loadData, getDateString } from '@/lib/storage';

// VAPID public key for push notifications - you would generate this
const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const useNotifications = () => {
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        setSwRegistration(registration);
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return null;
      }
    }
    return null;
  }, []);

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async (registration: ServiceWorkerRegistration) => {
    try {
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });
      }

      // Store subscription in database
      const subscriptionJSON = subscription.toJSON();
      if (subscriptionJSON.endpoint && subscriptionJSON.keys) {
        // Use type assertion for the table that's not in generated types yet
        const { error } = await (supabase.from('push_subscriptions' as any) as any)
          .upsert({
            endpoint: subscriptionJSON.endpoint,
            p256dh: subscriptionJSON.keys.p256dh,
            auth: subscriptionJSON.keys.auth,
          }, { onConflict: 'endpoint' });

        if (error) {
          console.error('Error saving push subscription:', error);
        } else {
          console.log('Push subscription saved successfully');
        }
      }

      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push:', error);
      return null;
    }
  }, []);

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
      if (permission === 'granted') {
        // Register service worker and subscribe to push after permission granted
        const registration = await registerServiceWorker();
        if (registration) {
          await subscribeToPush(registration);
        }
      }
      return permission === 'granted';
    }

    return false;
  }, [registerServiceWorker, subscribeToPush]);

  // Show notification
  const showNotification = useCallback((title: string, body: string, icon?: string) => {
    if (Notification.permission === 'granted') {
      // Use service worker registration if available for better mobile support
      if (swRegistration) {
        swRegistration.showNotification(title, {
          body,
          icon: icon || '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'neet-tracker',
          requireInteraction: true,
        });
      } else {
        new Notification(title, {
          body,
          icon: icon || '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'neet-tracker',
          requireInteraction: true,
        });
      }
    }
  }, [swRegistration]);

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

          // Mark as sent via edge function
          try {
            await supabase.functions.invoke('send-notifications');
          } catch (e) {
            console.error('Error invoking send-notifications:', e);
          }
        }
      }
    } catch (error) {
      console.error('Error checking admin messages:', error);
    }
  }, [showNotification]);

  // Initialize notifications
  useEffect(() => {
    // Register service worker immediately
    registerServiceWorker().then((registration) => {
      if (registration && Notification.permission === 'granted') {
        subscribeToPush(registration);
      }
    });

    requestPermission().then((granted) => {
      if (granted) {
        // Check immediately
        checkDailyReminders();
        checkAdminMessages();

        // Set up intervals
        const reminderInterval = setInterval(checkDailyReminders, 60 * 60 * 1000); // Every hour
        const messageInterval = setInterval(checkAdminMessages, 60 * 1000); // Every minute

        return () => {
          clearInterval(reminderInterval);
          clearInterval(messageInterval);
        };
      }
    });
  }, [requestPermission, checkDailyReminders, checkAdminMessages, registerServiceWorker, subscribeToPush]);

  return { requestPermission, showNotification };
};
