import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Notification from '../models/Notification';
import { getPaginationParams } from '../utils/helpers';

// Get all notifications for current user
export const getMyNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { readStatus } = req.query;

    const filter: any = { userId: req.userId };
    if (readStatus !== undefined) {
      filter.readStatus = readStatus === 'true';
    }

    const notifications = await Notification.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ userId: req.userId, readStatus: false });

    res.json({
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      unreadCount
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get notification by ID
export const getNotificationById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }

    // Mark as read
    if (!notification.readStatus) {
      notification.readStatus = true;
      await notification.save();
    }

    res.json(notification);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create notification (admin only)
export const createNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notification = await Notification.create(req.body);

    res.status(201).json({
      message: 'Notification created successfully',
      notification
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Mark notification as read
export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { readStatus: true },
      { new: true }
    );

    if (!notification) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }

    res.json({
      message: 'Notification marked as read',
      notification
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Mark all as read
export const markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Notification.updateMany(
      { userId: req.userId, readStatus: false },
      { readStatus: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete notification
export const deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!notification) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete all read notifications
export const deleteAllRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Notification.deleteMany({
      userId: req.userId,
      readStatus: true
    });

    res.json({ message: 'All read notifications deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
