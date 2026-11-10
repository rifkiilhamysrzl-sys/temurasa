import crypto from 'crypto';

/**
 * Generate human-friendly room code like TWO-82941
 */
export function generateRoomCode(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `TWO-${randomNum}`;
}

/**
 * Generate cryptographically secure random token
 */
export function generateSecureToken(byteLength = 32): string {
  return crypto.randomBytes(byteLength).toString('hex');
}

/**
 * Hash tokens using SHA-256 before database storage
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token.trim()).digest('hex');
}
