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
    const partner = await partnerService.getPartnerById(auth.partner.id);

    if (!partner) {
      return NextResponse.json({ success: false, message: 'Partner not found', data: null }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Profile fetched successfully',
      data: partner
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error fetching profile', data: null }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth: any = await protect(req);
    if (auth.error) {
      return NextResponse.json({ success: false, message: auth.error, data: null }, { status: auth.status });
    }

    await connectDB();
    const body = await req.json();

    // Construct the update object to handle nested business fields and onboarding status
    const updateData: any = { ...body };
    if (body.businessName || body.businessAddress) {
      updateData.business = {
        name: body.businessName,
        location: body.businessAddress
      };
      updateData['onboarding.business'] = true;
      delete updateData.businessName;
      delete updateData.businessAddress;
    }

    const partner = await partnerService.updatePartner(auth.partner.id, updateData);

    if (!partner) {
      return NextResponse.json({ success: false, message: 'Partner not found', data: null }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: partner
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error updating profile', data: null }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth: any = await protect(req);
    if (auth.error) {
      return NextResponse.json({ success: false, message: auth.error, data: null }, { status: auth.status });
    }

    await connectDB();
    const partner = await partnerService.deletePartner(auth.partner.id);

    if (!partner) {
      return NextResponse.json({ success: false, message: 'Partner not found', data: null }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
      data: null
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error deleting account', data: null }, { status: 500 });
  }
}
