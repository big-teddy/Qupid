import { supabase } from './supabaseClient';
import { ConversationAnalysis } from '../types';

export interface Conversation {
  id: string;
  user_id: string;
  persona_id: string;
  started_at: string;
  ended_at?: string;
  summary?: string;
  total_score: number;
  feedback?: string;
  friendliness_score: number;
  curiosity_score: number;
  empathy_score: number;
  positive_points: string[];
  points_to_improve: any[];
  is_tutorial: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  created_at: string;
  message_order: number;
}

// 대화 세션 시작
export async function startConversation(userId: string, personaId: string, isTutorial: boolean = false): Promise<Conversation> {
  const { data, error } = await supabase
    .from('conversations')
    .insert([{
      user_id: userId,
      persona_id: personaId,
      is_tutorial: isTutorial
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 대화 세션 종료 및 분석 결과 저장
export async function endConversation(
  conversationId: string, 
  analysis: ConversationAnalysis
): Promise<Conversation> {
  const { data, error } = await supabase
    .from('conversations')
    .update({
      ended_at: new Date().toISOString(),
      total_score: analysis.totalScore,
      feedback: analysis.feedback,
      friendliness_score: analysis.friendliness.score,
      curiosity_score: analysis.curiosity.score,
      empathy_score: analysis.empathy.score,
      positive_points: analysis.positivePoints,
      points_to_improve: analysis.pointsToImprove
    })
    .eq('id', conversationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 메시지 저장
export async function saveMessage(
  conversationId: string, 
  sender: 'user' | 'ai' | 'system', 
  text: string,
  messageOrder: number
): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert([{
      conversation_id: conversationId,
      sender,
      text,
      message_order: messageOrder
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 대화 메시지 조회
export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('message_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

// 사용자의 대화 기록 조회
export async function getUserConversations(userId: string, limit: number = 20): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      personas (
        id,
        name,
        avatar,
        gender
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// 특정 대화 세션 조회
export async function getConversation(conversationId: string): Promise<Conversation | null> {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      personas (
        id,
        name,
        avatar,
        gender,
        job,
        mbti
      )
    `)
    .eq('id', conversationId)
    .single();

  if (error) throw error;
  return data;
}

// 대화 통계 조회
export async function getConversationStats(userId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select('total_score, created_at')
    .eq('user_id', userId)
    .not('total_score', 'is', null);

  if (error) throw error;

  const scores = data?.map(c => c.total_score) || [];
  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const totalConversations = scores.length;

  return {
    totalConversations,
    averageScore: Math.round(avgScore),
    recentScores: scores.slice(-7) // 최근 7개 점수
  };
} 