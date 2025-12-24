import { useState } from 'react';
import { Send, Lock, Calendar, Clock, MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ADMIN_PASSWORD = 'Naitik1309';

interface AdminMessagePanelProps {
  onClose: () => void;
}

const AdminMessagePanel = ({ onClose }: AdminMessagePanelProps) => {
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim() || !date || !time) {
      toast.error('Please fill all fields');
      return;
    }

    setIsSending(true);
    try {
      const scheduledAt = new Date(`${date}T${time}`);
      
      if (scheduledAt <= new Date()) {
        toast.error('Please select a future date and time');
        setIsSending(false);
        return;
      }

      const { error } = await supabase
        .from('admin_messages')
        .insert({
          message: message.trim(),
          scheduled_at: scheduledAt.toISOString(),
        });

      if (error) throw error;

      toast.success('Message scheduled successfully!');
      setMessage('');
      setDate('');
      setTime('');
      onClose();
    } catch (error) {
      console.error('Error scheduling message:', error);
      toast.error('Failed to schedule message');
    } finally {
      setIsSending(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          Message
        </label>
        <Textarea
          placeholder="Enter your motivational message for students..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Date
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={today}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Time
          </label>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          className="flex-1 gradient-primary text-primary-foreground"
          onClick={handleSubmit}
          disabled={isSending}
        >
          <Send className="h-4 w-4 mr-2" />
          {isSending ? 'Scheduling...' : 'Schedule Message'}
        </Button>
      </div>
    </div>
  );
};

// Password dialog component
interface AdminButtonProps {
  className?: string;
}

const AdminButton = ({ className }: AdminButtonProps) => {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showMessagePanel, setShowMessagePanel] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setShowPasswordDialog(false);
      setShowMessagePanel(true);
      setPassword('');
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className={`w-full border-primary/50 text-primary hover:bg-primary/10 ${className}`}
        onClick={() => setShowPasswordDialog(true)}
      >
        <Lock className="h-4 w-4 mr-2" />
        Send Message to Students
      </Button>

      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Admin Access
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter admin password to continue
            </p>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowPasswordDialog(false);
                  setPassword('');
                  setError('');
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 gradient-primary text-primary-foreground"
                onClick={handlePasswordSubmit}
              >
                Verify
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Panel Dialog */}
      <Dialog open={showMessagePanel} onOpenChange={setShowMessagePanel}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Schedule Message
            </DialogTitle>
          </DialogHeader>
          <AdminMessagePanel onClose={() => setShowMessagePanel(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminButton;
