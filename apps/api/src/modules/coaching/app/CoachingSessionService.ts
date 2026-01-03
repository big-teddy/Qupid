import { ConversationService } from "../../chat/app/ConversationService.js";
import { AIService } from "../../chat/app/AIService.js";
import { MessageService } from "../../chat/app/MessageService.js";
import { AnalysisService } from "../../chat/app/AnalysisService.js";
import { CoachService } from "./CoachService.js";
import { NotificationService } from "../../notification/app/NotificationService.js";
import { Message } from "@qupid/core";
import { AppError } from "../../../shared/errors/AppError.js";
import { supabase } from "../../../config/supabase.js";

// 코칭 분석 결과 타입 (Legacy Compatibility)
interface CoachingAnalysis {
  totalScore: number;
  categoryScores: Array<{ category: string; score: number; emoji: string }>;
  strengths: string[];
  improvements: string[];
  coachFeedback: string;
  badges: any[];
  nextSteps?: string[];
}

export class CoachingSessionService {
  constructor(
    private conversationService: ConversationService,
    private aiService: AIService,
    private messageService: MessageService,
    private analysisService: AnalysisService,
    private coachService: CoachService,
    private notificationService: NotificationService
  ) { }

  /**
   * 코칭 세션 생성
   */
  async createSession(coachId: string, userId?: string): Promise<string> {
    const activeUserId = userId || `guest_${Date.now()}`; // Guest Handling

    // 코치 정보 조회
    const coach = await this.coachService.getCoachById(coachId);
    if (!coach) {
      throw AppError.notFound("Coach");
    }

    // 시스템 프롬프트 구성 (For Fallback)
    const systemInstruction = `You are ${coach.name}, an AI coach specializing in ${coach.specialty}. ${(coach as any).intro || ''}`;

    // 세션 생성 (ConversationService 위임)
    const sessionId = await this.conversationService.createSession(
      activeUserId,
      coachId,
      'coach',
      systemInstruction
    );

    return sessionId;
  }

  /**
   * 코칭 메시지 전송 (동기)
   */
  async sendMessage(sessionId: string, userMessage: string): Promise<string> {
    const session = await this.conversationService.ensureSession(sessionId);

    // 1. 사용자 메시지 저장
    const timestamp = new Date().getTime();
    const userMsgObj: Message = { sender: 'user', text: userMessage, timestamp };

    await this.messageService.saveMessage(sessionId, userMsgObj);
    session.addMessage(userMsgObj);

    // 2. AI 응답 생성 (Coaching Mode)
    const aiResponse = await this.aiService.generateResponse(session, userMessage, 'coaching');

    // 3. AI 메시지 저장
    const aiMsgObj: Message = { sender: 'ai', text: aiResponse, timestamp: new Date().getTime() };
    await this.messageService.saveMessage(sessionId, aiMsgObj);
    session.addMessage(aiMsgObj);

    return aiResponse;
  }

  /**
   * 코칭 메시지 스트리밍
   */
  async streamMessage(
    sessionId: string,
    userMessage: string,
    onChunk: (chunk: string) => void,
  ): Promise<void> {
    const session = await this.conversationService.ensureSession(sessionId);

    // 1. 사용자 메시지 저장
    const timestamp = new Date().getTime();
    const userMsgObj: Message = { sender: 'user', text: userMessage, timestamp };

    await this.messageService.saveMessage(sessionId, userMsgObj);
    session.addMessage(userMsgObj);

    // 2. AI 응답 스트리밍
    const fullResponse = await this.aiService.streamResponse(
      session,
      userMessage,
      onChunk,
      'coaching'
    );

    // 3. AI 메시지 저장 (완료 후)
    const aiMsgObj: Message = { sender: 'ai', text: fullResponse, timestamp: new Date().getTime() };
    await this.messageService.saveMessage(sessionId, aiMsgObj);
    session.addMessage(aiMsgObj);
  }

  /**
   * 코칭 세션 분석
   */
  async analyzeSession(
    sessionId: string,
    messages: Message[], // Legacy param
  ): Promise<CoachingAnalysis> {
    try {
      const session = await this.conversationService.ensureSession(sessionId);
      const analysis = await this.analysisService.analyzeConversation(session.getMessages());

      // Map AnalysisResult to CoachingAnalysis (Compat)
      const coachingAnalysis = {
        totalScore: analysis.totalScore,
        categoryScores: [
          { category: "친근함", score: analysis.friendliness.score, emoji: "🥰" },
          { category: "호기심", score: analysis.curiosity.score, emoji: "🤔" },
          { category: "공감", score: analysis.empathy.score, emoji: "❤️" }
        ],
        strengths: analysis.positivePoints,
        improvements: analysis.pointsToImprove.map(p => p.suggestion),
        coachFeedback: analysis.feedback,
        badges: [],
        nextSteps: analysis.pointsToImprove.map(p => p.topic)
      };

      // 🚀 Gamification: Update User Growth Stats
      if (session.userId && !session.userId.startsWith('guest_')) {
        await this.updateUserGrowth(session.userId, analysis);

        // 🔔 Notification: Analysis Complete
        await this.notificationService.createCoachingNotification(
          session.userId,
          `코칭 세션 분석이 완료되었습니다! 📈 결과: ${analysis.totalScore}점`
        ).catch(e => console.error("Failed to send notification:", e));
      }

      return coachingAnalysis;
    } catch (e) {
      console.warn("Session analysis fallback due to error or missing session:", e);
      throw e;
    }
  }

  private async updateUserGrowth(userId: string, analysis: any): Promise<void> {
    try {
      // 1. Get current stats
      const { data: currentStats } = await supabase
        .from('user_growth_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      const stats = currentStats || {
        friendliness_exp: 0,
        curiosity_exp: 0,
        empathy_exp: 0,
        total_level: 1
      };

      // 2. Calculate new exp (Add score directly as exp for simplicity)
      const newFriendliness = (stats.friendliness_exp || 0) + analysis.friendliness.score;
      const newCuriosity = (stats.curiosity_exp || 0) + analysis.curiosity.score;
      const newEmpathy = (stats.empathy_exp || 0) + analysis.empathy.score;

      // 3. Level up logic (Simple: Total Exp / 300)
      const totalExp = newFriendliness + newCuriosity + newEmpathy;
      const newLevel = Math.floor(totalExp / 300) + 1;

      // 4. Update DB
      const { error } = await supabase.from('user_growth_stats').upsert({
        user_id: userId,
        friendliness_exp: newFriendliness,
        curiosity_exp: newCuriosity,
        empathy_exp: newEmpathy,
        total_level: newLevel,
        last_analyzed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      if (error) console.error("Failed to update growth stats:", error);
    } catch (err) {
      console.error("Error updating user growth:", err);
    }
  }
}
