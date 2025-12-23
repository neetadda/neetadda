-- Create tables for NEET Tracker data persistence

-- Tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  completed BOOLEAN, -- null = pending, true = done, false = skipped
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Coaching attendance table
CREATE TABLE public.coaching_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date TEXT NOT NULL UNIQUE,
  attended BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Study hours table
CREATE TABLE public.study_hours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date TEXT NOT NULL UNIQUE,
  hours DECIMAL(4,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Water to sun table
CREATE TABLE public.water_sun (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date TEXT NOT NULL UNIQUE,
  completed BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Weekly goals table
CREATE TABLE public.weekly_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start TEXT NOT NULL,
  target_hours DECIMAL(4,1) NOT NULL DEFAULT 35,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_start)
);

-- User settings table
CREATE TABLE public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  last_active_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_sun ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tasks
CREATE POLICY "Users can view their own tasks" ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON public.tasks FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for coaching_attendance
CREATE POLICY "Users can view their coaching" ON public.coaching_attendance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their coaching" ON public.coaching_attendance FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their coaching" ON public.coaching_attendance FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their coaching" ON public.coaching_attendance FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for study_hours
CREATE POLICY "Users can view their study hours" ON public.study_hours FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their study hours" ON public.study_hours FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their study hours" ON public.study_hours FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their study hours" ON public.study_hours FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for water_sun
CREATE POLICY "Users can view their water sun" ON public.water_sun FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their water sun" ON public.water_sun FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their water sun" ON public.water_sun FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their water sun" ON public.water_sun FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for weekly_goals
CREATE POLICY "Users can view their weekly goals" ON public.weekly_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their weekly goals" ON public.weekly_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their weekly goals" ON public.weekly_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their weekly goals" ON public.weekly_goals FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_settings
CREATE POLICY "Users can view their settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);