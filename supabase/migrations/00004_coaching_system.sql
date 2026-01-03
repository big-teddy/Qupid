-- Create coaching_goals table
CREATE TABLE IF NOT EXISTS public.coaching_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    deadline DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_growth_stats table
CREATE TABLE IF NOT EXISTS public.user_growth_stats (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    friendliness_exp INTEGER DEFAULT 0,
    curiosity_exp INTEGER DEFAULT 0,
    empathy_exp INTEGER DEFAULT 0,
    total_level INTEGER DEFAULT 1,
    last_analyzed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.coaching_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_growth_stats ENABLE ROW LEVEL SECURITY;

-- Policies for coaching_goals
CREATE POLICY "Users can view their own coaching goals"
    ON public.coaching_goals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coaching goals"
    ON public.coaching_goals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coaching goals"
    ON public.coaching_goals FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own coaching goals"
    ON public.coaching_goals FOR DELETE
    USING (auth.uid() = user_id);

-- Policies for user_growth_stats
CREATE POLICY "Users can view their own growth stats"
    ON public.user_growth_stats FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update their own growth stats"
    ON public.user_growth_stats FOR ALL
    USING (auth.uid() = user_id);

-- Grant permissions (if needed, usually auto-handled by Supabase but good for clarity)
GRANT ALL ON public.coaching_goals TO authenticated;
GRANT ALL ON public.user_growth_stats TO authenticated;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_coaching_goals_updated_at
    BEFORE UPDATE ON public.coaching_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_growth_stats_updated_at
    BEFORE UPDATE ON public.user_growth_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
