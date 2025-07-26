-- 연애 박사 앱 - Supabase 데이터베이스 설정
-- Supabase Dashboard의 SQL Editor에서 실행하세요

-- ========================================
-- 1. 기존 테이블 삭제 (필요시)
-- ========================================

-- 기존 테이블들이 있다면 삭제
DROP TABLE IF EXISTS styling_requests CASCADE;
DROP TABLE IF EXISTS learning_goals CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS performance_records CASCADE;
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS badges CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS personas CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ========================================
-- 2. 사용자 관리 (Users)
-- ========================================

-- 사용자 프로필 테이블
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    user_gender VARCHAR(10) CHECK (user_gender IN ('male', 'female')),
    experience VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
    confidence VARCHAR(50), -- 'low', 'medium', 'high'
    difficulty VARCHAR(50), -- 'approach', 'conversation', 'relationship'
    interests TEXT[], -- 배열로 관심사 저장
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium', 'pro')),
    subscription_expires_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- 3. 페르소나 관리 (Personas)
-- ========================================

-- 페르소나 테이블
CREATE TABLE personas (
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
    personality_traits TEXT[], -- 배열로 성격 특성 저장
    interests JSONB, -- JSON 형태로 관심사 저장 (emoji, topic, description)
    tags TEXT[], -- 배열로 태그 저장
    conversation_preview JSONB, -- JSON 형태로 대화 미리보기 저장
    custom BOOLEAN DEFAULT FALSE, -- 맞춤 페르소나 여부
    description TEXT, -- 맞춤 페르소나용 상세 설명
    system_instruction TEXT, -- AI 시스템 지시사항
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- ========================================
-- 4. 대화 관리 (Conversations & Messages)
-- ========================================

-- 대화 세션 테이블
CREATE TABLE conversations (
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
    points_to_improve JSONB, -- JSON 형태로 개선점 저장
    is_tutorial BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 대화 메시지 테이블
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender VARCHAR(10) NOT NULL CHECK (sender IN ('user', 'ai', 'system')),
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    message_order INTEGER DEFAULT 0 -- 메시지 순서
);

-- ========================================
-- 5. 즐겨찾기 관리 (Favorites)
-- ========================================

-- 즐겨찾기 테이블
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    persona_id UUID REFERENCES personas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, persona_id) -- 중복 방지
);

-- ========================================
-- 6. 배지 및 성취 관리
-- ========================================

-- 배지 테이블
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    badge_name VARCHAR(100) NOT NULL,
    badge_description TEXT,
    badge_icon VARCHAR(50),
    badge_category VARCHAR(50),
    badge_rarity VARCHAR(20) CHECK (badge_rarity IN ('common', 'rare', 'epic', 'legendary')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자 배지 테이블
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    acquired BOOLEAN DEFAULT FALSE,
    acquired_date TIMESTAMP WITH TIME ZONE,
    progress_current INTEGER DEFAULT 0,
    progress_total INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- ========================================
-- 7. 성과 및 통계 관리
-- ========================================

-- 성과 기록 테이블
CREATE TABLE performance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    conversations_count INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    total_time_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, week_start_date)
);

-- ========================================
-- 8. 알림 및 설정 관리
-- ========================================

-- 알림 테이블
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50), -- 'achievement', 'reminder', 'system'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자 설정 테이블
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    notification_enabled BOOLEAN DEFAULT TRUE,
    daily_reminder_enabled BOOLEAN DEFAULT TRUE,
    weekly_report_enabled BOOLEAN DEFAULT TRUE,
    theme VARCHAR(20) DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
    language VARCHAR(10) DEFAULT 'ko',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ========================================
-- 9. 학습 목표 관리
-- ========================================

-- 학습 목표 테이블
CREATE TABLE learning_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    goal_title VARCHAR(200) NOT NULL,
    goal_description TEXT,
    target_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    unit VARCHAR(50),
    category VARCHAR(50),
    completed BOOLEAN DEFAULT FALSE,
    reward TEXT,
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 10. 스타일링 요청 관리
-- ========================================

-- 스타일링 요청 테이블
CREATE TABLE styling_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    request_type VARCHAR(50), -- 'outfit', 'hairstyle', 'makeup'
    description TEXT,
    preferences JSONB,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    result TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- 11. 인덱스 생성
-- ========================================

-- 사용자 관련 인덱스
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);

-- 페르소나 관련 인덱스
CREATE INDEX idx_personas_user_id ON personas(user_id);
CREATE INDEX idx_personas_gender ON personas(gender);
CREATE INDEX idx_personas_custom ON personas(custom);
CREATE INDEX idx_personas_created_at ON personas(created_at);

-- 대화 관련 인덱스
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_persona_id ON conversations(persona_id);
CREATE INDEX idx_conversations_started_at ON conversations(started_at);
CREATE INDEX idx_conversations_total_score ON conversations(total_score);

-- 메시지 관련 인덱스
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_sender ON messages(sender);

-- 즐겨찾기 관련 인덱스
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_persona_id ON favorites(persona_id);

-- 성과 관련 인덱스
CREATE INDEX idx_performance_records_user_id ON performance_records(user_id);
CREATE INDEX idx_performance_records_week_start ON performance_records(week_start_date);

-- 알림 관련 인덱스
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ========================================
-- 12. 트리거 및 함수
-- ========================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_personas_updated_at BEFORE UPDATE ON personas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_goals_updated_at BEFORE UPDATE ON learning_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 대화 완료 시 알림 생성 함수
CREATE OR REPLACE FUNCTION create_conversation_notification()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ended_at IS NOT NULL AND OLD.ended_at IS NULL THEN
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (
            NEW.user_id,
            '대화 완료!',
            '오늘의 대화가 완료되었습니다. 결과를 확인해보세요!',
            'achievement'
        );
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 대화 완료 트리거
CREATE TRIGGER conversation_completed_notification 
    AFTER UPDATE ON conversations 
    FOR EACH ROW EXECUTE FUNCTION create_conversation_notification();

-- ========================================
-- 13. 뷰 생성
-- ========================================

-- 사용자 대시보드 뷰
CREATE VIEW user_dashboard AS
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(DISTINCT c.id) as total_conversations,
    AVG(c.total_score) as average_score,
    COUNT(DISTINCT f.persona_id) as favorite_count,
    COUNT(DISTINCT ub.badge_id) FILTER (WHERE ub.acquired = true) as badges_earned
FROM users u
LEFT JOIN conversations c ON u.id = c.user_id
LEFT JOIN favorites f ON u.id = f.user_id
LEFT JOIN user_badges ub ON u.id = ub.user_id
GROUP BY u.id, u.name, u.email;

-- 페르소나 통계 뷰
CREATE VIEW persona_stats AS
SELECT 
    p.id,
    p.name,
    p.gender,
    COUNT(c.id) as conversation_count,
    AVG(c.total_score) as average_score,
    COUNT(f.user_id) as favorite_count
FROM personas p
LEFT JOIN conversations c ON p.id = c.persona_id
LEFT JOIN favorites f ON p.id = f.persona_id
WHERE p.custom = false
GROUP BY p.id, p.name, p.gender;

-- ========================================
-- 14. Row Level Security (RLS) 설정
-- ========================================

-- RLS 활성화
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

-- 사용자 테이블 정책
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- 페르소나 테이블 정책
CREATE POLICY "Users can view all personas" ON personas FOR SELECT USING (true);
CREATE POLICY "Users can manage own custom personas" ON personas FOR ALL USING (auth.uid() = user_id);

-- 대화 테이블 정책
CREATE POLICY "Users can manage own conversations" ON conversations FOR ALL USING (auth.uid() = user_id);

-- 메시지 테이블 정책
CREATE POLICY "Users can manage own messages" ON messages FOR ALL USING (
    EXISTS (
        SELECT 1 FROM conversations c 
        WHERE c.id = messages.conversation_id 
        AND c.user_id = auth.uid()
    )
);

-- 즐겨찾기 테이블 정책
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

-- 기타 테이블 정책
CREATE POLICY "Users can manage own badges" ON user_badges FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own performance" ON performance_records FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own settings" ON user_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own goals" ON learning_goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own styling requests" ON styling_requests FOR ALL USING (auth.uid() = user_id);

-- ========================================
-- 15. 완료 메시지
-- ========================================

SELECT 'Database schema setup completed successfully!' as status; 