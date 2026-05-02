import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Partner from '../../../models/partner.model';
import connectDB from '../../mongodb';

export const protect = async (req: NextRequest) => {
  let token;

  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return { error: 'Not authorized to access this route', status: 401 };
  }

  try {
    await connectDB();
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const partner = await Partner.findById(decoded.id);
    
    if (!partner) {
      return { error: 'Partner not found', status: 401 };
    }

    return { partner };
  } catch (error) {
    return { error: 'Not authorized to access this route', status: 401 };
  }
};
