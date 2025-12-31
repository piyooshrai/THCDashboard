import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  _id: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  type: 'weekly' | 'monthly' | 'custom';
  periodStart: Date;
  periodEnd: Date;
  pdfS3Key?: string;
  status: 'pending' | 'generated' | 'failed';
  metrics?: any;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client ID is required']
  },
  type: {
    type: String,
    enum: {
      values: ['weekly', 'monthly', 'custom'],
      message: 'Type must be weekly, monthly, or custom'
    },
    required: [true, 'Report type is required']
  },
  periodStart: {
    type: Date,
    required: [true, 'Period start date is required']
  },
  periodEnd: {
    type: Date,
    required: [true, 'Period end date is required'],
    validate: {
      validator: function(this: IReport, value: Date) {
        return value > this.periodStart;
      },
      message: 'Period end must be after period start'
    }
  },
  pdfS3Key: String,
  status: {
    type: String,
    enum: {
      values: ['pending', 'generated', 'failed'],
      message: 'Status must be pending, generated, or failed'
    },
    default: 'pending'
  },
  metrics: Schema.Types.Mixed
}, {
  timestamps: true
});

ReportSchema.index({ clientId: 1, createdAt: -1 });
ReportSchema.index({ status: 1 });

export default mongoose.model<IReport>('Report', ReportSchema);
