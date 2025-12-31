import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | null = null;

export async function startTestDB(): Promise<string> {
  mongoServer = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbName: 'thehuman_capital_test'
    }
  });

  const uri = mongoServer.getUri();
  console.log('✅ In-memory MongoDB started at:', uri);
  return uri;
}

export async function stopTestDB(): Promise<void> {
  if (mongoServer) {
    await mongoServer.stop();
    console.log('✅ In-memory MongoDB stopped');
  }
}
