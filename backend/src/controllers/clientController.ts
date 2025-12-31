import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Client from '../models/Client';
import User from '../models/User';
import TimeLog from '../models/TimeLog';
import { getPaginationParams } from '../utils/helpers';
import { calculateHourlyRate } from '../services/hourlyRateService';
import { calculateROI } from '../services/roiService';

// Get all clients
export const getAllClients = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { industry, locationState } = req.query;

    const filter: any = {};
    if (industry) filter.industry = industry;
    if (locationState) filter.locationState = locationState;

    const clients = await Client.find(filter)
      .populate('userId', 'email status')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Client.countDocuments(filter);

    res.json({
      data: clients,
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

// Get client by ID
export const getClientById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const client = await Client.findById(req.params.id).populate('userId', 'email status');

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    res.json(client);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create new client
export const createClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password, ...clientData } = req.body;

    // Create user account
    const user = await User.create({
      email,
      password,
      role: 'client',
      status: 'active'
    });

    // Calculate hourly rate
    const rateResult = calculateHourlyRate({
      jobTitle: clientData.jobTitle,
      locationState: clientData.locationState,
      companyRevenueRange: clientData.companyRevenueRange,
      experienceYears: clientData.experienceYears
    });

    // Create client profile
    const client = await Client.create({
      userId: user._id,
      calculatedHourlyValue: rateResult.calculatedHourlyValue,
      dataSource: rateResult.dataSource,
      confidenceLevel: rateResult.confidenceLevel,
      ...clientData
    });

    const populatedClient = await Client.findById(client._id).populate('userId', 'email status');

    res.status(201).json({
      message: 'Client created successfully',
      client: populatedClient
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update client
export const updateClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'email status');

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    res.json({
      message: 'Client updated successfully',
      client
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete client
export const deleteClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    // Delete associated user
    await User.findByIdAndDelete(client.userId);
    await Client.findByIdAndDelete(req.params.id);

    res.json({ message: 'Client deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get client ROI
export const getClientROI = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    const timeframe = (req.query.timeframe as 'weekly' | 'monthly' | 'yearly') || 'monthly';

    // Get time logs for the client
    const timeLogs = await TimeLog.find({ clientId: client._id });

    const roi = calculateROI(client, timeLogs, timeframe);

    res.json(roi);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Recalculate hourly value
export const recalculateHourlyValue = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    const rateResult = calculateHourlyRate({
      jobTitle: client.jobTitle,
      locationState: client.locationState,
      companyRevenueRange: client.companyRevenueRange
    });

    client.calculatedHourlyValue = rateResult.calculatedHourlyValue;
    client.dataSource = rateResult.dataSource;
    client.confidenceLevel = rateResult.confidenceLevel;

    await client.save();

    res.json({
      message: 'Hourly value recalculated successfully',
      client
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
