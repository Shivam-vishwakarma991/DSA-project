const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
  }

  createTransporter() {
    if (process.env.NODE_ENV === 'production') {
      // Production email service (SendGrid, AWS SES, etc.)
      return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      // Development email service (Mailtrap, Ethereal, etc.)
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
        port: process.env.EMAIL_PORT || 2525,
        auth: {
          user: process.env.EMAIL_USER || 'test',
          pass: process.env.EMAIL_PASS || 'test',
        },
      });
    }
  }

  async sendEmail(options) {
    try {
      const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(user, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to DSA Mastery!</h1>
            </div>
            <div class="content">
              <h2>Hi ${user.fullName},</h2>
              <p>Thank you for joining DSA Mastery! We're excited to have you on board.</p>
              <p>To get started, please verify your email address by clicking the button below:</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all;">${verificationUrl}</p>
              <p>This link will expire in 24 hours.</p>
              <h3>What's next?</h3>
              <ul>
                <li>Complete your profile</li>
                <li>Choose your first topic to master</li>
                <li>Start solving problems and track your progress</li>
                <li>Join our community of learners</li>
              </ul>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Happy learning!</p>
              <p>The DSA Mastery Team</p>
            </div>
            <div class="footer">
              <p>© 2024 DSA Mastery. All rights reserved.</p>
              <p>If you didn't sign up for this account, please ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: user.email,
      subject: 'Welcome to DSA Mastery - Verify Your Email',
      html,
      text: `Welcome to DSA Mastery! Please verify your email: ${verificationUrl}`,
    });
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #dc2626; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fef2f2; border-left: 4px solid #dc2626; padding: 10px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hi ${user.fullName},</h2>
              <p>We received a request to reset your password for your DSA Mastery account.</p>
              <p>Click the button below to reset your password:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all;">${resetUrl}</p>
              <div class="warning">
                <strong>Important:</strong> This link will expire in 10 minutes for security reasons.
              </div>
              <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
              <p>For security reasons, we recommend that you:</p>
              <ul>
                <li>Use a strong, unique password</li>
                <li>Enable two-factor authentication</li>
                <li>Never share your password with anyone</li>
              </ul>
              <p>Best regards,<br>The DSA Mastery Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: user.email,
      subject: 'Password Reset Request - DSA Mastery',
      html,
      text: `Password reset requested. Reset your password here: ${resetUrl}`,
    });
  }

  async sendProgressReport(user, stats) {
    // Weekly progress report email
    const html = `
      <h2>Your Weekly Progress Report</h2>
      <p>Hi ${user.fullName},</p>
      <p>Here's your progress for this week:</p>
      <ul>
        <li>Problems Solved: ${stats.weeklyCompleted}</li>
        <li>Current Streak: ${stats.streak} days</li>
        <li>Topics Covered: ${stats.topicsCovered}</li>
        <li>Time Spent: ${stats.timeSpent} hours</li>
      </ul>
      <p>Keep up the great work!</p>
    `;

    await this.sendEmail({
      to: user.email,
      subject: 'Your Weekly DSA Progress Report',
      html,
    });
  }

  async sendAchievementUnlocked(user, achievement) {
    const html = `
      <h2>🎉 Achievement Unlocked!</h2>
      <p>Congratulations ${user.fullName}!</p>
      <p>You've unlocked a new achievement: <strong>${achievement.name}</strong></p>
      <p>${achievement.description}</p>
      <p>Keep solving problems to unlock more achievements!</p>
    `;

    await this.sendEmail({
      to: user.email,
      subject: `Achievement Unlocked: ${achievement.name}`,
      html,
    });
  }
}

module.exports = new EmailService();