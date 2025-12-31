import { Request } from 'express';
import { IUser } from '../models/User';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  user: Partial<IUser>;
  token: string;
  refreshToken: string;
}

export interface ROIMetrics {
  timeframe: string;
  clientHourlyValue: number;
  hoursReclaimed: number;
  valueOfReclaimedTime: number;
  vaHoursWorked: number;
  vaCost: number;
  netSavings: number;
  roiPercentage: number;
  dataSources: string[];
  calculationDate: string;
}

export interface AnalyticsData {
  totalClients: number;
  totalVAs: number;
  totalRevenue: number;
  activeProjects: number;
  avgClientSatisfaction: number;
  totalHoursWorked: number;
  revenueByMonth: Array<{ month: string; revenue: number }>;
  topPerformingVAs: Array<{ name: string; hours: number; rating: number }>;
}
