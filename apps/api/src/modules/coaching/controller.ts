import { Request, Response, NextFunction } from "express";
import { CoachService } from "./app/CoachService.js";
import { CoachingSessionService } from "./app/CoachingSessionService.js";
import { AppError } from "../../shared/errors/AppError.js";

import { ConversationService } from "../chat/app/ConversationService.js";
import { AIService } from "../chat/app/AIService.js";
import { MessageService } from "../chat/app/MessageService.js";
import { AnalysisService } from "../chat/app/AnalysisService.js";
import { NotificationService } from "../notification/app/NotificationService.js";

// Composition Root (Manual DI)
const coachService = new CoachService();
const conversationService = new ConversationService();
const aiService = new AIService();
const messageService = new MessageService();
const analysisService = new AnalysisService();
const notificationService = new NotificationService();

const sessionService = new CoachingSessionService(
  conversationService,
  aiService,
  messageService,
  analysisService,
  coachService,
  notificationService
);

export class CoachingController {
  /**
   * GET /api/v1/coaches
   * 모든 코치 조회
   */
  async getAllCoaches(req: Request, res: Response, next: NextFunction) {
    try {
      const coaches = await coachService.getAllCoaches();
      res.json({
        success: true,
        data: coaches,
      });
    } catch (error) {
      next(AppError.internal("Failed to fetch coaches"));
    }
  }

  /**
   * GET /api/v1/coaches/:id
   * 특정 코치 조회
   */
  async getCoachById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const coach = await coachService.getCoachById(id);

      if (!coach) {
        return next(AppError.notFound("Coach"));
      }

      res.json({
        success: true,
        data: coach,
      });
    } catch (error) {
      next(AppError.internal("Failed to fetch coach"));
    }
  }

  /**
   * GET /api/v1/coaches/specialty/:specialty
   * 전문 분야로 코치 필터링
   */
  async getCoachesBySpecialty(req: Request, res: Response, next: NextFunction) {
    try {
      const { specialty } = req.params;
      const coaches = await coachService.getCoachesBySpecialty(specialty);

      res.json({
        success: true,
        data: coaches,
      });
    } catch (error) {
      next(AppError.internal("Failed to fetch coaches"));
    }
  }

  /**
   * POST /api/v1/coaches/sessions
   * 코칭 세션 생성
   */
  async createCoachingSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { coachId, userId } = req.body;

      if (!coachId) {
        return next(AppError.badRequest("Coach ID is required"));
      }

      const sessionId = await sessionService.createSession(coachId, userId);

      res.json({
        success: true,
        data: { sessionId },
      });
    } catch (error) {
      next(AppError.internal("Failed to create coaching session"));
    }
  }

  /**
   * POST /api/v1/coaches/sessions/:sessionId/messages
   * 코칭 메시지 전송
   */
  async sendCoachingMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;
      const { message } = req.body;

      if (!message) {
        return next(AppError.badRequest("Message is required"));
      }

      const response = await sessionService.sendMessage(sessionId, message);

      res.json({
        success: true,
        data: response,
      });
    } catch (error) {
      next(AppError.internal("Failed to send message"));
    }
  }

  /**
   * GET /api/v1/coaches/sessions/:sessionId/stream
   * 코칭 메시지 스트리밍
   */
  async streamCoachingMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;
      const { message } = req.query;

      if (!message) {
        return next(AppError.badRequest("Message is required"));
      }

      // SSE 헤더 설정
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
      });

      // 스트리밍 시작
      await sessionService.streamMessage(
        sessionId,
        message as string,
        (chunk: string) => {
          res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
        },
      );

      // 스트리밍 완료
      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (error) {
      next(AppError.internal("Failed to stream message"));
    }
  }

  /**
   * POST /api/v1/coaches/sessions/:sessionId/end
   * 코칭 세션 종료 및 분석
   */
  async endCoachingSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;
      const { messages } = req.body;

      const analysis = await sessionService.analyzeSession(sessionId, messages);

      res.json({
        success: true,
        data: analysis,
      });
    } catch (error) {
      next(AppError.internal("Failed to end coaching session"));
    }
  }

  /**
   * GET /api/v1/coaches/dashboard
   * 사용자 코칭 대시보드 조회
   */
  async getUserDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: Auth Middleware에서 userId 추출 (현재는 Query or Body로 가정하거나 Mock)
      // 실제로는 req.user.id 여야 함. 임시로 query params나 header 사용 가능.
      // 여기서는 req.query.userId로 받겠습니다 (개발 편의성).
      const userId = (req.query.userId as string) || "test-user";

      const dashboard = await coachService.getUserDashboard(userId);

      res.json({
        success: true,
        data: dashboard,
      });
    } catch (error) {
      next(AppError.internal("Failed to fetch user dashboard"));
    }
  }

  /**
   * POST /api/v1/coaches/goals
   * 목표 생성
   */
  async createGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.query.userId as string) || "test-user"; // TODO: Auth
      const { title, description } = req.body;
      const goal = await coachService.createGoal(userId, title, description);
      res.json({ success: true, data: goal });
    } catch (e) {
      next(AppError.internal("Failed to create goal"));
    }
  }

  /**
   * PATCH /api/v1/coaches/goals/:goalId
   * 목표 상태 업데이트
   */
  async updateGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.query.userId as string) || "test-user"; // TODO: Auth
      const { goalId } = req.params;
      const { status } = req.body;
      const goal = await coachService.updateGoalStatus(userId, goalId, status);
      res.json({ success: true, data: goal });
    } catch (e) {
      next(AppError.internal("Failed to update goal"));
    }
  }
}

export const coachingController = new CoachingController();
