import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const protectedPrefixes = ['/dashboard', '/customers', '/services', '/orders', '/settings'];

function isValidSession(raw?: string) {
  if (!raw) return false;
  const [email, signature] = raw.split(':');
  if (!email || !signature) return false;
  const expected = crypto
    .createHmac('sha256', process.env.SESSION_SECRET || 'dev-secret')
    .update(email)
    .digest('hex');
  return expected === signature;
}

export function middleware(req: NextRequest) {
  const isProtected = protectedPrefixes.some((prefix) => req.nextUrl.pathname.startsWith(prefix));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get('oms_session')?.value;
  if (!isValidSession(token)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/customers/:path*', '/services/:path*', '/orders/:path*', '/settings/:path*'],
};
