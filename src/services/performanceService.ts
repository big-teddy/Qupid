import { supabase } from './supabaseClient';

export interface PerformanceRecord {
  id: string;
  user_id: string;
  week_start_date: string;
  weekly_score: number;
  score_change: number;
  score_change_percentage: number;
  daily_scores: number[];
  radar_data: any;
  stats: any;
  category_scores: any;
  created_at: string;
}

// 주간 성과 기록 생성/업데이트
export async function upsertWeeklyPerformance(
  userId: string,
  weekStartDate: string,
  performanceData: Partial<PerformanceRecord>
): Promise<PerformanceRecord> {
  const { data, error } = await supabase
    .from('performance_records')
    .upsert([{
      user_id: userId,
      week_start_date: weekStartDate,
      ...performanceData
    }], {
      onConflict: 'user_id,week_start_date'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 사용자의 성과 기록 조회
export async function getUserPerformance(userId: string, weeks: number = 12): Promise<PerformanceRecord[]> {
  const { data, error } = await supabase
    .from('performance_records')
    .select('*')
    .eq('user_id', userId)
    .order('week_start_date', { ascending: false })
    .limit(weeks);

  if (error) throw error;
  return data || [];
}

// 특정 주의 성과 기록 조회
export async function getWeeklyPerformance(userId: string, weekStartDate: string): Promise<PerformanceRecord | null> {
  const { data, error } = await supabase
    .from('performance_records')
    .select('*')
    .eq('user_id', userId)
    .eq('week_start_date', weekStartDate)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// 성과 통계 계산 및 저장
export async function calculateAndSaveWeeklyPerformance(userId: string, weekStartDate: string): Promise<PerformanceRecord> {
  // 해당 주의 대화 데이터 조회
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekEndDate.getDate() + 6);

  const { data: conversations } = await supabase
    .from('conversations')
    .select('total_score, created_at')
    .eq('user_id', userId)
    .gte('created_at', weekStartDate)
    .lte('created_at', weekEndDate.toISOString())
    .not('total_score', 'is', null);

  // 일별 점수 계산
  const dailyScores = new Array(7).fill(0);
  const dailyCounts = new Array(7).fill(0);

  conversations?.forEach(conversation => {
    const date = new Date(conversation.created_at);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ...
    const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0, Sunday = 6
    
    dailyScores[adjustedDay] += conversation.total_score;
    dailyCounts[adjustedDay]++;
  });

  // 일별 평균 점수 계산
  const finalDailyScores = dailyScores.map((sum, index) => 
    dailyCounts[index] > 0 ? Math.round(sum / dailyCounts[index]) : 0
  );

  // 주간 평균 점수
  const weeklyScore = finalDailyScores.reduce((sum, score) => sum + score, 0) / 7;

  // 이전 주와 비교
  const previousWeekStart = new Date(weekStartDate);
  previousWeekStart.setDate(previousWeekStart.getDate() - 7);
  
  const previousWeek = await getWeeklyPerformance(userId, previousWeekStart.toISOString().split('T')[0]);
  const scoreChange = previousWeek ? weeklyScore - previousWeek.weekly_score : 0;
  const scoreChangePercentage = previousWeek && previousWeek.weekly_score > 0 
    ? (scoreChange / previousWeek.weekly_score) * 100 
    : 0;

  // 통계 데이터
  const stats = {
    total_conversations: conversations?.length || 0,
    average_score: Math.round(weeklyScore),
    best_day_score: Math.max(...finalDailyScores),
    worst_day_score: Math.min(...finalDailyScores.filter(score => score > 0))
  };

  // 카테고리별 점수 (예시)
  const categoryScores = [
    { title: '친근함', emoji: '😊', score: Math.round(weeklyScore * 0.9), change: 0, goal: 80 },
    { title: '호기심', emoji: '🤔', score: Math.round(weeklyScore * 1.1), change: 0, goal: 85 },
    { title: '공감능력', emoji: '❤️', score: Math.round(weeklyScore * 0.95), change: 0, goal: 90 }
  ];

  // 레이더 차트 데이터
  const radarData = {
    labels: ['친근함', '호기심', '공감능력', '자연스러움', '흥미유발'],
    datasets: [{
      label: '이번 주',
      data: [
        Math.round(weeklyScore * 0.9),
        Math.round(weeklyScore * 1.1),
        Math.round(weeklyScore * 0.95),
        Math.round(weeklyScore * 1.05),
        Math.round(weeklyScore * 0.85)
      ],
      backgroundColor: 'rgba(240, 147, 176, 0.2)',
      borderColor: 'rgba(240, 147, 176, 1)',
      borderWidth: 2
    }]
  };

  // 성과 기록 저장
  return await upsertWeeklyPerformance(userId, weekStartDate, {
    weekly_score: Math.round(weeklyScore),
    score_change: Math.round(scoreChange),
    score_change_percentage: Math.round(scoreChangePercentage * 100) / 100,
    daily_scores: finalDailyScores,
    radar_data: radarData,
    stats,
    category_scores: categoryScores
  });
}

// 사용자 대시보드용 통합 성과 데이터
export async function getDashboardPerformance(userId: string) {
  const currentWeekStart = getWeekStartDate(new Date());
  const currentWeek = await getWeeklyPerformance(userId, currentWeekStart);
  
  const recentWeeks = await getUserPerformance(userId, 4);
  
  const { data: totalConversations } = await supabase
    .from('conversations')
    .select('id')
    .eq('user_id', userId);

  const { data: totalBadges } = await supabase
    .from('user_badges')
    .select('id')
    .eq('user_id', userId);

  return {
    currentWeek: currentWeek || {
      weekly_score: 0,
      score_change: 0,
      score_change_percentage: 0,
      daily_scores: new Array(7).fill(0),
      stats: { total_conversations: 0, average_score: 0 }
    },
    recentWeeks,
    totalStats: {
      totalConversations: totalConversations?.length || 0,
      totalBadges: totalBadges?.length || 0,
      averageScore: recentWeeks.length > 0 
        ? Math.round(recentWeeks.reduce((sum, week) => sum + week.weekly_score, 0) / recentWeeks.length)
        : 0
    }
  };
}

// 주 시작일 계산 (월요일 기준)
function getWeekStartDate(date: Date): string {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // 월요일이 1, 일요일이 0
  const monday = new Date(date.setDate(diff));
  return monday.toISOString().split('T')[0];
} 