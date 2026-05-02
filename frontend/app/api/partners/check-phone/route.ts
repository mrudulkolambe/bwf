import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as partnerService from '@/services/backend/partner.service';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json({ success: false, message: 'Phone number is required', data: null }, { status: 400 });
    }

    const exists = await partnerService.checkPartnerExists(phoneNumber);
    return NextResponse.json({
      success: true,
      message: exists ? 'User exists' : 'User does not exist',
      data: { exists }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error checking phone', data: null }, { status: 500 });
  }
}
