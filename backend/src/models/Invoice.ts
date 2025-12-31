import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoiceLineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface IInvoice extends Document {
  _id: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  invoiceNumber: string;
  amount: number;
  currency: string;
  dueDate: Date;
  status: 'unpaid' | 'paid' | 'overdue' | 'cancelled';
  lineItems: IInvoiceLineItem[];
  pdfS3Key?: string;
  zohoPaymentUrl?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceLineItemSchema = new Schema<IInvoiceLineItem>({
  description: {
    type: String,
    required: [true, 'Line item description is required'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity must be non-negative']
  },
  rate: {
    type: Number,
    required: [true, 'Rate is required'],
    min: [0, 'Rate must be non-negative']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be non-negative']
  }
}, { _id: false });

const InvoiceSchema = new Schema<IInvoice>({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client ID is required']
  },
  invoiceNumber: {
    type: String,
    required: [true, 'Invoice number is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be non-negative']
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true,
    enum: {
      values: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
      message: 'Invalid currency'
    }
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  status: {
    type: String,
    enum: {
      values: ['unpaid', 'paid', 'overdue', 'cancelled'],
      message: 'Invalid status'
    },
    default: 'unpaid'
  },
  lineItems: {
    type: [InvoiceLineItemSchema],
    validate: {
      validator: function(items: IInvoiceLineItem[]) {
        return items && items.length > 0;
      },
      message: 'Invoice must have at least one line item'
    }
  },
  pdfS3Key: String,
  zohoPaymentUrl: String,
  paidAt: Date
}, {
  timestamps: true
});

// Indexes
InvoiceSchema.index({ clientId: 1, status: 1 });
InvoiceSchema.index({ invoiceNumber: 1 });
InvoiceSchema.index({ dueDate: 1 });

// Pre-save middleware to calculate total
InvoiceSchema.pre('save', function(next) {
  if (this.lineItems && this.lineItems.length > 0) {
    this.amount = this.lineItems.reduce((sum, item) => sum + item.amount, 0);
  }
  next();
});

export default mongoose.model<IInvoice>('Invoice', InvoiceSchema);
