import * as crypto from 'crypto';

export function hashPassword(password: string): string {
  return crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');
}

export function validatePassword(raw: string, hashed: string): boolean {
  return hashPassword(raw) === hashed;
}