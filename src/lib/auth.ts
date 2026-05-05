import crypto from 'crypto';
import { cookies } from 'next/headers';

const SESSION_KEY = 'oms_session';

function signEmail(email: string) {
  return crypto
    .createHmac('sha256', process.env.SESSION_SECRET || 'dev-secret')
    .update(email)
    .digest('hex');
}

export function setSession(email: string) {
  const value = `${email}:${signEmail(email)}`;
  cookies().set(SESSION_KEY, value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
}

export function clearSession() {
  cookies().delete(SESSION_KEY);
}

export function parseSession(raw: string | undefined) {
  if (!raw) return null;
  const [email, signature] = raw.split(':');
  if (!email || !signature) return null;
  return signEmail(email) === signature ? email : null;
}
