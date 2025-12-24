-- Create push_subscriptions table to store user notification subscriptions
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create subscriptions (for non-logged in users too)
CREATE POLICY "Anyone can create push subscriptions"
ON public.push_subscriptions
FOR INSERT
WITH CHECK (true);

-- Allow anyone to view their own subscriptions by endpoint
CREATE POLICY "Anyone can view subscriptions"
ON public.push_subscriptions
FOR SELECT
USING (true);

-- Allow deletion of subscriptions
CREATE POLICY "Anyone can delete subscriptions"
ON public.push_subscriptions
FOR DELETE
USING (true);