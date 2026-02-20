import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<void> {
  try {
    await transporter.sendMail({
      from: `"𝓐𝓡𝓚𝓘𝓥𝓔" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    });
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send email');
  }
}

export function getOrderConfirmationEmail(orderNumber: string, total: number): string {
  return `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #10b981; font-family: Playfair Display, serif;">Thank you for your order!</h1>
      <p>Your order <strong>#${orderNumber}</strong> has been received.</p>
      <p>Total: <strong>৳${total}</strong></p>
      <p>We'll send you another email when your order ships.</p>
    </div>
  `;
}

export function getVerificationEmail(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #10b981; font-family: Playfair Display, serif;">Verify your email</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${baseUrl}/verify-email?token=${token}" 
         style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
        Verify Email
      </a>
    </div>
  `;
}

export function getPasswordResetEmail(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #10b981; font-family: Playfair Display, serif;">Reset your password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${baseUrl}/reset-password?token=${token}" 
         style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
        Reset Password
      </a>
      <p style="color: #6b7280; font-size: 14px;">This link expires in 1 hour.</p>
    </div>
  `;
}
