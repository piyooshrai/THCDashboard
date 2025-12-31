import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import { getPaginationParams, sanitizeUser } from '../utils/helpers';

// Get all users (admin only)
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { role, status } = req.query;

    const filter: any = {};
    if (role) filter.role = role;
    if (status) filter.status = status;

    const users = await User.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      data: users.map(sanitizeUser),
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

// Get user by ID
export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(sanitizeUser(user));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update user
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { password, role, ...updateData } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Only admins can change role
    if (role && req.userRole !== 'admin') {
      res.status(403).json({ error: 'Only admins can change user roles' });
      return;
    }

    // Update user fields
    Object.assign(user, updateData);
    if (role) user.role = role;
    if (password) user.password = password;

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: sanitizeUser(user)
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Toggle user status
export const toggleUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    user.status = user.status === 'active' ? 'inactive' : 'active';
    await user.save();

    res.json({
      message: 'User status updated successfully',
      user: sanitizeUser(user)
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
