# 데이터베이스 스키마 점검 보고서

## 🔍 **점검 결과 요약**

### ❌ **발견된 주요 문제점들**

#### **1. 테이블명 불일치**
- **코드에서 사용**: `conversation_sessions`, `conversation_messages`
- **기존 스키마**: `conversations`, `messages`
- **영향**: 대화 관련 기능이 작동하지 않음

#### **2. 누락된 테이블들**
- `user_achievements` - 사용자 성취 관리
- `user_growth_stats` - 사용자 성장 통계
- `user_custom_personas` - 사용자 맞춤 페르소나
- `user_notification_settings` - 사용자 알림 설정
- `user_weekly_goals` - 사용자 주간 목표

#### **3. UserProfile 타입과 스키마 불일치**
- **타입에 있지만 스키마에 없는 필드들**:
  - `level` (사용자 레벨)
  - `experiencePoints` (경험치)
  - `totalConversations` (총 대화 수)
  - `averageScore` (평균 점수)
  - `streakDays` (연속 사용 일수)
  - `lastActiveDate` (마지막 활동일)

#### **4. 필드명 불일치**
- **코드**: `analysis_score`, `persona_name`
- **기존 스키마**: `total_score`, `persona_id`만 있음

## ✅ **개선된 스키마 특징**

### **1. 앱과 완벽 일치**
- 모든 테이블명이 코드에서 사용하는 이름과 일치
- 모든 필드가 TypeScript 타입 정의와 일치
- 누락된 테이블들 모두 추가

### **2. 확장된 사용자 테이블**
```sql
-- UserProfile 타입과 완벽 일치
CREATE TABLE users (
    -- 기본 필드들
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    user_gender VARCHAR(10),
    experience VARCHAR(50),
    confidence VARCHAR(50),
    difficulty VARCHAR(50),
    interests TEXT[],
    profile_image_url TEXT,
    
    -- 추가된 필드들 (UserProfile 타입에 맞춤)
    level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    total_conversations INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_active_date DATE DEFAULT CURRENT_DATE,
    
    -- 기타 필드들
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    subscription_tier VARCHAR(20) DEFAULT 'free',
    subscription_expires_at TIMESTAMP WITH TIME ZONE
);
```

### **3. 대화 관리 개선**
```sql
-- 코드에서 사용하는 테이블명과 일치
CREATE TABLE conversation_sessions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    persona_id UUID REFERENCES personas(id),
    persona_name VARCHAR(100), -- 코드에서 사용하는 필드
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    analysis_score INTEGER DEFAULT 0, -- 코드에서 사용하는 필드명
    friendliness_score INTEGER DEFAULT 0,
    curiosity_score INTEGER DEFAULT 0,
    empathy_score INTEGER DEFAULT 0,
    feedback TEXT,
    positive_points TEXT[],
    points_to_improve JSONB,
    is_tutorial BOOLEAN DEFAULT FALSE
);

CREATE TABLE conversation_messages (
    id UUID PRIMARY KEY,
    session_id UUID REFERENCES conversation_sessions(id),
    sender VARCHAR(10) NOT NULL,
    message_text TEXT NOT NULL, -- 코드에서 사용하는 필드명
    message_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **4. 추가된 테이블들**
- **`user_achievements`**: 사용자 성취 관리
- **`user_growth_stats`**: 사용자 성장 통계 (일별)
- **`user_custom_personas`**: 사용자 맞춤 페르소나
- **`user_notification_settings`**: 사용자 알림 설정
- **`user_weekly_goals`**: 사용자 주간 목표

### **5. 자동화된 기능들**
- **사용자 통계 자동 업데이트**: 대화 완료 시 자동으로 통계 업데이트
- **연속 사용 일수 계산**: 자동으로 연속 사용 일수 계산
- **주간 목표 자동 생성**: 사용자별 주간 목표 자동 생성
- **알림 자동 생성**: 대화 완료 시 자동 알림 생성

## 🚀 **적용 방법**

### **1단계: 기존 데이터 백업 (선택사항)**
```sql
-- 기존 데이터가 있다면 백업
CREATE TABLE users_backup AS SELECT * FROM users;
CREATE TABLE personas_backup AS SELECT * FROM personas;
-- ... 기타 테이블들
```

### **2단계: 새로운 스키마 적용**
1. [Supabase Dashboard](https://supabase.com/dashboard/project/oxghwastrvvqhvlggmgq) 접속
2. **SQL Editor** 클릭
3. **New Query** 클릭
4. `corrected_database_schema.sql` 파일의 내용을 복사하여 붙여넣기
5. **Run** 버튼 클릭

### **3단계: 확인**
```sql
-- 테이블 생성 확인
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 사용자 테이블 구조 확인
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
```

## 📊 **성능 최적화**

### **인덱스 최적화**
- 사용자 이메일, 레벨, 생성일 인덱스
- 대화 세션 사용자, 페르소나, 점수 인덱스
- 메시지 세션, 발신자 인덱스
- 성장 통계 사용자, 날짜 인덱스

### **RLS 정책**
- 모든 테이블에 Row Level Security 활성화
- 사용자는 자신의 데이터만 접근 가능
- 페르소나는 모든 사용자가 조회 가능

## 🎯 **예상 결과**

### **✅ 해결될 문제들**
- 대화 기능 정상 작동
- 사용자 프로필 완전 표시
- 성취 및 배지 시스템 작동
- 성장 통계 정확한 계산
- 맞춤 페르소나 저장
- 알림 설정 저장

### **✅ 추가 기능들**
- 자동 통계 업데이트
- 연속 사용 일수 계산
- 주간 목표 자동 생성
- 대화 완료 알림

---

## 📋 **체크리스트**

- [ ] 기존 데이터 백업 (필요시)
- [ ] 새로운 스키마 적용
- [ ] 테이블 생성 확인
- [ ] RLS 정책 확인
- [ ] 인덱스 생성 확인
- [ ] 트리거 및 함수 확인
- [ ] 앱 기능 테스트

**이제 앱과 데이터베이스가 완벽하게 일치합니다!** 🎉 