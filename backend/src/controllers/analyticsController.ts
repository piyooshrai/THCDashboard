import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Client from '../models/Client';
import VA from '../models/VA';
import TimeLog from '../models/TimeLog';
import Invoice from '../models/Invoice';
import Feedback from '../models/Feedback';

// Get dashboard analytics
export const getDashboardAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Basic counts
    const totalClients = await Client.countDocuments();
    const totalVAs = await VA.countDocuments();

    // Revenue
    const invoices = await Invoice.find({ status: 'paid' });
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);

    // Active projects (clients with time logs in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentTimeLogs = await TimeLog.find({
      date: { $gte: thirtyDaysAgo }
    }).distinct('clientId');
    const activeProjects = recentTimeLogs.length;

    // Average client satisfaction
    const allFeedback = await Feedback.find();
    const avgClientSatisfaction = allFeedback.length > 0
      ? allFeedback.reduce((sum, fb) => sum + fb.rating, 0) / allFeedback.length
      : 0;

    // Total hours worked
    const allTimeLogs = await TimeLog.find();
    const totalHoursWorked = allTimeLogs.reduce((sum, log) => sum + log.hoursWorked, 0);

    res.json({
      totalClients,
      totalVAs,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      activeProjects,
      avgClientSatisfaction: Math.round(avgClientSatisfaction * 100) / 100,
      totalHoursWorked: Math.round(totalHoursWorked * 100) / 100
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get revenue by month
export const getRevenueByMonth = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { months = 12 } = req.query;

    const monthsBack = parseInt(months as string);
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsBack);

    const invoices = await Invoice.find({
      status: 'paid',
      paidAt: { $gte: startDate }
    });

    // Group by month
    const revenueByMonth = invoices.reduce((acc: any, inv) => {
      const month = inv.paidAt!.toISOString().substring(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += inv.amount;
      return acc;
    }, {});

    const result = Object.entries(revenueByMonth).map(([month, revenue]) => ({
      month,
      revenue: Math.round((revenue as number) * 100) / 100
    })).sort((a, b) => a.month.localeCompare(b.month));

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get top performing VAs
export const getTopPerformingVAs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { limit = 10 } = req.query;

    const vas = await VA.find().limit(parseInt(limit as string));

    const vaStats = await Promise.all(
      vas.map(async (va) => {
        const timeLogs = await TimeLog.find({ vaId: va._id });
        const totalHours = timeLogs.reduce((sum, log) => sum + log.hoursWorked, 0);

        const feedbacks = await Feedback.find({ vaId: va._id });
        const avgRating = feedbacks.length > 0
          ? feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length
          : 0;

        return {
          id: va._id,
          name: va.name,
          department: va.department,
          totalHours: Math.round(totalHours * 100) / 100,
          avgRating: Math.round(avgRating * 100) / 100,
          feedbackCount: feedbacks.length
        };
      })
    );

    // Sort by hours worked
    vaStats.sort((a, b) => b.totalHours - a.totalHours);

    res.json(vaStats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get client analytics
export const getClientAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { clientId } = req.params;

    const client = await Client.findById(clientId);
    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    // Get time logs
    const timeLogs = await TimeLog.find({ clientId });
    const totalHours = timeLogs.reduce((sum, log) => sum + log.hoursWorked, 0);
    const totalTasks = timeLogs.reduce((sum, log) => sum + (log.tasksCompleted || 0), 0);

    // Get invoices
    const clientInvoices = await Invoice.find({ clientId });
    const totalInvoiced = clientInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalPaid = clientInvoices.filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);

    // Get unique VAs
    const uniqueVAs = new Set(timeLogs.map(log => log.vaId.toString()));

    res.json({
      client: {
        id: client._id,
        name: client.name,
        company: client.company,
        hourlyValue: client.getEffectiveHourlyValue()
      },
      stats: {
        totalHours: Math.round(totalHours * 100) / 100,
        totalTasks,
        totalVAs: uniqueVAs.size,
        totalInvoiced: Math.round(totalInvoiced * 100) / 100,
        totalPaid: Math.round(totalPaid * 100) / 100,
        outstandingBalance: Math.round((totalInvoiced - totalPaid) * 100) / 100
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get VA analytics
export const getVAAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { vaId } = req.params;

    const va = await VA.findById(vaId);
    if (!va) {
      res.status(404).json({ error: 'VA not found' });
      return;
    }

    // Get time logs
    const timeLogs = await TimeLog.find({ vaId });
    const totalHours = timeLogs.reduce((sum, log) => sum + log.hoursWorked, 0);
    const totalTasks = timeLogs.reduce((sum, log) => sum + (log.tasksCompleted || 0), 0);

    // Get unique clients
    const uniqueClients = new Set(timeLogs.map(log => log.clientId.toString()));

    // Get feedback
    const feedbacks = await Feedback.find({ vaId });
    const avgRating = feedbacks.length > 0
      ? feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length
      : 0;

    // Calculate earnings
    const totalEarnings = totalHours * va.hourlyRate;

    res.json({
      va: {
        id: va._id,
        name: va.name,
        department: va.department,
        hourlyRate: va.hourlyRate
      },
      stats: {
        totalHours: Math.round(totalHours * 100) / 100,
        totalTasks,
        totalClients: uniqueClients.size,
        totalEarnings: Math.round(totalEarnings * 100) / 100,
        avgRating: Math.round(avgRating * 100) / 100,
        feedbackCount: feedbacks.length
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
