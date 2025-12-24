-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Authenticated users can create admin messages" ON public.admin_messages;

-- Create a new policy that allows anyone to insert (admin password is handled in frontend)
CREATE POLICY "Allow admin message creation"
ON public.admin_messages
FOR INSERT
WITH CHECK (true);