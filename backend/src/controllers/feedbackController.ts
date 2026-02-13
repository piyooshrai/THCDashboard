import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Feedback from '../models/Feedback';
import { getPaginationParams } from '../utils/helpers';

// Get all feedback
export const getAllFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { vaId, clientId, rating } = req.query;

    const filter: any = {};
    if (vaId) filter.vaId = vaId;
    if (clientId) filter.clientId = clientId;
    if (rating) filter.rating = parseInt(rating as string);

    const feedbacks = await Feedback.find(filter)
      .populate('vaId', 'name department')
      .populate('clientId', 'name company')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Feedback.countDocuments(filter);

    res.json({
      success: true,
      feedbacks: feedbacks,
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

// Get feedback by ID
export const getFeedbackById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('vaId', 'name department')
      .populate('clientId', 'name company');

    if (!feedback) {
      res.status(404).json({ error: 'Feedback not found' });
      return;
    }

    res.json(feedback);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create new feedback
export const createFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const feedback = await Feedback.create({
      ...req.body,
      clientId: req.body.clientId || req.userId
    });

    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate('vaId', 'name department')
      .populate('clientId', 'name company');

    res.status(201).json({
      message: 'Feedback created successfully',
      feedback: populatedFeedback
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update feedback
export const updateFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('vaId', 'name department').populate('clientId', 'name company');

    if (!feedback) {
      res.status(404).json({ error: 'Feedback not found' });
      return;
    }

    res.json({
      message: 'Feedback updated successfully',
      feedback
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete feedback
export const deleteFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      res.status(404).json({ error: 'Feedback not found' });
      return;
    }

    res.json({ success: true, message: 'Feedback deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get VA average rating
export const getVAFeedbackStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { vaId } = req.params;

    const feedbacks = await Feedback.find({ vaId });

    const stats = {
      total: feedbacks.length,
      averageRating: feedbacks.length > 0
        ? feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length
        : 0,
      ratingDistribution: {
        1: feedbacks.filter(fb => fb.rating === 1).length,
        2: feedbacks.filter(fb => fb.rating === 2).length,
        3: feedbacks.filter(fb => fb.rating === 3).length,
        4: feedbacks.filter(fb => fb.rating === 4).length,
        5: feedbacks.filter(fb => fb.rating === 5).length
      }
    };

    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
