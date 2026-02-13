import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Document from '../models/Document';
import { getPaginationParams } from '../utils/helpers';
import { uploadFileToS3, getPresignedDownloadUrl, deleteFileFromS3 } from '../services/s3Service';

// Get all documents
export const getAllDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { clientId, fileType } = req.query;

    const filter: any = {};
    if (clientId) filter.clientId = clientId;
    if (fileType) filter.fileType = fileType;

    const documents = await Document.find(filter)
      .populate('clientId', 'name company')
      .populate('uploadedBy', 'email role')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Document.countDocuments(filter);

    res.json({
      success: true,
      documents: documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get document by ID
export const getDocumentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('clientId', 'name company')
      .populate('uploadedBy', 'email role');

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    // Get download URL
    const downloadUrl = await getPresignedDownloadUrl(document.s3Key);

    res.json({
      ...document.toObject(),
      downloadUrl
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Upload document
export const uploadDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const { clientId } = req.body;

    // Upload to S3
    const { key, url } = await uploadFileToS3(req.file, 'documents');

    // Create document record
    const document = await Document.create({
      clientId: clientId || undefined,
      uploadedBy: req.userId,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      s3Key: key
    });

    const populatedDocument = await Document.findById(document._id)
      .populate('clientId', 'name company')
      .populate('uploadedBy', 'email role');

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: {
        ...populatedDocument!.toObject(),
        downloadUrl: url
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete document
export const deleteDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    // Delete from S3
    await deleteFileFromS3(document.s3Key);

    // Delete from database
    await Document.findByIdAndDelete(req.params.id);

    res.json({ message: 'Document deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Download document
export const downloadDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    const downloadUrl = await getPresignedDownloadUrl(document.s3Key, 300); // 5 minutes

    res.json({
      downloadUrl,
      fileName: document.fileName,
      expiresIn: 300
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
