import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  _id: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  action: string;
  resourceType: string;
  resourceId?: mongoose.Types.ObjectId;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    trim: true
  },
  resourceType: {
    type: String,
    required: [true, 'Resource type is required'],
    trim: true
  },
  resourceId: Schema.Types.ObjectId,
  ipAddress: String,
  userAgent: String,
  metadata: Schema.Types.Mixed
}, {
  timestamps: true
});

AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ resourceType: 1, resourceId: 1 });
AuditLogSchema.index({ action: 1 });

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
