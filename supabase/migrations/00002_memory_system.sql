-- =====================================================
-- Qupid Memory System with pgvector
-- =====================================================
-- 이 마이그레이션은 AI 대화의 장기 기억을 위한 벡터 검색을 활성화합니다
-- MemGPT 스타일의 3단계 메모리 아키텍처 지원

-- =====================================================
-- 1. ENABLE PGVECTOR EXTENSION
-- =====================================================

-- pgvector 확장 활성화 (Supabase에서 기본 제공)
CREATE EXTENSION IF NOT EXISTS vector;

-- =====================================================
-- 2. USER MEMORIES TABLE (장기 기억)
-- =====================================================

-- 사용자에 대한 장기 기억 저장
CREATE TABLE IF NOT EXISTS public.user_memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- 기억 유형
    memory_type VARCHAR(50) NOT NULL CHECK (memory_type IN (
        'user_fact',           -- 사용자 정보 (예: "강아지를 키움")
        'preference',          -- 선호도 (예: "긴 문장보다 짧은 문장 선호")
        'conversation_topic',  -- 대화 주제 기억
        'emotional_moment',    -- 감정적 순간 기억
        'relationship_event'   -- 관계 발전 이벤트
    )),
    
    -- 기억 내용
    content TEXT NOT NULL,
    
    -- 벡터 임베딩 (OpenAI text-embedding-3-small: 1536 dimensions)
    embedding VECTOR(1536),
    
    -- 메타데이터
    importance FLOAT DEFAULT 0.5 CHECK (importance >= 0 AND importance <= 1),
    confidence FLOAT DEFAULT 0.8 CHECK (confidence >= 0 AND confidence <= 1),
    source_conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
    
    -- 사용 통계
    recalled_count INTEGER DEFAULT 0,
    last_recalled_at TIMESTAMPTZ,
    
    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. CONVERSATION SUMMARIES TABLE (세션 요약)
-- =====================================================

-- 대화 세션 요약 (중기 기억)
CREATE TABLE IF NOT EXISTS public.conversation_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- 요약 내용
    summary TEXT NOT NULL,
    
    -- 벡터 임베딩
    embedding VECTOR(1536),
    
    -- 추출된 정보
    main_topics TEXT[],
    user_emotions TEXT[],
    key_moments TEXT[],
    discovered_facts TEXT[],
    
    -- 관계 진행 상태
    relationship_score INTEGER CHECK (relationship_score >= 0 AND relationship_score <= 100),
    
    -- 요약 범위
    message_start_index INTEGER,
    message_end_index INTEGER,
    
    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. USER PROFILE INSIGHTS TABLE (사용자 인사이트)
-- =====================================================

-- 대화에서 파악된 사용자 프로필 인사이트
CREATE TABLE IF NOT EXISTS public.user_profile_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- 대화 스타일 인사이트
    preferred_response_length VARCHAR(20) CHECK (preferred_response_length IN ('short', 'medium', 'long')),
    emoji_usage_frequency VARCHAR(20) CHECK (emoji_usage_frequency IN ('rare', 'moderate', 'frequent')),
    question_preference VARCHAR(20) CHECK (question_preference IN ('many', 'balanced', 'few')),
    
    -- 감정 패턴
    dominant_emotions TEXT[],
    emotional_volatility VARCHAR(20) CHECK (emotional_volatility IN ('stable', 'moderate', 'volatile')),
    
    -- 주제 선호도
    favorite_topics TEXT[],
    avoided_topics TEXT[],
    
    -- 활동 패턴
    active_hours INTEGER[], -- 0-23
    avg_session_duration_minutes INTEGER,
    
    -- 연애 인사이트
    attachment_style VARCHAR(20) CHECK (attachment_style IN ('secure', 'anxious', 'avoidant', 'disorganized')),
    communication_style VARCHAR(50),
    relationship_goals TEXT[],
    
    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- =====================================================
-- 5. INDEXES FOR PERFORMANCE
-- =====================================================

-- 벡터 유사도 검색용 IVFFlat 인덱스
CREATE INDEX IF NOT EXISTS idx_user_memories_embedding 
    ON public.user_memories 
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_conversation_summaries_embedding 
    ON public.conversation_summaries 
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

-- 기본 조회용 인덱스
CREATE INDEX IF NOT EXISTS idx_user_memories_user_id ON public.user_memories(user_id);
CREATE INDEX IF NOT EXISTS idx_user_memories_type ON public.user_memories(memory_type);
CREATE INDEX IF NOT EXISTS idx_user_memories_importance ON public.user_memories(importance DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_summaries_user_id ON public.conversation_summaries(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_summaries_conversation ON public.conversation_summaries(conversation_id);

-- =====================================================
-- 6. ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.user_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profile_insights ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 기억만 접근 가능
CREATE POLICY "Users can manage own memories" ON public.user_memories
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own conversation summaries" ON public.conversation_summaries
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own profile insights" ON public.user_profile_insights
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- 7. FUNCTIONS FOR MEMORY OPERATIONS
-- =====================================================

-- 사용자 기억에서 유사한 기억 검색
CREATE OR REPLACE FUNCTION search_user_memories(
    p_user_id UUID,
    p_embedding VECTOR(1536),
    p_limit INTEGER DEFAULT 5,
    p_memory_types TEXT[] DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    memory_type VARCHAR(50),
    content TEXT,
    importance FLOAT,
    similarity FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        um.id,
        um.memory_type,
        um.content,
        um.importance,
        1 - (um.embedding <=> p_embedding) as similarity
    FROM public.user_memories um
    WHERE um.user_id = p_user_id
        AND um.embedding IS NOT NULL
        AND (p_memory_types IS NULL OR um.memory_type = ANY(p_memory_types))
    ORDER BY um.embedding <=> p_embedding
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 대화 요약에서 관련 요약 검색
CREATE OR REPLACE FUNCTION search_conversation_summaries(
    p_user_id UUID,
    p_embedding VECTOR(1536),
    p_limit INTEGER DEFAULT 3
)
RETURNS TABLE (
    id UUID,
    conversation_id UUID,
    summary TEXT,
    main_topics TEXT[],
    similarity FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cs.id,
        cs.conversation_id,
        cs.summary,
        cs.main_topics,
        1 - (cs.embedding <=> p_embedding) as similarity
    FROM public.conversation_summaries cs
    WHERE cs.user_id = p_user_id
        AND cs.embedding IS NOT NULL
    ORDER BY cs.embedding <=> p_embedding
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 기억 회상 카운트 증가
CREATE OR REPLACE FUNCTION recall_memory(p_memory_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.user_memories
    SET 
        recalled_count = recalled_count + 1,
        last_recalled_at = NOW()
    WHERE id = p_memory_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 8. TRIGGERS
-- =====================================================

-- updated_at 자동 업데이트
CREATE TRIGGER update_user_memories_updated_at 
    BEFORE UPDATE ON public.user_memories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profile_insights_updated_at 
    BEFORE UPDATE ON public.user_profile_insights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
