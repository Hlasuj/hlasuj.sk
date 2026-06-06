import crypto from 'crypto';
import { NextRequest } from 'next/server';

function adminToken(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) throw new Error('ADMIN_PASSWORD env var not set');
  return crypto.createHash('sha256').update(pw).digest('hex');
}

export function checkAdminAuth(req: NextRequest): boolean {
  const cookie = req.cookies.get('admin_token')?.value;
  if (!cookie) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(cookie),
      Buffer.from(adminToken())
    );
  } catch {
    return false;
  }
}

export { adminToken };
