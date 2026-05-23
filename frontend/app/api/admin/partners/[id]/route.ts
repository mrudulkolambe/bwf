import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { protectAdmin } from '@/lib/backend/middleware/admin.middleware';
import * as adminService from '@/services/backend/admin.service';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // Auth Check
    const authResult = await protectAdmin(req);
    if ('error' in authResult) {
      return NextResponse.json(
        { success: false, message: authResult.error, data: null },
        { status: authResult.status || 401 }
      );
    }

    const { id } = await params;
    const { completed } = await req.json();

    if (typeof completed !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'Invalid field values. "completed" boolean required.', data: null },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'en';

    const partner = await adminService.updatePartnerVerification(id, completed, lang);

    return NextResponse.json({
      success: true,
      message: `Partner onboarding completion set to ${completed}`,
      data: partner
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update partner verification', data: null },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // Auth Check
    const authResult = await protectAdmin(req);
    if ('error' in authResult) {
      return NextResponse.json(
        { success: false, message: authResult.error, data: null },
        { status: authResult.status || 401 }
      );
    }

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'en';

    const partner = await adminService.deletePartner(id, lang);

    return NextResponse.json({
      success: true,
      message: 'Partner deleted successfully',
      data: partner
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete partner', data: null },
      { status: 500 }
    );
  }
}
