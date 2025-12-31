import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Client from '../models/Client';
import VA from '../models/VA';
import { sanitizeUser } from '../utils/helpers';
import { calculateHourlyRate } from '../services/hourlyRateService';

// Generate JWT token
const generateToken = (userId: string, email: string, role: string): string => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' } as jwt.SignOptions
  );
};

// Generate refresh token
const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' } as jwt.SignOptions
  );
};

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role, ...profileData } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'User with this email already exists' });
      return;
    }

    // Create user
    const user = await User.create({
      email,
      password,
      role,
      status: 'active'
    });

    // Create profile based on role
    if (role === 'client') {
      const rateResult = calculateHourlyRate({
        jobTitle: profileData.jobTitle,
        locationState: profileData.locationState,
        companyRevenueRange: profileData.companyRevenueRange,
        experienceYears: profileData.experienceYears
      });

      await Client.create({
        userId: user._id,
        name: profileData.name || email.split('@')[0],
        industry: profileData.industry || 'Other',
        jobTitle: profileData.jobTitle,
        locationState: profileData.locationState,
        calculatedHourlyValue: rateResult.calculatedHourlyValue,
        dataSource: rateResult.dataSource,
        confidenceLevel: rateResult.confidenceLevel,
        baselineAdminHoursPerWeek: profileData.baselineAdminHoursPerWeek || 15,
        ...profileData
      });
    } else if (role === 'va') {
      await VA.create({
        userId: user._id,
        name: profileData.name || email.split('@')[0],
        department: profileData.department || 'Other',
        hourlyRate: profileData.hourlyRate || parseFloat(process.env.DEFAULT_VA_HOURLY_RATE || '60'),
        ...profileData
      });
    }

    // Generate tokens
    const token = generateToken(user._id.toString(), user.email, user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    res.status(201).json({
      message: 'User registered successfully',
      user: sanitizeUser(user),
      token,
      refreshToken
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Check if user is active
    if (user.status !== 'active') {
      res.status(403).json({ error: 'Account is not active' });
      return;
    }

    // Generate tokens
    const token = generateToken(user._id.toString(), user.email, user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    res.json({
      message: 'Login successful',
      user: sanitizeUser(user),
      token,
      refreshToken
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token is required' });
      return;
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user || user.status !== 'active') {
      res.status(401).json({ error: 'Invalid refresh token' });
      return;
    }

    // Generate new tokens
    const newToken = generateToken(user._id.toString(), user.email, user.role);
    const newRefreshToken = generateRefreshToken(user._id.toString());

    res.json({
      token: newToken,
      refreshToken: newRefreshToken
    });
  } catch (error: any) {
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
};

// Get current user profile
export const getProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    let profile = null;
    if (user.role === 'client') {
      profile = await Client.findOne({ userId: user._id });
    } else if (user.role === 'va') {
      profile = await VA.findOne({ userId: user._id });
    }

    res.json({
      user: sanitizeUser(user),
      profile
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Logout (client-side token removal)
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'Logout successful' });
};
