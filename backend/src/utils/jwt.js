import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

/**
 * Generate access token
 * @param {Object} payload - Token payload (usually { userId, email })
 * @returns {string} JWT access token
 */
export function generateAccessToken(payload) {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

/**
 * Generate refresh token
 * @param {Object} payload - Token payload (usually { userId })
 * @returns {string} JWT refresh token
 */
export function generateRefreshToken(payload) {
  return jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  });
}

/**
 * Verify access token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export function verifyAccessToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

/**
 * Verify refresh token
 * @param {string} token - JWT refresh token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export function verifyRefreshToken(token) {
  return jwt.verify(token, config.jwtRefreshSecret);
}

/**
 * Generate both access and refresh tokens
 * @param {Object} user - User object with id and email
 * @returns {Object} Object containing accessToken and refreshToken
 */
export function generateTokenPair(user) {
  const payload = {
    userId: user.id,
    email: user.email,
  };

  const refreshPayload = {
    userId: user.id,
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(refreshPayload),
  };
}
