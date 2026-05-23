import mongoose from 'mongoose';
import Tag from '@/models/tag.model';
import Category from '@/models/category.model';
import Partner from '@/models/partner.model';
import User from '@/models/user.model';
import Admin from '@/models/admin.model';

const _models = { Tag, Category, Partner, User, Admin };

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bwf';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
