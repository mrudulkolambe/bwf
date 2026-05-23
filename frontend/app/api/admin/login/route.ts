import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as adminService from '@/services/backend/admin.service';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { phone, email, code } = await req.json();

    if (!phone || !email) {
      return NextResponse.json(
        { success: false, message: 'Phone number and email are required', data: null },
        { status: 400 }
      );
    }

    if (code) {
      // OTP Verification Phase
      const result = await adminService.verifyAdminOTP(phone, email, code);
      return NextResponse.json({
        success: true,
        message: 'Verification successful',
        data: result
      });
    } else {
      // Request OTP Phase
      const result = await adminService.requestAdminOTP(phone, email);
      return NextResponse.json({
        success: true,
        message: result.message,
        data: { otpSent: true, code: result.code }
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Authentication failed', data: null },
      { status: 400 }
    );
  }
}
