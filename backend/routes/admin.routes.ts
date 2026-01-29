import express from "express";
import { requireAuth } from "../middleware/requireAuth";
import { requireAdmin } from "../middleware/requireAdmin";
import {
  createTable,
  deleteTable,
  stopTable,
  toggleTableStatus,
  getAllTables,
} from "../controller/admin.controller";

const router = express.Router();

// Table management routes - apply middleware to each route
router.get("/tables", requireAuth as any, requireAdmin as any, getAllTables as any);
router.post("/tables", requireAuth as any, requireAdmin as any, createTable as any);
router.delete("/tables/:id", requireAuth as any, requireAdmin as any, deleteTable as any);
router.post("/tables/:id/stop", requireAuth as any, requireAdmin as any, stopTable as any);
router.patch("/tables/:id/status", requireAuth as any, requireAdmin as any, toggleTableStatus as any);

export default router;
