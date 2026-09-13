import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

const sesClient = new SESv2Client({
  region: process.env.AWS_SES_REGION,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
  },
});

const FROM_ADDRESS = 'Salam Small Goods <noreply@salamsmallgoods.com.au>';

function send({ to, subject, html }) {
  return sesClient.send(new SendEmailCommand({
    FromEmailAddress: FROM_ADDRESS,
    Destination: { ToAddresses: [to] },
    Content: {
      Simple: {
        Subject: { Data: subject, Charset: 'UTF-8' },
        Body: { Html: { Data: html, Charset: 'UTF-8' } },
      },
    },
  }));
}

export function sendContactNotification({ name, email, phone, subject, message }) {
  return send({
    to: process.env.CONTACT_NOTIFICATION_EMAIL,
    subject: `New contact form submission: ${subject || 'General enquiry'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #CC3A20; padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 22px;">New Contact Form Submission</h1>
        </div>
        <div style="background: #FBF0DC; padding: 32px; border-radius: 0 0 12px 12px; border: 2px solid #E8C098; border-top: none;">
          <p style="color: #2A0D04; font-size: 15px; margin: 0 0 8px;"><strong>Name:</strong> ${name}</p>
          <p style="color: #2A0D04; font-size: 15px; margin: 0 0 8px;"><strong>Email:</strong> ${email}</p>
          <p style="color: #2A0D04; font-size: 15px; margin: 0 0 8px;"><strong>Phone:</strong> ${phone || '-'}</p>
          <p style="color: #2A0D04; font-size: 15px; margin: 0 0 8px;"><strong>Subject:</strong> ${subject || '-'}</p>
          <hr style="border: none; border-top: 1px solid #E8C098; margin: 20px 0;" />
          <p style="color: #2A0D04; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${message}</p>
        </div>
      </div>
    `,
  });
}

export function sendContactConfirmation({ name, email }) {
  return send({
    to: email,
    subject: 'We received your message — Salam Small Goods',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #CC3A20; padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 22px;">Salam Small Goods</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 14px;">Premium Halal Meats & Smallgoods</p>
        </div>
        <div style="background: #FBF0DC; padding: 32px; border-radius: 0 0 12px 12px; border: 2px solid #E8C098; border-top: none;">
          <p style="color: #5A3020; font-size: 15px; margin: 0 0 16px;">Hi ${name},</p>
          <p style="color: #2A0D04; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
            Thanks for reaching out to Salam Small Goods. We've received your message and will get back to you shortly.
          </p>
          <hr style="border: none; border-top: 1px solid #E8C098; margin: 28px 0;" />
          <p style="color: #7A5040; font-size: 13px; margin: 0;">
            Salam Small Goods · 42 Mercer Street, Broadmeadows VIC 3047<br>
            <a href="mailto:info@salamsmallgoods.com.au" style="color: #CC3A20;">info@salamsmallgoods.com.au</a>
          </p>
        </div>
      </div>
    `,
  });
}
