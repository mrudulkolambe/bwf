import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as partnerService from '@/services/backend/partner.service';
import { protect } from '@/lib/backend/middleware/auth.middleware';

export async function PUT(req: NextRequest) {
  try {
    const auth: any = await protect(req);
    if (auth.error) {
      return NextResponse.json({ success: false, message: auth.error, data: null }, { status: auth.status });
    }

    await connectDB();
    const body = await req.json();
    const partner = await partnerService.updateBusinessDetails(auth.partner.id, body);

    if (!partner) {
      return NextResponse.json({ success: false, message: 'Partner not found', data: null }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Business details updated successfully',
      data: partner
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error updating business details', data: null }, { status: 400 });
  }
}
