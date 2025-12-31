import Notification from '../models/Notification';
import mongoose from 'mongoose';

export async function createNotification(
  userId: mongoose.Types.ObjectId | string,
  type: string,
  title: string,
  message: string,
  link?: string
): Promise<void> {
  try {
    await Notification.create({
      userId,
      type,
      title,
      message,
      link,
      readStatus: false
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
}

export async function notifyInvoiceOverdue(clientId: mongoose.Types.ObjectId, invoiceNumber: string): Promise<void> {
  await createNotification(
    clientId,
    'invoice',
    'Invoice Overdue',
    `Invoice ${invoiceNumber} is now overdue. Please make payment as soon as possible.`,
    `/invoices/${invoiceNumber}`
  );
}

export async function notifyReportReady(clientId: mongoose.Types.ObjectId, reportId: string): Promise<void> {
  await createNotification(
    clientId,
    'report',
    'Report Ready',
    'Your report has been generated and is ready to download.',
    `/reports/${reportId}`
  );
}
