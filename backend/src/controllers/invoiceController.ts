import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Invoice from '../models/Invoice';
import { getPaginationParams } from '../utils/helpers';
import { createInvoiceFromTimeLogs, markInvoiceAsPaid } from '../services/invoiceService';

// Get all invoices
export const getAllInvoices = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { clientId, status, startDate, endDate } = req.query;

    const filter: any = {};
    if (clientId) filter.clientId = clientId;
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }

    const invoices = await Invoice.find(filter)
      .populate('clientId', 'name company billingEmail')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Invoice.countDocuments(filter);

    res.json({
      success: true,
      invoices: invoices,
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

// Get invoice by ID
export const getInvoiceById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('clientId', 'name company billingEmail');

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    res.json(invoice);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create new invoice
export const createInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { clientId, lineItems, dueDate } = req.body;

    const invoice = await createInvoiceFromTimeLogs(clientId, lineItems, new Date(dueDate));

    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate('clientId', 'name company billingEmail');

    res.status(201).json({
      message: 'Invoice created successfully',
      invoice: populatedInvoice
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update invoice
export const updateInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('clientId', 'name company billingEmail');

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    res.json({
      message: 'Invoice updated successfully',
      invoice
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete invoice
export const deleteInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Mark invoice as paid
export const payInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invoice = await markInvoiceAsPaid(req.params.id);

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate('clientId', 'name company billingEmail');

    res.json({
      message: 'Invoice marked as paid',
      invoice: populatedInvoice
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get invoice statistics
export const getInvoiceStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { clientId } = req.query;

    const filter: any = {};
    if (clientId) filter.clientId = clientId;

    const invoices = await Invoice.find(filter);

    const stats = {
      total: invoices.length,
      paid: invoices.filter(inv => inv.status === 'paid').length,
      unpaid: invoices.filter(inv => inv.status === 'unpaid').length,
      overdue: invoices.filter(inv => inv.status === 'overdue').length,
      totalAmount: invoices.reduce((sum, inv) => sum + inv.amount, 0),
      paidAmount: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0),
      unpaidAmount: invoices.filter(inv => inv.status !== 'paid').reduce((sum, inv) => sum + inv.amount, 0)
    };

    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
