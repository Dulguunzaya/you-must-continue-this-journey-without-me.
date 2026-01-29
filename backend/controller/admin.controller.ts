import { Response, NextFunction } from "express";
import Table from "../model/Table";
import Session from "../model/Session";
import { AuthenticatedRequest } from "../../lib/auth";

export const createTable = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, pricePerMinute } = req.body;

    if (!name || !pricePerMinute || pricePerMinute < 0) {
      return res.status(400).json({ 
        message: "Table name and valid price per minute are required" 
      });
    }

    const existingTable = await Table.findOne({ name });
    if (existingTable) {
      return res.status(400).json({ message: "Table with this name already exists" });
    }

    const table = await Table.create({
      name: name.trim(),
      pricePerMinute,
      status: "AVAILABLE"
    });

    res.status(201).json(table);
  } catch (error) {
    next(error);
  }
};

export const deleteTable = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const table = await Table.findById(id);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    if (table.status === "PLAYING") {
      return res.status(400).json({ message: "Cannot delete a table that is currently in use" });
    }

    await Session.deleteMany({ tableId: id });
    await Table.findByIdAndDelete(id);

    res.json({ success: true, message: "Table deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const stopTable = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const table = await Table.findById(id);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    if (table.status !== "PLAYING") {
      return res.status(400).json({ message: "Table is not currently in use" });
    }

    const activeSession = await Session.findOne({ 
      tableId: id, 
      isActive: true 
    });

    if (activeSession) {
      activeSession.isActive = false;
      activeSession.endTime = new Date();
      (activeSession as any).totalCost = (activeSession as any).calculateCost(table.pricePerMinute);
      await activeSession.save();
    }

    table.status = "AVAILABLE";
    await table.save();

    res.json({ 
      table, 
      session: activeSession,
      message: "Table stopped successfully" 
    });
  } catch (error) {
    next(error);
  }
};

export const toggleTableStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["AVAILABLE", "DISABLED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be AVAILABLE or DISABLED" });
    }

    const table = await Table.findById(id);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    if (table.status === "PLAYING") {
      return res.status(400).json({ message: "Cannot change status of a table that is currently in use" });
    }

    table.status = status;
    await table.save();

    res.json({ table, message: `Table ${status.toLowerCase()} successfully` });
  } catch (error) {
    next(error);
  }
};

export const getAllTables = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const tables = await Table.find().sort({ createdAt: 1 });
    res.json(tables);
  } catch (error) {
    next(error);
  }
};
