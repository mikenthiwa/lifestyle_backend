import { MongoClient } from 'mongodb';
import { ConfigService } from '@nestjs/config';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

export const getDb = async () => {
  const client: any = await MongoClient.connect(String(MONGO_URL));
  return client.db();
};
