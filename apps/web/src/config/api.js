/**
 * API 설정 유틸리티
 * - 웹 브라우저: localhost 또는 환경 변수 사용
 * - Capacitor 앱: 실제 배포된 API URL 사용
 */
// Capacitor가 설치되어 있는지 확인
const isCapacitorApp = () => {
  return (
    typeof window !== "undefined" &&
    window.Capacitor !== undefined &&
    window.Capacitor.isNativePlatform &&
    window.Capacitor.isNativePlatform()
  );
};
/**
 * 현재 플랫폼에 맞는 API URL 반환
 */
export const getApiUrl = () => {
  // Capacitor 네이티브 앱에서 실행 중
  if (isCapacitorApp()) {
    // Railway 프로덕션 URL
    return "https://qupid-production.up.railway.app/api/v1";
  }
  // 웹 브라우저에서 실행 중
  return (
    import.meta.env.VITE_API_URL ||
    import.meta.env.NEXT_PUBLIC_API_URL || // Compatibility fallback
    "http://localhost:4000/api/v1"
  );
};
/**
 * Supabase URL 반환
 */
export const getSupabaseUrl = () => {
  return (
    import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL || // Compatibility fallback
    process.env.SUPABASE_URL || // Node fallback
    ""
  );
};
/**
 * Supabase Anon Key 반환
 */
export const getSupabaseAnonKey = () => {
  return (
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || // Compatibility fallback
    process.env.SUPABASE_ANON_KEY || // Node fallback
    ""
  );
};
