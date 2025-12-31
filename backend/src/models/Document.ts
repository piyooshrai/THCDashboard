import mongoose, { Schema, Document } from 'mongoose';

export interface IDocument extends Document {
  _id: mongoose.Types.ObjectId;
  clientId?: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
  fileName: string;
  fileType: string;
  fileSize: number;
  s3Key: string;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client'
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploaded by is required']
  },
  fileName: {
    type: String,
    required: [true, 'File name is required'],
    trim: true
  },
  fileType: {
    type: String,
    required: [true, 'File type is required'],
    trim: true
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required'],
    min: [0, 'File size must be positive']
  },
  s3Key: {
    type: String,
    required: [true, 'S3 key is required'],
    unique: true
  }
}, {
  timestamps: true
});

DocumentSchema.index({ clientId: 1 });
DocumentSchema.index({ uploadedBy: 1 });
DocumentSchema.index({ s3Key: 1 });

export default mongoose.model<IDocument>('Document', DocumentSchema);
