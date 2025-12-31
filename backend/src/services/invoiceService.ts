import Invoice, { IInvoice, IInvoiceLineItem } from '../models/Invoice';
import { generateInvoiceNumber } from '../utils/helpers';
import mongoose from 'mongoose';

export async function createInvoiceFromTimeLogs(
  clientId: mongoose.Types.ObjectId,
  lineItems: IInvoiceLineItem[],
  dueDate: Date
): Promise<IInvoice> {
  const invoiceNumber = generateInvoiceNumber();

  const invoice = await Invoice.create({
    clientId,
    invoiceNumber,
    lineItems,
    dueDate,
    currency: 'USD',
    status: 'unpaid'
  });

  return invoice;
}

export async function markInvoiceAsPaid(invoiceId: string): Promise<IInvoice | null> {
  const invoice = await Invoice.findByIdAndUpdate(
    invoiceId,
    {
      status: 'paid',
      paidAt: new Date()
    },
    { new: true }
  );

  return invoice;
}

export async function markOverdueInvoices(): Promise<void> {
  const now = new Date();

  await Invoice.updateMany(
    {
      status: 'unpaid',
      dueDate: { $lt: now }
    },
    {
      $set: { status: 'overdue' }
    }
  );
}
