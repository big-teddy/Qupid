-- 연애 박사 앱 완전 데이터베이스 스키마
-- 모든 하드코딩된 데이터를 DB로 관리

-- 1. 사용자 프로필 테이블 (기존 확장)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  user_gender TEXT CHECK (user_gender IN ('male', 'female')),
  experience TEXT,
  confidence TEXT,
  difficulty TEXT,
  interests TEXT[],
  level INTEGER DEFAULT 1,
  experience_points INTEGER DEFAULT 0,
  total_conversations INTEGER DEFAULT 0,
  average_score INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_active_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 대화 세션 테이블
CREATE TABLE conversation_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  persona_id TEXT NOT NULL,
  persona_name TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  total_messages INTEGER DEFAULT 0,
  user_messages INTEGER DEFAULT 0,
  ai_messages INTEGER DEFAULT 0,
  analysis_score INTEGER,
  friendliness_score INTEGER,
  curiosity_score INTEGER,
  empathy_score INTEGER,
  feedback TEXT,
  positive_points TEXT[],
  points_to_improve JSONB,
  is_tutorial BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 대화 메시지 테이블
CREATE TABLE conversation_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES conversation_sessions(id) ON DELETE CASCADE NOT NULL,
  sender TEXT CHECK (sender IN ('user', 'ai', 'system')) NOT NULL,
  message_text TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  message_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 사용자 성취 테이블
CREATE TABLE user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  achievement_description TEXT NOT NULL,
  achievement_icon TEXT NOT NULL,
  achievement_category TEXT NOT NULL,
  acquired BOOLEAN DEFAULT FALSE,
  acquired_date TIMESTAMP WITH TIME ZONE,
  progress_current INTEGER DEFAULT 0,
  progress_total INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- 5. 사용자 배지 테이블
CREATE TABLE user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_description TEXT NOT NULL,
  badge_icon TEXT NOT NULL,
  badge_category TEXT NOT NULL,
  badge_rarity TEXT NOT NULL,
  acquired BOOLEAN DEFAULT FALSE,
  acquired_date TIMESTAMP WITH TIME ZONE,
  progress_current INTEGER DEFAULT 0,
  progress_total INTEGER DEFAULT 1,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- 6. 주간 목표 테이블
CREATE TABLE user_weekly_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  goal_id TEXT NOT NULL,
  goal_title TEXT NOT NULL,
  goal_description TEXT NOT NULL,
  target_value INTEGER NOT NULL,
  current_value INTEGER DEFAULT 0,
  unit TEXT NOT NULL,
  category TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  reward TEXT,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, goal_id, week_start_date)
);

-- 7. 사용자 즐겨찾기 테이블
CREATE TABLE user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  persona_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, persona_id)
);

-- 8. 사용자 맞춤 페르소나 테이블
CREATE TABLE user_custom_personas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female')) NOT NULL,
  job TEXT NOT NULL,
  mbti TEXT NOT NULL,
  intro TEXT NOT NULL,
  avatar TEXT,
  match_rate INTEGER DEFAULT 99,
  personality_traits TEXT[],
  interests JSONB,
  tags TEXT[],
  conversation_preview JSONB,
  system_instruction TEXT,
  description TEXT,
  custom BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. 사용자 성장 통계 테이블
CREATE TABLE user_growth_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  conversations_count INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  average_score INTEGER DEFAULT 0,
  total_duration_minutes INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  experience_gained INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 10. 사용자 학습 목표 테이블
CREATE TABLE user_learning_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  goal_type TEXT NOT NULL,
  goal_value INTEGER NOT NULL,
  current_value INTEGER DEFAULT 0,
  target_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. 사용자 알림 설정 테이블
CREATE TABLE user_notification_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  daily_reminder BOOLEAN DEFAULT TRUE,
  weekly_report BOOLEAN DEFAULT TRUE,
  achievement_notifications BOOLEAN DEFAULT TRUE,
  goal_reminders BOOLEAN DEFAULT TRUE,
  reminder_time TIME DEFAULT '20:00:00',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 인덱스 생성
CREATE INDEX idx_conversation_sessions_user_id ON conversation_sessions(user_id);
CREATE INDEX idx_conversation_sessions_start_time ON conversation_sessions(start_time);
CREATE INDEX idx_conversation_messages_session_id ON conversation_messages(session_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_user_weekly_goals_user_id ON user_weekly_goals(user_id);
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_custom_personas_user_id ON user_custom_personas(user_id);
CREATE INDEX idx_user_growth_stats_user_id ON user_growth_stats(user_id);
CREATE INDEX idx_user_growth_stats_date ON user_growth_stats(date);

-- RLS (Row Level Security) 활성화
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_weekly_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_custom_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_growth_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notification_settings ENABLE ROW LEVEL SECURITY;

-- RLS 정책 생성
-- 사용자 프로필
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 대화 세션
CREATE POLICY "Users can view own conversations" ON conversation_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" ON conversation_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" ON conversation_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- 대화 메시지
CREATE POLICY "Users can view own messages" ON conversation_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_sessions 
      WHERE conversation_sessions.id = conversation_messages.session_id 
      AND conversation_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own messages" ON conversation_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversation_sessions 
      WHERE conversation_sessions.id = conversation_messages.session_id 
      AND conversation_sessions.user_id = auth.uid()
    )
  );

-- 성취
CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own achievements" ON user_achievements
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 배지
CREATE POLICY "Users can view own badges" ON user_badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own badges" ON user_badges
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges" ON user_badges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 주간 목표
CREATE POLICY "Users can view own weekly goals" ON user_weekly_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own weekly goals" ON user_weekly_goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weekly goals" ON user_weekly_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 즐겨찾기
CREATE POLICY "Users can view own favorites" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- 맞춤 페르소나
CREATE POLICY "Users can view own custom personas" ON user_custom_personas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own custom personas" ON user_custom_personas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own custom personas" ON user_custom_personas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own custom personas" ON user_custom_personas
  FOR DELETE USING (auth.uid() = user_id);

-- 성장 통계
CREATE POLICY "Users can view own growth stats" ON user_growth_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own growth stats" ON user_growth_stats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own growth stats" ON user_growth_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 학습 목표
CREATE POLICY "Users can view own learning goals" ON user_learning_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own learning goals" ON user_learning_goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning goals" ON user_learning_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 알림 설정
CREATE POLICY "Users can view own notification settings" ON user_notification_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notification settings" ON user_notification_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification settings" ON user_notification_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 사용자 생성 시 자동으로 프로필 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, user_gender)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', '사용자'),
    NEW.raw_user_meta_data->>'user_gender'
  );
  
  -- 기본 알림 설정 생성
  INSERT INTO public.user_notification_settings (user_id)
  VALUES (NEW.id);
  
  -- 기본 성취 초기화
  INSERT INTO public.user_achievements (user_id, achievement_id, achievement_name, achievement_description, achievement_icon, achievement_category)
  VALUES 
    (NEW.id, 'first_conversation', '첫 대화', '첫 번째 대화를 완료했습니다!', '💬', '대화'),
    (NEW.id, 'conversation_master', '대화 지속왕', '10분 이상 자연스러운 대화를 이어갔습니다!', '⏰', '대화'),
    (NEW.id, 'conversation_king', '대화왕', '50회 대화를 달성했습니다!', '👑', '대화'),
    (NEW.id, 'empathy_master', '공감 마스터', '공감 능력 90점 이상을 달성했습니다!', '💝', '성장'),
    (NEW.id, 'curiosity_expert', '호기심 전문가', '호기심 90점 이상을 달성했습니다!', '🤔', '성장'),
    (NEW.id, 'friendliness_champion', '친근함 챔피언', '친근함 90점 이상을 달성했습니다!', '😊', '성장'),
    (NEW.id, 'streak_3', '열정의 시작', '3일 연속으로 앱을 사용했습니다!', '🔥', '연속'),
    (NEW.id, 'streak_7', '일주일의 기적', '7일 연속으로 앱을 사용했습니다!', '🔥🔥', '연속'),
    (NEW.id, 'streak_30', '한 달의 열정', '30일 연속으로 앱을 사용했습니다!', '🔥🔥🔥', '연속'),
    (NEW.id, 'custom_persona', '나만의 페르소나', '맞춤형 AI 페르소나를 만들었습니다!', '✨', '특별'),
    (NEW.id, 'perfect_score', '완벽한 대화', '대화 분석에서 100점을 달성했습니다!', '🏆', '특별');
  
  -- 기본 배지 초기화
  INSERT INTO public.user_badges (user_id, badge_id, badge_name, badge_description, badge_icon, badge_category, badge_rarity)
  VALUES 
    (NEW.id, 'newcomer', '신규 사용자', '연애 박사에 가입했습니다!', '🌟', '특별', 'Common'),
    (NEW.id, 'first_chat', '첫 대화', '첫 번째 대화를 완료했습니다!', '💬', '대화', 'Common'),
    (NEW.id, 'persistent', '끈기왕', '3일 연속 사용했습니다!', '🔥', '연속', 'Rare'),
    (NEW.id, 'dedicated', '열정가', '7일 연속 사용했습니다!', '🔥🔥', '연속', 'Epic'),
    (NEW.id, 'master', '마스터', '30일 연속 사용했습니다!', '🔥🔥🔥', '연속', 'Epic');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 주간 목표 자동 생성 함수
CREATE OR REPLACE FUNCTION create_weekly_goals_for_user(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
  week_start DATE;
  week_end DATE;
BEGIN
  -- 이번 주 시작과 끝 계산
  week_start := DATE_TRUNC('week', CURRENT_DATE)::DATE;
  week_end := week_start + INTERVAL '6 days';
  
  -- 기존 주간 목표가 없으면 생성
  INSERT INTO user_weekly_goals (user_id, goal_id, goal_title, goal_description, target_value, unit, category, week_start_date, week_end_date)
  SELECT 
    user_uuid,
    'conversations_5',
    '대화 연습',
    '이번 주 5회 대화 완료하기',
    5,
    '회',
    '대화',
    week_start,
    week_end
  WHERE NOT EXISTS (
    SELECT 1 FROM user_weekly_goals 
    WHERE user_id = user_uuid 
    AND goal_id = 'conversations_5' 
    AND week_start_date = week_start
  );
  
  INSERT INTO user_weekly_goals (user_id, goal_id, goal_title, goal_description, target_value, unit, category, week_start_date, week_end_date)
  SELECT 
    user_uuid,
    'score_80',
    '고득점 도전',
    '평균 점수 80점 이상 달성하기',
    80,
    '점',
    '점수',
    week_start,
    week_end
  WHERE NOT EXISTS (
    SELECT 1 FROM user_weekly_goals 
    WHERE user_id = user_uuid 
    AND goal_id = 'score_80' 
    AND week_start_date = week_start
  );
  
  INSERT INTO user_weekly_goals (user_id, goal_id, goal_title, goal_description, target_value, unit, category, week_start_date, week_end_date)
  SELECT 
    user_uuid,
    'time_120',
    '집중 연습',
    '총 연습 시간 120분 달성하기',
    120,
    '분',
    '시간',
    week_start,
    week_end
  WHERE NOT EXISTS (
    SELECT 1 FROM user_weekly_goals 
    WHERE user_id = user_uuid 
    AND goal_id = 'time_120' 
    AND week_start_date = week_start
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 대화 완료 시 통계 업데이트 함수
CREATE OR REPLACE FUNCTION update_user_stats_after_conversation()
RETURNS TRIGGER AS $$
DECLARE
  session_duration INTEGER;
  avg_score INTEGER;
BEGIN
  -- 세션 지속 시간 계산 (초 단위)
  session_duration := EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time))::INTEGER;
  
  -- 사용자 프로필 업데이트
  UPDATE user_profiles 
  SET 
    total_conversations = total_conversations + 1,
    average_score = CASE 
      WHEN total_conversations = 0 THEN NEW.analysis_score
      ELSE ((average_score * total_conversations) + NEW.analysis_score) / (total_conversations + 1)
    END,
    experience_points = experience_points + 50 + 
      CASE 
        WHEN NEW.analysis_score >= 90 THEN 30
        WHEN NEW.analysis_score >= 80 THEN 20
        WHEN NEW.analysis_score >= 70 THEN 10
        ELSE 0
      END +
      CASE 
        WHEN session_duration >= 600 THEN 20  -- 10분 이상
        WHEN session_duration >= 300 THEN 10  -- 5분 이상
        ELSE 0
      END,
    level = CASE 
      WHEN experience_points >= 1000 THEN 10
      WHEN experience_points >= 900 THEN 9
      WHEN experience_points >= 800 THEN 8
      WHEN experience_points >= 700 THEN 7
      WHEN experience_points >= 600 THEN 6
      WHEN experience_points >= 500 THEN 5
      WHEN experience_points >= 400 THEN 4
      WHEN experience_points >= 300 THEN 3
      WHEN experience_points >= 200 THEN 2
      ELSE 1
    END,
    last_active_date = NOW(),
    updated_at = NOW()
  WHERE id = NEW.user_id;
  
  -- 성장 통계 업데이트
  INSERT INTO user_growth_stats (user_id, date, conversations_count, total_score, average_score, total_duration_minutes, experience_gained)
  VALUES (
    NEW.user_id,
    CURRENT_DATE,
    1,
    NEW.analysis_score,
    NEW.analysis_score,
    session_duration / 60,
    50 + 
      CASE 
        WHEN NEW.analysis_score >= 90 THEN 30
        WHEN NEW.analysis_score >= 80 THEN 20
        WHEN NEW.analysis_score >= 70 THEN 10
        ELSE 0
      END +
      CASE 
        WHEN session_duration >= 600 THEN 20
        WHEN session_duration >= 300 THEN 10
        ELSE 0
      END
  )
  ON CONFLICT (user_id, date) DO UPDATE SET
    conversations_count = user_growth_stats.conversations_count + 1,
    total_score = user_growth_stats.total_score + NEW.analysis_score,
    average_score = (user_growth_stats.total_score + NEW.analysis_score) / (user_growth_stats.conversations_count + 1),
    total_duration_minutes = user_growth_stats.total_duration_minutes + (session_duration / 60),
    experience_gained = user_growth_stats.experience_gained + 50 + 
      CASE 
        WHEN NEW.analysis_score >= 90 THEN 30
        WHEN NEW.analysis_score >= 80 THEN 20
        WHEN NEW.analysis_score >= 70 THEN 10
        ELSE 0
      END +
      CASE 
        WHEN session_duration >= 600 THEN 20
        WHEN session_duration >= 300 THEN 10
        ELSE 0
      END,
    updated_at = NOW();
  
  -- 주간 목표 업데이트
  UPDATE user_weekly_goals 
  SET 
    current_value = CASE 
      WHEN goal_id = 'conversations_5' THEN current_value + 1
      WHEN goal_id = 'score_80' THEN 
        CASE 
          WHEN NEW.analysis_score >= 80 THEN current_value + 1
          ELSE current_value
        END
      WHEN goal_id = 'time_120' THEN current_value + (session_duration / 60)
      ELSE current_value
    END,
    completed = CASE 
      WHEN goal_id = 'conversations_5' AND current_value + 1 >= target_value THEN TRUE
      WHEN goal_id = 'score_80' AND NEW.analysis_score >= 80 THEN TRUE
      WHEN goal_id = 'time_120' AND current_value + (session_duration / 60) >= target_value THEN TRUE
      ELSE completed
    END,
    updated_at = NOW()
  WHERE user_id = NEW.user_id 
    AND week_start_date <= CURRENT_DATE 
    AND week_end_date >= CURRENT_DATE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_conversation_completed
  AFTER UPDATE OF end_time ON conversation_sessions
  FOR EACH ROW
  WHEN (OLD.end_time IS NULL AND NEW.end_time IS NOT NULL)
  EXECUTE PROCEDURE update_user_stats_after_conversation();

-- 연속 사용 일수 업데이트 함수
CREATE OR REPLACE FUNCTION update_streak_days()
RETURNS TRIGGER AS $$
DECLARE
  last_active DATE;
  current_streak INTEGER;
BEGIN
  -- 마지막 활동일 가져오기
  SELECT last_active_date::DATE INTO last_active
  FROM user_profiles
  WHERE id = NEW.user_id;
  
  -- 연속 일수 계산
  IF last_active = CURRENT_DATE - INTERVAL '1 day' THEN
    -- 연속 사용
    UPDATE user_profiles 
    SET streak_days = streak_days + 1
    WHERE id = NEW.user_id;
  ELSIF last_active < CURRENT_DATE - INTERVAL '1 day' THEN
    -- 연속 끊김
    UPDATE user_profiles 
    SET streak_days = 1
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_user_activity
  AFTER UPDATE OF last_active_date ON user_profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_streak_days(); 