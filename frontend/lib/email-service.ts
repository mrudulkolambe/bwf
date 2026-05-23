import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendPartnerCreationEmail = async (partnerData: {
    name: string;
    phone: string;
    code: string;
}) => {
    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: 'bestworkingfirst@gmail.com',
        subject: `New Partner Created: ${partnerData.phone}`,
        text: `
            A new partner has been created in the BWF system.

            Details:
            Name: ${partnerData.name}
            Phone: ${partnerData.phone}
            Verification Code: ${partnerData.code}

            Please provide this code to the partner when they contact support.
        `,
        html: `
            <h3>New Partner Created</h3>
            <p>A new partner has been created in the BWF system.</p>
            <ul>
                <li><strong>Name:</strong> ${partnerData.name}</li>
                <li><strong>Phone:</strong> ${partnerData.phone}</li>
                <li><strong>Verification Code:</strong> <span style="font-size: 1.2em; font-weight: bold; color: #000;">${partnerData.code}</span></li>
            </ul>
            <p>Please provide this code to the partner when they contact support.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('[EmailService] Partner creation email sent successfully');
    } catch (error) {
        console.error('[EmailService] Error sending partner creation email:', error);
    }
};

export const sendAdminOTPEmail = async (email: string, otp: string) => {
    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: `BWF Connect Admin OTP Verification`,
        text: `Your BWF Connect Admin OTP is: ${otp}. This code is valid for 10 minutes.`,
        html: `
            <div style="font-family: sans-serif; padding: 24px; color: #18181b;">
                <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">Admin Portal Verification</h3>
                <p style="font-size: 0.875rem; color: #71717a;">Please use the following One-Time Password (OTP) to sign in to the BWF Connect Admin Dashboard:</p>
                <h2 style="font-size: 2.25rem; font-weight: 800; color: #000; letter-spacing: 0.1em; margin: 24px 0;">${otp}</h2>
                <p style="font-size: 0.75rem; color: #a1a1aa;">This code is valid for 10 minutes. If you did not request this, please secure your account immediately.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[EmailService] Admin OTP email sent to ${email}`);
    } catch (error) {
        console.error('[EmailService] Error sending admin OTP email:', error);
        throw new Error('Failed to send verification email');
    }
};
