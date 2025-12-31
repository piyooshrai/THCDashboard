import mongoose, { Schema, Document } from 'mongoose';

export interface IVA extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  department: string;
  managerId?: mongoose.Types.ObjectId;
  hourlyRate: number;
  specialization?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VASchema = new Schema<IVA>({
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
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
    enum: {
      values: ['Marketing', 'Accounting', 'Admin', 'Customer Support', 'Operations', 'Other'],
      message: 'Invalid department'
    }
  },
  managerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  hourlyRate: {
    type: Number,
    required: [true, 'Hourly rate is required'],
    min: [0, 'Hourly rate must be positive'],
    default: 60
  },
  specialization: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes
VASchema.index({ userId: 1 });
VASchema.index({ department: 1 });
VASchema.index({ managerId: 1 });

export default mongoose.model<IVA>('VA', VASchema);
