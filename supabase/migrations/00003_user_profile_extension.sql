-- =====================================================
-- User Profile Extension for Personalization
-- =====================================================
-- 사용자 개인화를 위한 추가 프로필 필드
-- Progressive Profiling 시스템 지원

-- =====================================================
-- 1. ADD NEW COLUMNS TO USERS TABLE
-- =====================================================

-- 성격 관련 필드
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS social_style VARCHAR(20) 
    CHECK (social_style IN ('introvert', 'extrovert', 'ambivert'));

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS communication_style VARCHAR(20) 
    CHECK (communication_style IN ('direct', 'indirect', 'balanced'));

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS date_preference VARCHAR(20) 
    CHECK (date_preference IN ('active', 'chill', 'mixed'));

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS relationship_goal VARCHAR(20) 
    CHECK (relationship_goal IN ('casual', 'serious', 'exploring'));

-- MBTI 필드
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS mbti VARCHAR(4);

-- 애착 유형 필드
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS attachment_style VARCHAR(20) 
    CHECK (attachment_style IN ('secure', 'anxious', 'avoidant', 'disorganized'));

-- 연애 가치관 필드 (배열)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS relationship_values TEXT[];

-- 대화 선호도 필드
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS preferred_response_length VARCHAR(20) 
    CHECK (preferred_response_length IN ('short', 'medium', 'long'));

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS emoji_preference VARCHAR(20) 
    CHECK (emoji_preference IN ('rare', 'moderate', 'frequent'));

-- =====================================================
-- 2. PROGRESSIVE PROFILING TRACKING
-- =====================================================

-- 프로파일 완성도 추적 테이블
CREATE TABLE IF NOT EXISTS public.profile_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- 완료된 데이터 유형들
    completed_types TEXT[] DEFAULT '{}',
    
    -- 트리거 활동 기록
    last_trigger_shown VARCHAR(50),
    last_trigger_shown_at TIMESTAMPTZ,
    triggers_skipped TEXT[] DEFAULT '{}',
    
    -- 완성도 통계
    completeness_score INTEGER DEFAULT 0,
    level VARCHAR(20) DEFAULT 'starter' CHECK (level IN ('starter', 'growing', 'engaged', 'complete')),
    
    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- =====================================================
-- 3. USER ACTIVITY TRACKING
-- =====================================================

-- 사용자 활동 통계 테이블 (Progressive Profiling 트리거용)
CREATE TABLE IF NOT EXISTS public.user_activity_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- 대화 통계
    conversation_count INTEGER DEFAULT 0,
    message_count INTEGER DEFAULT 0,
    total_session_minutes INTEGER DEFAULT 0,
    
    -- 활동 패턴
    first_active_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    active_days_count INTEGER DEFAULT 1,
    active_hours INTEGER[] DEFAULT '{}', -- 활동 시간대
    
    -- 참여도 지표
    avg_session_duration_minutes FLOAT DEFAULT 0,
    engagement_level VARCHAR(20) DEFAULT 'low' CHECK (engagement_level IN ('low', 'medium', 'high')),
    
    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- =====================================================
-- 4. INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_profile_completions_user_id ON public.profile_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_stats_user_id ON public.user_activity_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_stats_engagement ON public.user_activity_stats(engagement_level);

-- =====================================================
-- 5. ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.profile_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own profile completions" ON public.profile_completions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own activity stats" ON public.user_activity_stats
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- 6. TRIGGERS FOR AUTO-UPDATE
-- =====================================================

CREATE TRIGGER update_profile_completions_updated_at 
    BEFORE UPDATE ON public.profile_completions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_activity_stats_updated_at 
    BEFORE UPDATE ON public.user_activity_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. HELPER FUNCTIONS
-- =====================================================

-- 대화 완료 시 활동 통계 업데이트
CREATE OR REPLACE FUNCTION update_user_activity_on_conversation(
    p_user_id UUID,
    p_session_duration_minutes INTEGER DEFAULT 5
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.user_activity_stats (
        user_id,
        conversation_count,
        total_session_minutes,
        last_active_at
    ) VALUES (
        p_user_id,
        1,
        p_session_duration_minutes,
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        conversation_count = user_activity_stats.conversation_count + 1,
        total_session_minutes = user_activity_stats.total_session_minutes + p_session_duration_minutes,
        last_active_at = NOW(),
        active_days_count = CASE 
            WHEN DATE(user_activity_stats.last_active_at) < CURRENT_DATE 
            THEN user_activity_stats.active_days_count + 1 
            ELSE user_activity_stats.active_days_count 
        END,
        avg_session_duration_minutes = (user_activity_stats.total_session_minutes + p_session_duration_minutes) 
            / (user_activity_stats.conversation_count + 1),
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 프로필 완성도 업데이트
CREATE OR REPLACE FUNCTION update_profile_completeness(
    p_user_id UUID,
    p_data_type TEXT
)
RETURNS INTEGER AS $$
DECLARE
    v_completeness_score INTEGER;
BEGIN
    INSERT INTO public.profile_completions (
        user_id,
        completed_types,
        completeness_score
    ) VALUES (
        p_user_id,
        ARRAY[p_data_type],
        14 -- 기본 7개 항목 중 1개 = ~14%
    )
    ON CONFLICT (user_id) DO UPDATE SET
        completed_types = CASE 
            WHEN NOT (p_data_type = ANY(profile_completions.completed_types))
            THEN array_append(profile_completions.completed_types, p_data_type)
            ELSE profile_completions.completed_types
        END,
        updated_at = NOW();
    
    -- 완성도 재계산
    SELECT (array_length(completed_types, 1) * 100 / 7)
    INTO v_completeness_score
    FROM public.profile_completions
    WHERE user_id = p_user_id;
    
    -- 레벨 업데이트
    UPDATE public.profile_completions
    SET 
        completeness_score = COALESCE(v_completeness_score, 0),
        level = CASE 
            WHEN COALESCE(v_completeness_score, 0) < 30 THEN 'starter'
            WHEN COALESCE(v_completeness_score, 0) < 60 THEN 'growing'
            WHEN COALESCE(v_completeness_score, 0) < 100 THEN 'engaged'
            ELSE 'complete'
        END
    WHERE user_id = p_user_id;
    
    RETURN COALESCE(v_completeness_score, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
