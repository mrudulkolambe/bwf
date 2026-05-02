import { NextResponse } from 'next/server';
import { sendPartnerCreationEmail } from '@/lib/email-service';

export async function GET() {
    try {
        await sendPartnerCreationEmail({
            name: "Test User",
            phone: "+91 00000 00000",
            code: "TEST-12345"
        });

        return NextResponse.json({
            success: true,
            message: 'Test email sent successfully. Check your inbox.'
        });
    } catch (error: any) {
        console.error('[TestEmail] Error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Failed to send test email'
        }, { status: 500 });
    }
}
