import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, S3_BUCKET } from '../config/aws';
import { v4 as uuidv4 } from 'uuid';

export async function uploadFileToS3(
  file: Express.Multer.File,
  folder: string = 'documents'
): Promise<{ key: string; url: string }> {
  const fileExtension = file.originalname.split('.').pop();
  const key = `${folder}/${uuidv4()}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ServerSideEncryption: 'AES256'
  });

  await s3Client.send(command);

  const url = await getPresignedDownloadUrl(key);

  return { key, url };
}

export async function getPresignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: key
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

export async function deleteFileFromS3(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: S3_BUCKET,
    Key: key
  });

  await s3Client.send(command);
}
