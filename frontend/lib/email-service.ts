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
