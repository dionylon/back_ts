import * as crypto from 'crypto';
import { User } from 'src/entities/user';
import * as jwt from 'jsonwebtoken';

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

export function pasrseToken(token: string): { id: string, roles: string[] } {
  let ctxUser = { id: '', roles: [] };
  jwt.verify(token, secret, (err, decoded: any) => {
    if (err) {
      return undefined;
    }
    const user = decoded;
    ctxUser.id = user._id;
    ctxUser.roles = user.roles;
  });
  return ctxUser;
}