import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import Admin from '../../../models/admin.model';
import connectDB from '../../mongodb';

export const protectAdmin = async (req: NextRequest) => {
  let token;

  const authHeader = req.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return { error: 'Not authorized to access this route', status: 401 };
  }

  try {
    await connectDB();
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    if (decoded.role !== 'admin') {
      return { error: 'Access denied: Admin role required', status: 403 };
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return { error: 'Admin account not found', status: 401 };
    }

    return { admin };
  } catch (error) {
    return { error: 'Not authorized to access this route', status: 401 };
  }
};
