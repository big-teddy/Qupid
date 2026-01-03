import { Router } from "express";
import { BadgeController } from "./controller.js";
import { authenticate } from "../../shared/middleware/authenticate.js";

const router = Router();
const controller = new BadgeController();

// Get all badges (public)
router.get("/badges", controller.getAllBadges);

// Get user badges (authenticated)
router.get("/users/:userId/badges", authenticate, controller.getUserBadges);

// Award badge to user (authenticated)
router.post("/users/:userId/badges", authenticate, controller.awardBadge);

export default router;
