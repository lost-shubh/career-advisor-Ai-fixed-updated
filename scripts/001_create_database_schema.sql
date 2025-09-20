-- Create users profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('student', 'mentor', 'counselor', 'admin')) DEFAULT 'student',
  bio TEXT,
  skills TEXT[],
  experience_level TEXT,
  location TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mentors table for detailed mentor information
CREATE TABLE IF NOT EXISTS public.mentors (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  specialization TEXT[],
  years_experience INTEGER,
  hourly_rate DECIMAL(10,2),
  availability TEXT,
  languages TEXT[],
  rating DECIMAL(3,2) DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create curriculum table
CREATE TABLE IF NOT EXISTS public.curriculum (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  field TEXT NOT NULL,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration_weeks INTEGER,
  skills_covered TEXT[],
  prerequisites TEXT[],
  career_outcomes TEXT[],
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  mentor_id UUID REFERENCES public.mentors(id) ON DELETE CASCADE,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  meeting_link TEXT,
  notes TEXT,
  price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_sessions table for AI chatbot
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- RLS Policies for mentors (viewable by all, editable by owner)
CREATE POLICY "mentors_select_all" ON public.mentors FOR SELECT USING (true);
CREATE POLICY "mentors_insert_own" ON public.mentors FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "mentors_update_own" ON public.mentors FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "mentors_delete_own" ON public.mentors FOR DELETE USING (auth.uid() = id);

-- RLS Policies for curriculum (viewable by all, editable by creator)
CREATE POLICY "curriculum_select_all" ON public.curriculum FOR SELECT USING (true);
CREATE POLICY "curriculum_insert_authenticated" ON public.curriculum FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "curriculum_update_creator" ON public.curriculum FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "curriculum_delete_creator" ON public.curriculum FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for bookings
CREATE POLICY "bookings_select_involved" ON public.bookings FOR SELECT USING (
  auth.uid() = student_id OR 
  auth.uid() IN (SELECT id FROM public.mentors WHERE id = mentor_id)
);
CREATE POLICY "bookings_insert_student" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "bookings_update_involved" ON public.bookings FOR UPDATE USING (
  auth.uid() = student_id OR 
  auth.uid() IN (SELECT id FROM public.mentors WHERE id = mentor_id)
);

-- RLS Policies for feedback
CREATE POLICY "feedback_select_involved" ON public.feedback FOR SELECT USING (
  auth.uid() = from_user_id OR auth.uid() = to_user_id
);
CREATE POLICY "feedback_insert_own" ON public.feedback FOR INSERT WITH CHECK (auth.uid() = from_user_id);

-- RLS Policies for chat sessions
CREATE POLICY "chat_sessions_select_own" ON public.chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "chat_sessions_insert_own" ON public.chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "chat_sessions_update_own" ON public.chat_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "chat_sessions_delete_own" ON public.chat_sessions FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for chat messages
CREATE POLICY "chat_messages_select_own" ON public.chat_messages FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM public.chat_sessions WHERE id = session_id)
);
CREATE POLICY "chat_messages_insert_own" ON public.chat_messages FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM public.chat_sessions WHERE id = session_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_mentors_specialization ON public.mentors USING GIN(specialization);
CREATE INDEX IF NOT EXISTS idx_curriculum_field ON public.curriculum(field);
CREATE INDEX IF NOT EXISTS idx_bookings_student_id ON public.bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_mentor_id ON public.bookings(mentor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_session_date ON public.bookings(session_date);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
