import { Router } from "express";
import { analyticsController } from "./controller.js";
import { authenticate } from "../../shared/middleware/authenticate.js";

const router = Router();

// 모든 Analytics 라우트에 인증 필요
// 성과 데이터 조회
router.get("/performance/:userId", authenticate, analyticsController.getPerformanceData);

// 주간 통계
router.get("/weekly/:userId", authenticate, analyticsController.getWeeklyStats);

// 월간 통계
router.get("/monthly/:userId", authenticate, analyticsController.getMonthlyStats);

export default router;
