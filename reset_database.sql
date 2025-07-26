-- 기존 사용자 데이터 삭제 스크립트
-- Supabase Dashboard의 SQL Editor에서 실행하세요

-- 1. 기존 사용자 데이터 삭제
DELETE FROM users WHERE email LIKE '%@gmail.com' OR email LIKE '%@google.com';

-- 2. 기존 대화 세션 삭제
DELETE FROM conversations;

-- 3. 기존 메시지 삭제
DELETE FROM messages;

-- 4. 기존 즐겨찾기 삭제
DELETE FROM favorites;

-- 5. 기존 사용자 배지 삭제
DELETE FROM user_badges;

-- 6. 기존 성과 기록 삭제
DELETE FROM performance_records;

-- 7. 기존 알림 삭제
DELETE FROM notifications;

-- 8. 기존 사용자 설정 삭제
DELETE FROM user_settings;

-- 9. 기존 학습 목표 삭제
DELETE FROM learning_goals;

-- 10. 기존 스타일링 요청 삭제
DELETE FROM styling_requests;

-- 11. 기존 맞춤 페르소나 삭제
DELETE FROM personas WHERE custom = true;

-- 확인: 삭제된 데이터 확인
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'conversations' as table_name, COUNT(*) as count FROM conversations
UNION ALL
SELECT 'messages' as table_name, COUNT(*) as count FROM messages
UNION ALL
SELECT 'favorites' as table_name, COUNT(*) as count FROM favorites; 