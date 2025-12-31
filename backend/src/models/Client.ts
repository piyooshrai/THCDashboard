import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  company?: string;
  industry: string;
  billingEmail?: string;
  timezone?: string;
  jobTitle: string;
  locationCity?: string;
  locationState: string;
  companySize?: string;
  companyRevenueRange?: string;
  calculatedHourlyValue: number;
  hourlyValueOverride?: number;
  dataSource: string;
  confidenceLevel: 'high' | 'medium' | 'low';
  baselineAdminHoursPerWeek: number;
  createdAt: Date;
  updatedAt: Date;
  getEffectiveHourlyValue(): number;
}

const ClientSchema = new Schema<IClient>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    trim: true
  },
  billingEmail: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        if (!v) return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please provide a valid billing email'
    }
  },
  timezone: String,
  jobTitle: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  locationCity: {
    type: String,
    trim: true
  },
  locationState: {
    type: String,
    required: [true, 'Location state is required'],
    trim: true
  },
  companySize: String,
  companyRevenueRange: String,
  calculatedHourlyValue: {
    type: Number,
    required: [true, 'Calculated hourly value is required'],
    min: [0, 'Hourly value must be positive']
  },
  hourlyValueOverride: {
    type: Number,
    min: [0, 'Hourly value override must be positive']
  },
  dataSource: {
    type: String,
    required: [true, 'Data source is required']
  },
  confidenceLevel: {
    type: String,
    enum: {
      values: ['high', 'medium', 'low'],
      message: 'Confidence level must be high, medium, or low'
    },
    required: [true, 'Confidence level is required']
  },
  baselineAdminHoursPerWeek: {
    type: Number,
    required: [true, 'Baseline admin hours per week is required'],
    min: [0, 'Baseline hours must be positive'],
    default: 15
  }
}, {
  timestamps: true
});

// Virtual for effective hourly value
ClientSchema.methods.getEffectiveHourlyValue = function(): number {
  return this.hourlyValueOverride || this.calculatedHourlyValue;
};

// Indexes
ClientSchema.index({ userId: 1 });
ClientSchema.index({ industry: 1 });
ClientSchema.index({ locationState: 1 });

export default mongoose.model<IClient>('Client', ClientSchema);
