import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: string;
  title: string;
  message: string;
  link?: string;
  readStatus: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  link: {
    type: String,
    trim: true
  },
  readStatus: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

NotificationSchema.index({ userId: 1, readStatus: 1 });
NotificationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);
