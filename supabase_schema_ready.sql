-- 연애 박사 앱 - Supabase DB 스키마 (Dashboard용)
-- Supabase Dashboard → SQL Editor에서 실행하세요

-- ========================================
-- 1. 사용자 관리 (Users)
-- ========================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    user_gender VARCHAR(10) CHECK (user_gender IN ('male', 'female')),
    experience VARCHAR(50),
    confidence VARCHAR(50),
    difficulty VARCHAR(50),
    interests TEXT[],
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium', 'pro')),
    subscription_expires_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- 2. 페르소나 관리 (Personas)
-- ========================================

CREATE TABLE IF NOT EXISTS personas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    age INTEGER CHECK (age >= 18 AND age <= 80),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    job VARCHAR(100),
    mbti VARCHAR(4),
    intro TEXT,
    avatar TEXT,
    match_rate INTEGER DEFAULT 0 CHECK (match_rate >= 0 AND match_rate <= 100),
    personality_traits TEXT[],
    interests JSONB,
    tags TEXT[],
    conversation_preview JSONB,
    custom BOOLEAN DEFAULT FALSE,
    description TEXT,
    system_instruction TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- ========================================
-- 3. 대화 관리 (Conversations & Messages)
-- ========================================

CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    persona_id UUID REFERENCES personas(id) ON DELETE SET NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    summary TEXT,
    total_score INTEGER DEFAULT 0 CHECK (total_score >= 0 AND total_score <= 100),
    feedback TEXT,
    friendliness_score INTEGER DEFAULT 0 CHECK (friendliness_score >= 0 AND friendliness_score <= 100),
    curiosity_score INTEGER DEFAULT 0 CHECK (curiosity_score >= 0 AND curiosity_score <= 100),
    empathy_score INTEGER DEFAULT 0 CHECK (empathy_score >= 0 AND empathy_score <= 100),
    positive_points TEXT[],
    points_to_improve JSONB,
    is_tutorial BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender VARCHAR(10) NOT NULL CHECK (sender IN ('user', 'ai', 'system')),
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    message_order INTEGER DEFAULT 0
);

-- ========================================
-- 4. 즐겨찾기 관리 (Favorites)
-- ========================================

CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    persona_id UUID REFERENCES personas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, persona_id)
);

-- ========================================
-- 5. 배지 시스템 (Badges)
-- ========================================

CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    category VARCHAR(20) CHECK (category IN ('대화', '성장', '특별')),
    rarity VARCHAR(20) CHECK (rarity IN ('Common', 'Rare', 'Epic', 'Legendary')),
    criteria JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress JSONB,
    UNIQUE(user_id, badge_id)
);

-- ========================================
-- 6. 성장 기록 (Performance)
-- ========================================

CREATE TABLE IF NOT EXISTS performance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    weekly_score INTEGER DEFAULT 0 CHECK (weekly_score >= 0 AND weekly_score <= 100),
    score_change INTEGER DEFAULT 0,
    score_change_percentage DECIMAL(5,2) DEFAULT 0,
    daily_scores INTEGER[],
    radar_data JSONB,
    stats JSONB,
    category_scores JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, week_start_date)
);

-- ========================================
-- 7. 알림 시스템 (Notifications)
-- ========================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 8. 설정 관리 (Settings)
-- ========================================

CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, setting_key)
);

-- ========================================
-- 9. 학습 목표 (Learning Goals)
-- ========================================

CREATE TABLE IF NOT EXISTS learning_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    target_score INTEGER DEFAULT 0 CHECK (target_score >= 0 AND target_score <= 100),
    current_score INTEGER DEFAULT 0 CHECK (current_score >= 0 AND current_score <= 100),
    deadline DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 10. 스타일링 코치 (Styling Coach)
-- ========================================

CREATE TABLE IF NOT EXISTS styling_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    response_text TEXT,
    response_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 11. 인덱스 생성
-- ========================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_personas_user_id ON personas(user_id);
CREATE INDEX IF NOT EXISTS idx_personas_gender ON personas(gender);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_records_user_id ON performance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- ========================================
-- 12. RLS 정책
-- ========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE styling_requests ENABLE ROW LEVEL SECURITY;

-- 기본 RLS 정책들
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own personas" ON personas FOR SELECT USING (auth.uid() = user_id OR custom = FALSE);
CREATE POLICY "Users can insert own personas" ON personas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own personas" ON personas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own personas" ON personas FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON conversations FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id AND conversations.user_id = auth.uid())
);
CREATE POLICY "Users can insert own messages" ON messages FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id AND conversations.user_id = auth.uid())
);

CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges" ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own performance" ON performance_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own performance" ON performance_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own performance" ON performance_records FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notifications" ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own goals" ON learning_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON learning_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON learning_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON learning_goals FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own styling requests" ON styling_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own styling requests" ON styling_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ========================================
-- 13. 기본 데이터 삽입
-- ========================================

INSERT INTO badges (name, description, icon, category, rarity, criteria) VALUES
('첫 대화', '첫 번째 대화를 완료했습니다', '💬', '대화', 'Common', '{"type": "first_conversation"}'),
('열정적인 학습자', '일주일 연속으로 대화를 완료했습니다', '🔥', '성장', 'Rare', '{"type": "consecutive_days", "days": 7}'),
('공감의 달인', '공감 점수 90점 이상을 달성했습니다', '❤️', '대화', 'Epic', '{"type": "empathy_score", "score": 90}'),
('호기심 천재', '호기심 점수 90점 이상을 달성했습니다', '🤔', '대화', 'Epic', '{"type": "curiosity_score", "score": 90}'),
('친근함의 달인', '친근함 점수 90점 이상을 달성했습니다', '😊', '대화', 'Epic', '{"type": "friendliness_score", "score": 90}'),
('맞춤 페르소나 마스터', '맞춤 페르소나를 5개 이상 생성했습니다', '🎭', '특별', 'Legendary', '{"type": "custom_personas", "count": 5}'),
('스타일링 전문가', '스타일링 코치를 10번 이상 이용했습니다', '👗', '특별', 'Rare', '{"type": "styling_requests", "count": 10}'),
('목표 달성자', '학습 목표를 3개 이상 달성했습니다', '🎯', '성장', 'Epic', '{"type": "completed_goals", "count": 3}');

-- ========================================
-- 완료 메시지
-- ========================================

-- 🎉 스키마 생성 완료!
-- 이제 앱에서 이 테이블들을 사용할 수 있습니다. 