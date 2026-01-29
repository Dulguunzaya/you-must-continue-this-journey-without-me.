import express from "express";
import { requireAuth } from "../middleware/requireAuth";
import {
  getAvailableTables,
  bookTable,
  stopMySession,
  getMyActiveSession,
  getSessionHistory,
} from "../controller/user.controller";

const router = express.Router();

// All user routes require authentication
router.use(requireAuth as any);

// Public routes (available to all authenticated users)
router.get("/tables/available", getAvailableTables as any);
router.post("/tables/:tableId/book", bookTable as any);
router.post("/sessions/stop", stopMySession as any);
router.get("/sessions/active", getMyActiveSession as any);
router.get("/sessions/history", getSessionHistory as any);

export default router;
