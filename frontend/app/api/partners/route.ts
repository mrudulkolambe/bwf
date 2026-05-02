import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import * as partnerService from '@/services/backend/partner.service';
import { sendPartnerCreationEmail } from '@/lib/email-service';

export async function GET() {
  try {
    await connectDB();
    const partners = await partnerService.getPartners();
    return NextResponse.json({
      success: true,
      message: 'Partners fetched successfully',
      data: partners
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error fetching partners', data: null }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const partner = await partnerService.createPartner(body);
    const result = await partnerService.loginPartner(partner.phone, partner.code as string);
    
    // Send email notification to admin
    await sendPartnerCreationEmail({
      name: `${partner.firstname} ${partner.lastname}`,
      phone: partner.phone,
      code: partner.code as string
    });

    return NextResponse.json({
      success: true,
      message: 'Partner created successfully',
      data: {
        token: result.token,
        partner: result.partner
      }
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error creating partner', data: null }, { status: 400 });
  }
}
