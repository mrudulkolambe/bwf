import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { protectAdmin } from '@/lib/backend/middleware/admin.middleware';
import * as adminService from '@/services/backend/admin.service';

export async function GET(req: NextRequest) {
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

    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const statusVal = searchParams.get('status') || undefined;

    let status: 'all' | 'completed' | 'pending' = 'all';
    if (statusVal === 'completed' || statusVal === 'pending') {
      status = statusVal;
    }

    const lang = searchParams.get('lang') || 'en';

    const partners = await adminService.getPartners({ search, category, status, lang });

    return NextResponse.json({
      success: true,
      message: 'Partners fetched successfully',
      data: partners
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch partners', data: null },
      { status: 500 }
    );
  }
}
