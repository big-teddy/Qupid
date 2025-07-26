-- 연애 박사 앱 - 완전한 DB 스키마 설계
-- Supabase PostgreSQL 스키마

-- ========================================
-- 1. 사용자 관리 (Users)
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
-- 2. 페르소나 관리 (Personas)
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
-- 3. 대화 관리 (Conversations & Messages)
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
-- 4. 즐겨찾기 관리 (Favorites)
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
-- 5. 배지 시스템 (Badges)
-- ========================================

-- 배지 정의 테이블
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50), -- 이모지 또는 아이콘
    category VARCHAR(20) CHECK (category IN ('대화', '성장', '특별')),
    rarity VARCHAR(20) CHECK (rarity IN ('Common', 'Rare', 'Epic', 'Legendary')),
    criteria JSONB, -- 획득 조건 (JSON 형태)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자 배지 획득 테이블
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress JSONB, -- 진행 상황 (current, total)
    UNIQUE(user_id, badge_id)
);

-- ========================================
-- 6. 성장 기록 (Performance)
-- ========================================

-- 성장 기록 테이블
CREATE TABLE performance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL, -- 주 시작일
    weekly_score INTEGER DEFAULT 0 CHECK (weekly_score >= 0 AND weekly_score <= 100),
    score_change INTEGER DEFAULT 0,
    score_change_percentage DECIMAL(5,2) DEFAULT 0,
    daily_scores INTEGER[], -- 일별 점수 배열
    radar_data JSONB, -- 레이더 차트 데이터
    stats JSONB, -- 통계 데이터 (total_time, session_count 등)
    category_scores JSONB, -- 카테고리별 점수
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, week_start_date)
);

-- ========================================
-- 7. 알림 시스템 (Notifications)
-- ========================================

-- 알림 테이블
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'daily_reminder', 'badge_earned', 'goal_achieved' 등
    title VARCHAR(200) NOT NULL,
    content TEXT,
    data JSONB, -- 추가 데이터
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 8. 설정 관리 (Settings)
-- ========================================

-- 사용자 설정 테이블
CREATE TABLE user_settings (
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

-- 학습 목표 테이블
CREATE TABLE learning_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50), -- 'conversation', 'confidence', 'relationship' 등
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

-- 스타일링 요청 테이블
CREATE TABLE styling_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    response_text TEXT,
    response_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 11. 인덱스 생성 (Performance Optimization)
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

-- 성장 기록 관련 인덱스
CREATE INDEX idx_performance_records_user_id ON performance_records(user_id);
CREATE INDEX idx_performance_records_week_start ON performance_records(week_start_date);

-- 알림 관련 인덱스
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ========================================
-- 12. RLS (Row Level Security) 정책
-- ========================================

-- 모든 테이블에 RLS 활성화
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

-- 사용자는 자신의 데이터만 접근 가능
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
-- 13. 기본 데이터 삽입 (Seed Data)
-- ========================================

-- 기본 배지 데이터
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
-- 14. 함수 및 트리거 (Automation)
-- ========================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거 생성
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_personas_updated_at BEFORE UPDATE ON personas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_goals_updated_at BEFORE UPDATE ON learning_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 대화 완료 시 자동 알림 생성 함수
CREATE OR REPLACE FUNCTION create_conversation_notification()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ended_at IS NOT NULL AND OLD.ended_at IS NULL THEN
        INSERT INTO notifications (user_id, type, title, content, data)
        VALUES (
            NEW.user_id,
            'conversation_completed',
            '대화 완료!',
            '대화 분석 결과를 확인해보세요.',
            jsonb_build_object('conversation_id', NEW.id, 'score', NEW.total_score)
        );
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 대화 완료 알림 트리거
CREATE TRIGGER conversation_completed_notification 
    AFTER UPDATE ON conversations 
    FOR EACH ROW EXECUTE FUNCTION create_conversation_notification();

-- ========================================
-- 15. 뷰 생성 (Common Queries)
-- ========================================

-- 사용자 대시보드 뷰
CREATE VIEW user_dashboard AS
SELECT 
    u.id,
    u.name,
    u.user_gender,
    u.subscription_tier,
    COUNT(DISTINCT c.id) as total_conversations,
    COUNT(DISTINCT f.persona_id) as total_favorites,
    COUNT(DISTINCT ub.badge_id) as total_badges,
    AVG(c.total_score) as avg_conversation_score,
    MAX(c.created_at) as last_conversation_at
FROM users u
LEFT JOIN conversations c ON u.id = c.user_id
LEFT JOIN favorites f ON u.id = f.user_id
LEFT JOIN user_badges ub ON u.id = ub.user_id
GROUP BY u.id, u.name, u.user_gender, u.subscription_tier;

-- 페르소나 통계 뷰
CREATE VIEW persona_stats AS
SELECT 
    p.id,
    p.name,
    p.gender,
    p.custom,
    COUNT(c.id) as conversation_count,
    AVG(c.total_score) as avg_score,
    COUNT(f.id) as favorite_count
FROM personas p
LEFT JOIN conversations c ON p.id = c.persona_id
LEFT JOIN favorites f ON p.id = f.persona_id
GROUP BY p.id, p.name, p.gender, p.custom;

-- ========================================
-- 완료 메시지
-- ========================================

-- 스키마 생성 완료!
-- 이제 앱에서 이 테이블들을 사용할 수 있습니다. 