const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const emailService = require('./emailService');
const logger = require('../utils/logger');

class AuthService {
  // Generate email verification token
  async generateEmailVerificationToken(userId) {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    await User.findByIdAndUpdate(userId, {
      emailVerificationToken: hashedToken,
    });

    return token;
  }

  // Verify email token
  async verifyEmailToken(token) {
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
    });

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    return user;
  }

  // Generate password reset token
  async generatePasswordResetToken(email) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    return { user, resetToken };
  }

  // Reset password with token
  async resetPasswordWithToken(token, newPassword) {
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return user;
  }

  // Validate refresh token
  async validateRefreshToken(token, userId) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      
      if (decoded.id !== userId) {
        return false;
      }

      const user = await User.findById(userId);
      const tokenExists = user.refreshTokens.some(
        tokenObj => tokenObj.token === token
      );

      return tokenExists;
    } catch (error) {
      return false;
    }
  }

  // Clean expired tokens for a user
  async cleanExpiredTokens(userId) {
    const user = await User.findById(userId);
    if (user) {
      user.cleanExpiredTokens();
      await user.save();
    }
  }

  // Revoke all refresh tokens
  async revokeAllTokens(userId) {
    await User.findByIdAndUpdate(userId, {
      refreshTokens: [],
    });
  }

  // Track login attempt
  async trackLoginAttempt(email, success, ipAddress) {
    logger.info({
      event: 'login_attempt',
      email,
      success,
      ip: ipAddress,
      timestamp: new Date(),
    });
  }

  // Check if account is locked
  async isAccountLocked(email) {
    // Implement account locking logic based on failed attempts
    // This is a placeholder for demonstration
    return false;
  }

  // Generate 2FA code
  async generate2FACode(userId) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    // Store code in cache with expiration
    // This is a placeholder - implement with Redis in production
    return code;
  }

  // Verify 2FA code
  async verify2FACode(userId, code) {
    // Verify code from cache
    // This is a placeholder - implement with Redis in production
    return true;
  }
}

module.exports = new AuthService();