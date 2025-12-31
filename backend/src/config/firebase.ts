import admin from 'firebase-admin';
import logger from '../utils/logger';

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;

if (!FIREBASE_PROJECT_ID || !FIREBASE_PRIVATE_KEY || !FIREBASE_CLIENT_EMAIL) {
  logger.warn('⚠️ Firebase credentials not configured. Real-time messaging will not work.');
} else {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        privateKey: FIREBASE_PRIVATE_KEY,
        clientEmail: FIREBASE_CLIENT_EMAIL
      })
    });
    logger.info('✅ Firebase Admin initialized');
  } catch (error) {
    logger.error('❌ Failed to initialize Firebase Admin:', error);
  }
}

export const firestore = admin.firestore();
export const firebaseAuth = admin.auth();
