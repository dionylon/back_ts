import * as crypto from 'crypto';
import { User } from 'src/entities/user';
import * as jwt from 'jsonwebtoken';
import { Context } from 'vm';

const secret = "secretkey";

export function hashPassword(password: string): string {
  return crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');
}

export function validatePassword(raw: string, hashed: string): boolean {
  return hashPassword(raw) === hashed;
}

export function createToken(payload: any): string {
  return jwt.sign(JSON.stringify(payload), secret);;
}

export function pasrseToken(token: string): Promise<Context> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      }
      resolve(decoded);
    });
  });
}