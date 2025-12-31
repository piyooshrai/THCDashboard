import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Report from '../models/Report';
import TimeLog from '../models/TimeLog';
import Client from '../models/Client';
import { getPaginationParams, calculateDateRange } from '../utils/helpers';
import { calculateROI } from '../services/roiService';

// Get all reports
export const getAllReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { clientId, type, status } = req.query;

    const filter: any = {};
    if (clientId) filter.clientId = clientId;
    if (type) filter.type = type;
    if (status) filter.status = status;

    const reports = await Report.find(filter)
      .populate('clientId', 'name company')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Report.countDocuments(filter);

    res.json({
      data: reports,
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

// Get report by ID
export const getReportById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('clientId', 'name company');

    if (!report) {
      res.status(404).json({ error: 'Report not found' });
      return;
    }

    res.json(report);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create and generate new report
export const createReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { clientId, type, periodStart, periodEnd } = req.body;

    // Get client
    const client = await Client.findById(clientId);
    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    // Calculate date range if not provided
    let start = periodStart ? new Date(periodStart) : null;
    let end = periodEnd ? new Date(periodEnd) : null;

    if (!start || !end) {
      const range = calculateDateRange(type, start!, end!);
      start = range.start;
      end = range.end;
    }

    // Get time logs for the period
    const timeLogs = await TimeLog.find({
      clientId,
      date: { $gte: start, $lte: end }
    });

    // Calculate metrics
    const roi = calculateROI(client, timeLogs, type === 'weekly' ? 'weekly' : 'monthly');

    const metrics = {
      roi,
      timeLogs: {
        total: timeLogs.length,
        totalHours: timeLogs.reduce((sum, log) => sum + log.hoursWorked, 0),
        totalTasks: timeLogs.reduce((sum, log) => sum + (log.tasksCompleted || 0), 0)
      },
      period: {
        start,
        end
      }
    };

    // Create report
    const report = await Report.create({
      clientId,
      type,
      periodStart: start,
      periodEnd: end,
      status: 'generated',
      metrics
    });

    const populatedReport = await Report.findById(report._id)
      .populate('clientId', 'name company');

    res.status(201).json({
      message: 'Report generated successfully',
      report: populatedReport
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete report
export const deleteReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      res.status(404).json({ error: 'Report not found' });
      return;
    }

    res.json({ message: 'Report deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Download report
export const downloadReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('clientId', 'name company');

    if (!report) {
      res.status(404).json({ error: 'Report not found' });
      return;
    }

    // For now, return JSON. In production, this would return a PDF
    res.json({
      message: 'Report download',
      report,
      note: 'PDF generation would be implemented with a library like pdfkit or puppeteer'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
