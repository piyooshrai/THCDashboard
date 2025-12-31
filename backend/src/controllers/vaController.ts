import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import VA from '../models/VA';
import User from '../models/User';
import TimeLog from '../models/TimeLog';
import Feedback from '../models/Feedback';
import { getPaginationParams } from '../utils/helpers';

// Get all VAs
export const getAllVAs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { department } = req.query;

    const filter: any = {};
    if (department) filter.department = department;

    const vas = await VA.find(filter)
      .populate('userId', 'email status')
      .populate('managerId', 'email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await VA.countDocuments(filter);

    res.json({
      data: vas,
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

// Get VA by ID
export const getVAById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const va = await VA.findById(req.params.id)
      .populate('userId', 'email status')
      .populate('managerId', 'email');

    if (!va) {
      res.status(404).json({ error: 'VA not found' });
      return;
    }

    res.json(va);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create new VA
export const createVA = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password, ...vaData } = req.body;

    // Create user account
    const user = await User.create({
      email,
      password,
      role: 'va',
      status: 'active'
    });

    // Create VA profile
    const va = await VA.create({
      userId: user._id,
      hourlyRate: vaData.hourlyRate || parseFloat(process.env.DEFAULT_VA_HOURLY_RATE || '60'),
      ...vaData
    });

    const populatedVA = await VA.findById(va._id)
      .populate('userId', 'email status')
      .populate('managerId', 'email');

    res.status(201).json({
      message: 'VA created successfully',
      va: populatedVA
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update VA
export const updateVA = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const va = await VA.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'email status').populate('managerId', 'email');

    if (!va) {
      res.status(404).json({ error: 'VA not found' });
      return;
    }

    res.json({
      message: 'VA updated successfully',
      va
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete VA
export const deleteVA = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const va = await VA.findById(req.params.id);

    if (!va) {
      res.status(404).json({ error: 'VA not found' });
      return;
    }

    // Delete associated user
    await User.findByIdAndDelete(va.userId);
    await VA.findByIdAndDelete(req.params.id);

    res.json({ message: 'VA deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get VA performance
export const getVAPerformance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const va = await VA.findById(req.params.id);

    if (!va) {
      res.status(404).json({ error: 'VA not found' });
      return;
    }

    // Get time logs
    const timeLogs = await TimeLog.find({ vaId: va._id });
    const totalHours = timeLogs.reduce((sum, log) => sum + log.hoursWorked, 0);
    const totalTasks = timeLogs.reduce((sum, log) => sum + (log.tasksCompleted || 0), 0);

    // Get feedback
    const feedbacks = await Feedback.find({ vaId: va._id });
    const avgRating = feedbacks.length > 0
      ? feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length
      : 0;

    // Get unique clients
    const uniqueClients = new Set(timeLogs.map(log => log.clientId.toString()));

    res.json({
      va,
      performance: {
        totalHours: Math.round(totalHours * 100) / 100,
        totalTasks,
        totalClients: uniqueClients.size,
        averageRating: Math.round(avgRating * 100) / 100,
        totalFeedback: feedbacks.length
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
