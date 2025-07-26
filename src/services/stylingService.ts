import { supabase } from './supabaseClient';

export interface StylingRequest {
  id: string;
  user_id: string;
  prompt: string;
  response_text?: string;
  response_image_url?: string;
  created_at: string;
}

// 스타일링 요청 저장
export async function saveStylingRequest(
  userId: string, 
  prompt: string, 
  responseText?: string, 
  responseImageUrl?: string
): Promise<StylingRequest> {
  const { data, error } = await supabase
    .from('styling_requests')
    .insert([{
      user_id: userId,
      prompt,
      response_text: responseText,
      response_image_url: responseImageUrl
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 사용자의 스타일링 요청 기록 조회
export async function getUserStylingRequests(userId: string, limit: number = 20): Promise<StylingRequest[]> {
  const { data, error } = await supabase
    .from('styling_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// 특정 스타일링 요청 조회
export async function getStylingRequest(requestId: string): Promise<StylingRequest | null> {
  const { data, error } = await supabase
    .from('styling_requests')
    .select('*')
    .eq('id', requestId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// 스타일링 요청 업데이트 (응답 추가)
export async function updateStylingResponse(
  requestId: string, 
  responseText: string, 
  responseImageUrl?: string
): Promise<StylingRequest> {
  const { data, error } = await supabase
    .from('styling_requests')
    .update({
      response_text: responseText,
      response_image_url: responseImageUrl
    })
    .eq('id', requestId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 스타일링 통계 조회
export async function getStylingStats(userId: string) {
  const { data, error } = await supabase
    .from('styling_requests')
    .select('created_at, response_text')
    .eq('user_id', userId);

  if (error) throw error;

  const totalRequests = data?.length || 0;
  const successfulRequests = data?.filter(req => req.response_text)?.length || 0;
  const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0;

  // 최근 7일간의 요청 수
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentRequests = data?.filter(req => 
    new Date(req.created_at) >= sevenDaysAgo
  )?.length || 0;

  return {
    totalRequests,
    successfulRequests,
    successRate: Math.round(successRate),
    recentRequests
  };
}

// 스타일링 요청 삭제
export async function deleteStylingRequest(requestId: string): Promise<void> {
  const { error } = await supabase
    .from('styling_requests')
    .delete()
    .eq('id', requestId);

  if (error) throw error;
}

// 스타일링 히스토리 검색
export async function searchStylingHistory(userId: string, searchTerm: string): Promise<StylingRequest[]> {
  const { data, error } = await supabase
    .from('styling_requests')
    .select('*')
    .eq('user_id', userId)
    .or(`prompt.ilike.%${searchTerm}%,response_text.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// 인기 스타일링 프롬프트 (전체 사용자 기준)
export async function getPopularStylingPrompts(limit: number = 10): Promise<string[]> {
  const { data, error } = await supabase
    .from('styling_requests')
    .select('prompt')
    .not('prompt', 'is', null);

  if (error) throw error;

  // 프롬프트 빈도 계산
  const promptCounts: Record<string, number> = {};
  data?.forEach(req => {
    const prompt = req.prompt.toLowerCase().trim();
    promptCounts[prompt] = (promptCounts[prompt] || 0) + 1;
  });

  // 빈도순으로 정렬
  const sortedPrompts = Object.entries(promptCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
    .map(([prompt]) => prompt);

  return sortedPrompts;
}

// 스타일링 추천 프롬프트
export const RECOMMENDED_STYLING_PROMPTS = [
  "데이트룩 추천해줘",
  "면접 복장 스타일링",
  "여름 데이트 코디",
  "겨울 데이트 패션",
  "비즈니스 캐주얼 룩",
  "파티 드레스 스타일링",
  "데일리 룩 추천",
  "운동복 스타일링",
  "악세서리 매칭 팁",
  "헤어스타일 추천"
]; 