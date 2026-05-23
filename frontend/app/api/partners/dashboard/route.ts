import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as partnerService from '@/services/backend/partner.service';
import { protect } from '@/lib/backend/middleware/auth.middleware';

export async function GET(req: NextRequest) {
  try {
    const auth: any = await protect(req);
    if (auth.error) {
      return NextResponse.json({ success: false, message: auth.error, data: null }, { status: auth.status });
    }

    await connectDB();
    const partner = await partnerService.getPartnerDashboardData(auth.partner.id);

    if (!partner) {
      return NextResponse.json({ success: false, message: 'Partner not found', data: null }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Dashboard data fetched successfully',
      data: {
        name: `${partner.firstname} ${partner.lastname}`,
        firstname: partner.firstname,
        lastname: partner.lastname,
        phone: partner.phone,
        email: partner.email,
        available: partner.available,
        businessCategory: partner.businessCategory ? {
          id: (partner.businessCategory as any)._id,
          title: (partner.businessCategory as any).title,
        } : null,
        onboarding: partner.onboarding,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error fetching dashboard data', data: null }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth: any = await protect(req);
    if (auth.error) {
      return NextResponse.json({ success: false, message: auth.error, data: null }, { status: auth.status });
    }

    await connectDB();
    const body = await req.json();

    if (typeof body.available !== 'boolean') {
      return NextResponse.json({ success: false, message: 'Invalid availability status', data: null }, { status: 400 });
    }

    const partner = await partnerService.updatePartner(auth.partner.id, { available: body.available });

    if (!partner) {
      return NextResponse.json({ success: false, message: 'Partner not found', data: null }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Status updated to ${body.available ? 'Available' : 'On Break'}`,
      data: { available: partner.available }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error updating availability', data: null }, { status: 500 });
  }
}
