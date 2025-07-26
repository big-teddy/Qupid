import { supabase } from './supabaseClient';

export interface Favorite {
  id: string;
  user_id: string;
  persona_id: string;
  created_at: string;
}

// 즐겨찾기 추가
export async function addToFavorites(userId: string, personaId: string): Promise<Favorite> {
  const { data, error } = await supabase
    .from('favorites')
    .insert([{
      user_id: userId,
      persona_id: personaId
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 즐겨찾기 제거
export async function removeFromFavorites(userId: string, personaId: string): Promise<void> {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('persona_id', personaId);

  if (error) throw error;
}

// 사용자의 즐겨찾기 목록 조회
export async function getUserFavorites(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      *,
      personas (
        id,
        name,
        age,
        gender,
        job,
        mbti,
        intro,
        avatar,
        match_rate,
        personality_traits,
        interests,
        tags,
        conversation_preview,
        custom,
        description
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// 특정 페르소나가 즐겨찾기되어 있는지 확인
export async function isFavorite(userId: string, personaId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('persona_id', personaId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116는 결과가 없을 때
  return !!data;
}

// 즐겨찾기 토글 (추가/제거)
export async function toggleFavorite(userId: string, personaId: string): Promise<boolean> {
  const isCurrentlyFavorite = await isFavorite(userId, personaId);
  
  if (isCurrentlyFavorite) {
    await removeFromFavorites(userId, personaId);
    return false;
  } else {
    await addToFavorites(userId, personaId);
    return true;
  }
} 