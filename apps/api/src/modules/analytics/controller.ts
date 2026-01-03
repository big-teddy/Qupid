import { Response } from "express";
import AnalyticsService from "./app/AnalyticsService.js";
import { AppError } from "../../shared/errors/AppError.js";
import { createLogger } from "../../utils/logger.js";
import { AuthenticatedRequest } from "../../shared/middleware/authenticate.js";

const analyticsService = new AnalyticsService();
const logger = createLogger("analytics");

export const analyticsController = {
  /**
   * 성과 데이터 조회
   * 인증된 사용자만 자신의 데이터에 접근 가능
   */
  async getPerformanceData(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.params.userId;

      if (!userId) {
        throw AppError.badRequest("사용자 ID가 필요합니다");
      }

      // 인증된 사용자만 자신의 데이터에 접근하도록 검증
      if (req.user?.id !== userId) {
        throw AppError.forbidden("자신의 데이터만 조회할 수 있습니다");
      }

      const performanceData =
        await analyticsService.getUserPerformanceData(userId);

      res.json({
        success: true,
        data: performanceData,
      });
    } catch (error) {
      logger.error("Performance data error", { userId: req.params.userId, error });
      if (error instanceof AppError) {
        res.status(error.status || 500).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: "성과 데이터를 가져오는데 실패했습니다",
        });
      }
    }
  },

  async getWeeklyStats(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.params.userId;
      const { startDate, endDate } = req.query;

      if (!userId) {
        throw AppError.badRequest("사용자 ID가 필요합니다");
      }

      // 인증된 사용자만 자신의 데이터에 접근 가능
      if (req.user?.id !== userId) {
        throw AppError.forbidden("자신의 데이터만 조회할 수 있습니다");
      }

      // 주간 통계 로직 (추후 구현)
      const weeklyStats = {
        totalConversations: 0,
        averageScore: 0,
        topCategory: "",
        improvement: 0,
      };

      res.json({
        success: true,
        data: weeklyStats,
      });
    } catch (error) {
      logger.error("Weekly stats error", { userId: req.params.userId, error });
      if (error instanceof AppError) {
        res.status(error.status || 500).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: "주간 통계를 가져오는데 실패했습니다",
        });
      }
    }
  },

  async getMonthlyStats(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.params.userId;
      const { month, year } = req.query;

      if (!userId) {
        throw AppError.badRequest("사용자 ID가 필요합니다");
      }

      // 인증된 사용자만 자신의 데이터에 접근 가능
      if (req.user?.id !== userId) {
        throw AppError.forbidden("자신의 데이터만 조회할 수 있습니다");
      }

      // 월간 통계 로직 (추후 구현)
      const monthlyStats = {
        totalConversations: 0,
        averageScore: 0,
        badgesEarned: 0,
        levelProgress: 0,
      };

      res.json({
        success: true,
        data: monthlyStats,
      });
    } catch (error) {
      logger.error("Monthly stats error", { userId: req.params.userId, error });
      if (error instanceof AppError) {
        res.status(error.status || 500).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: "월간 통계를 가져오는데 실패했습니다",
        });
      }
    }
  },
};
