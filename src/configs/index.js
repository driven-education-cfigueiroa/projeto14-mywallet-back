import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const mongoClient = new MongoClient(
  process.env.DATABASE_URL || 'mongodb://localhost:27017'
);

try {
  await mongoClient.connect();
  console.log('Established connection to database');
} catch (error) {
  console.log('Error connecting to database', error);
}

const db = mongoClient.db();
export const users = db.collection('users');
export const sessions = db.collection('sessions');
export const entries = db.collection('entries');
