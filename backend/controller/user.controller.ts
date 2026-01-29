import { Response, NextFunction } from "express";
import Table from "../model/Table";
import Session from "../model/Session";
import { AuthenticatedRequest } from "../../lib/auth";

export const getAvailableTables = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const tables = await Table.find({ 
      status: "AVAILABLE" 
    }).sort({ name: 1 });
    
    res.json(tables);
  } catch (error) {
    next(error);
  }
};

export const bookTable = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { tableId } = req.params;
    const userId = req.user!.userId;

    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    if (table.status !== "AVAILABLE") {
      return res.status(400).json({ 
        message: "Table is not available for booking" 
      });
    }

    const existingActiveSession = await Session.findOne({
      userId: userId as any,
      isActive: true
    });

    if (existingActiveSession) {
      return res.status(400).json({ 
        message: "You already have an active session" 
      });
    }

    const session = await Session.create({
      userId: userId as any,
      tableId,
      startTime: new Date(),
      isActive: true
    });

    table.status = "PLAYING";
    await table.save();

    res.status(201).json({
      message: "Table booked successfully",
      table,
      session
    });
  } catch (error) {
    next(error);
  }
};

export const stopMySession = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    const activeSession = await Session.findOne({
      userId: userId as any,
      isActive: true
    }).populate('tableId');

    if (!activeSession) {
      return res.status(404).json({ message: "No active session found" });
    }

    const table = activeSession.tableId as any;
    
    activeSession.isActive = false;
    activeSession.endTime = new Date();
    activeSession.totalCost = (activeSession as any).calculateCost(table.pricePerMinute);
    await activeSession.save();

    table.status = "AVAILABLE";
    await table.save();

    res.json({
      message: "Session stopped successfully",
      session: activeSession,
      totalCost: activeSession.totalCost
    });
  } catch (error) {
    next(error);
  }
};

export const getMyActiveSession = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    const activeSession = await Session.findOne({
      userId: userId as any,
      isActive: true
    }).populate('tableId');

    if (!activeSession) {
      return res.json({ session: null });
    }

    const session = activeSession as any;
    const table = session.tableId;
    
    const currentTime = new Date();
    const durationInMinutes = Math.ceil((currentTime.getTime() - session.startTime.getTime()) / (1000 * 60));
    const currentCost = durationInMinutes * table.pricePerMinute;

    res.json({
      session: activeSession,
      currentCost,
      durationInMinutes
    });
  } catch (error) {
    next(error);
  }
};

export const getSessionHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { page = 1, limit = 10 } = req.query;

    const sessions = await Session.find({ 
      userId: userId as any,
      isActive: false 
    })
    .populate('tableId')
    .sort({ endTime: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

    const total = await Session.countDocuments({ 
      userId: userId as any,
      isActive: false 
    });

    res.json({
      sessions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};
