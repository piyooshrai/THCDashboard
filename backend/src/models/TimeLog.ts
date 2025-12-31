import mongoose, { Schema, Document } from 'mongoose';

export interface ITimeLog extends Document {
  _id: mongoose.Types.ObjectId;
  vaId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  date: Date;
  hoursWorked: number;
  tasksCompleted?: number;
  taskCategory?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TimeLogSchema = new Schema<ITimeLog>({
  vaId: {
    type: Schema.Types.ObjectId,
    ref: 'VA',
    required: [true, 'VA ID is required']
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  hoursWorked: {
    type: Number,
    required: [true, 'Hours worked is required'],
    min: [0.01, 'Hours worked must be greater than 0'],
    max: [24, 'Hours worked cannot exceed 24 hours']
  },
  tasksCompleted: {
    type: Number,
    min: [0, 'Tasks completed must be non-negative']
  },
  taskCategory: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate time logs
TimeLogSchema.index({ vaId: 1, clientId: 1, date: 1 });
TimeLogSchema.index({ clientId: 1, date: -1 });
TimeLogSchema.index({ vaId: 1, date: -1 });

export default mongoose.model<ITimeLog>('TimeLog', TimeLogSchema);
