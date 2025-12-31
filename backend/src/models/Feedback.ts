import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  _id: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  vaId: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client ID is required']
  },
  vaId: {
    type: Schema.Types.ObjectId,
    ref: 'VA',
    required: [true, 'VA ID is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be an integer'
    }
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

FeedbackSchema.index({ vaId: 1 });
FeedbackSchema.index({ clientId: 1 });
FeedbackSchema.index({ rating: 1 });

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
