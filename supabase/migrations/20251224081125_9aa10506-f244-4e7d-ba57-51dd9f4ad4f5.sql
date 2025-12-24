-- Create admin messages table for scheduled notifications
CREATE TABLE public.admin_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read messages (for notifications)
CREATE POLICY "Anyone can view admin messages"
ON public.admin_messages
FOR SELECT
USING (true);

-- Only authenticated users can create messages (we'll use password check in app)
CREATE POLICY "Authenticated users can create admin messages"
ON public.admin_messages
FOR INSERT
TO authenticated
WITH CHECK (true);