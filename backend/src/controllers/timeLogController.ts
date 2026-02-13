import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import TimeLog from '../models/TimeLog';
import { getPaginationParams } from '../utils/helpers';

// Get all time logs
export const getAllTimeLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { vaId, clientId, startDate, endDate } = req.query;

    const filter: any = {};
    if (vaId) filter.vaId = vaId;
    if (clientId) filter.clientId = clientId;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }

    const timeLogs = await TimeLog.find(filter)
      .populate('vaId', 'name department')
      .populate('clientId', 'name company')
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 });

    const total = await TimeLog.countDocuments(filter);

    res.json({
      success: true,
      timeLogs: timeLogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get time log by ID
export const getTimeLogById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const timeLog = await TimeLog.findById(req.params.id)
      .populate('vaId', 'name department')
      .populate('clientId', 'name company');

    if (!timeLog) {
      res.status(404).json({ error: 'Time log not found' });
      return;
    }

    res.json(timeLog);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create new time log
export const createTimeLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const timeLog = await TimeLog.create(req.body);

    const populatedTimeLog = await TimeLog.findById(timeLog._id)
      .populate('vaId', 'name department')
      .populate('clientId', 'name company');

    res.status(201).json({
      message: 'Time log created successfully',
      timeLog: populatedTimeLog
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update time log
export const updateTimeLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const timeLog = await TimeLog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('vaId', 'name department').populate('clientId', 'name company');

    if (!timeLog) {
      res.status(404).json({ error: 'Time log not found' });
      return;
    }

    res.json({
      message: 'Time log updated successfully',
      timeLog
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete time log
export const deleteTimeLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const timeLog = await TimeLog.findByIdAndDelete(req.params.id);

    if (!timeLog) {
      res.status(404).json({ error: 'Time log not found' });
      return;
    }

    res.json({ success: true, message: 'Time log deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get summary statistics
export const getTimeLogSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { vaId, clientId, startDate, endDate } = req.query;

    const filter: any = {};
    if (vaId) filter.vaId = vaId;
    if (clientId) filter.clientId = clientId;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }

    const timeLogs = await TimeLog.find(filter);

    const summary = {
      totalHours: timeLogs.reduce((sum, log) => sum + log.hoursWorked, 0),
      totalTasks: timeLogs.reduce((sum, log) => sum + (log.tasksCompleted || 0), 0),
      totalLogs: timeLogs.length,
      averageHoursPerLog: timeLogs.length > 0
        ? timeLogs.reduce((sum, log) => sum + log.hoursWorked, 0) / timeLogs.length
        : 0
    };

    res.json(summary);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
