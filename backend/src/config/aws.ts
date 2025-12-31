import { S3Client } from '@aws-sdk/client-s3';
import logger from '../utils/logger';

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  logger.warn('⚠️ AWS credentials not configured. S3 operations will fail.');
}

export const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID || '',
    secretAccessKey: AWS_SECRET_ACCESS_KEY || ''
  }
});

export const S3_BUCKET = process.env.AWS_S3_BUCKET || 'thehuman-capital-documents';
