import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as partnerService from '@/services/backend/partner.service';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return NextResponse.json({ message: 'Phone number and code are required', data: null }, { status: 400 });
    }

    const result = await partnerService.loginPartner(phone, code);
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Login failed', data: null }, { status: 401 });
  }
}
