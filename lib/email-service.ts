import nodemailer from 'nodemailer';

// Debug environment variables
const EMAIL_DISABLED = process.env.EMAIL_DISABLE === 'true';

console.log('Email config check:', {
  HOST_EMAIL: process.env.HOST_EMAIL ? 'Set' : 'Not set',
  HOST_EMAIL_PASSWORD: process.env.HOST_EMAIL_PASSWORD ? 'Set' : 'Not set',
  NODE_ENV: process.env.NODE_ENV,
  EMAIL_DISABLED,
});

//use this in case it dont work
/*
let transporter: nodemailer.Transporter | null = null;
if (!EMAIL_DISABLED) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.HOST_EMAIL,
      pass: process.env.HOST_EMAIL_PASSWORD,
    },
  });
}
*/
// Use explicit SMTP if provided; otherwise fallback to simple Gmail service
const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || 'false') === 'true',
      auth: {
        user: process.env.HOST_EMAIL,
        pass: process.env.HOST_EMAIL_PASSWORD,
      },
    })
  : nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.HOST_EMAIL,
        pass: process.env.HOST_EMAIL_PASSWORD,
      },
    });

// Test the transporter configuration
if (!EMAIL_DISABLED && transporter) {
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ SMTP configuration error:', error);
    } else {
      console.log('✅ SMTP server is ready to send emails');
    }
  });
} else if (EMAIL_DISABLED) {
  console.log('✉️  Email sending disabled (EMAIL_DISABLE=true). Skipping SMTP setup.');
}

export async function sendOTPEmail(email: string, otp: string, name?: string) {
  if (EMAIL_DISABLED) {
    console.log(`✉️ [DEV] EMAIL_DISABLE=true. Pretending to send OTP to ${email}: ${otp}`);
    return { success: true };
  }
  const mailOptions = {
    from: process.env.HOST_EMAIL,
    to: email,
    // Avoid emojis in subject to reduce spam likelihood
    subject: 'OTP Verification - AI Biodiversity Platform',
    text: `Your verification code is: ${otp}\n\nThis code expires in 10 minutes. If you did not request this, you can ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0891b2 100%); padding: 40px; border-radius: 20px; color: white;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #06b6d4, #3b82f6); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 32px;">
            🌊
          </div>
          <h1 style="color: #06b6d4; margin: 0; font-size: 28px;">AI Biodiversity Platform</h1>
          <p style="color: #94a3b8; margin: 10px 0 0; font-size: 16px;">Marine Conservation Technology</p>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 15px; margin-bottom: 30px; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2);">
          <h2 style="color: white; margin: 0 0 20px; font-size: 24px;">Email Verification Required</h2>
          ${name ? `<p style="color: #cbd5e1; margin: 0 0 20px; font-size: 16px;">Hello ${name},</p>` : ''}
          <p style="color: #cbd5e1; margin: 0 0 25px; font-size: 16px; line-height: 1.6;">
            Thank you for joining our AI-driven biodiversity conservation platform! To complete your registration and secure your account, please verify your email address using the OTP below.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: linear-gradient(135deg, #06b6d4, #3b82f6); padding: 20px; border-radius: 15px; display: inline-block;">
              <p style="margin: 0 0 10px; color: white; font-size: 14px; font-weight: 600;">Your Verification Code</p>
              <div style="font-size: 36px; font-weight: bold; color: white; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</div>
            </div>
          </div>
          
          <p style="color: #cbd5e1; margin: 25px 0 0; font-size: 14px; line-height: 1.6;">
            <strong>Important:</strong> This OTP will expire in 10 minutes for security reasons. If you didn't request this verification, please ignore this email.
          </p>
        </div>
        
        <div style="text-align: center; color: #94a3b8; font-size: 14px;">
          <p style="margin: 0;">© 2024 AI Biodiversity Platform. All rights reserved.</p>
          <p style="margin: 10px 0 0;">Protecting marine ecosystems through advanced technology</p>
        </div>
      </div>
    `,
  };

  try {
    if (!transporter) throw new Error('SMTP transporter not configured');
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent successfully to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  if (EMAIL_DISABLED) {
    console.log(`✉️ [DEV] EMAIL_DISABLE=true. Pretending to send Welcome email to ${email}`);
    return { success: true };
  }
  const mailOptions = {
    from: process.env.HOST_EMAIL,
    to: email,
    subject: '🎉 Welcome to AI Biodiversity Platform!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0891b2 100%); padding: 40px; border-radius: 20px; color: white;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #06b6d4, #3b82f6); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 32px;">
            🎉
          </div>
          <h1 style="color: #06b6d4; margin: 0; font-size: 28px;">Welcome to AI Biodiversity!</h1>
          <p style="color: #94a3b8; margin: 10px 0 0; font-size: 16px;">Marine Conservation Technology</p>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 15px; margin-bottom: 30px; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2);">
          <h2 style="color: white; margin: 0 0 20px; font-size: 24px;">Account Successfully Verified!</h2>
          <p style="color: #cbd5e1; margin: 0 0 20px; font-size: 16px;">Hello ${name},</p>
          <p style="color: #cbd5e1; margin: 0 0 25px; font-size: 16px; line-height: 1.6;">
            Congratulations! Your account has been successfully verified and activated. You now have full access to our AI-driven biodiversity conservation platform.
          </p>
          
          <div style="background: rgba(6, 182, 212, 0.2); padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #06b6d4; margin: 0 0 15px; font-size: 18px;">What you can do now:</h3>
            <ul style="color: #cbd5e1; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">🌊 Monitor water quality data in real-time</li>
              <li style="margin-bottom: 8px;">🔍 Identify marine species using AI</li>
              <li style="margin-bottom: 8px;">📊 Analyze population trends and conservation insights</li>
              <li style="margin-bottom: 8px;">🤖 Access advanced AI processing tools</li>
              <li style="margin-bottom: 8px;">📋 View comprehensive dashboards and reports</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard" 
               style="background: linear-gradient(135deg, #06b6d4, #3b82f6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; font-size: 16px;">
              🚀 Access Your Dashboard
            </a>
          </div>
        </div>
        
        <div style="text-align: center; color: #94a3b8; font-size: 14px;">
          <p style="margin: 0;">© 2024 AI Biodiversity Platform. All rights reserved.</p>
          <p style="margin: 10px 0 0;">Thank you for joining our mission to protect marine ecosystems!</p>
        </div>
      </div>
    `,
  };

  try {
    if (!transporter) throw new Error('SMTP transporter not configured');
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent successfully to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
