import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { setSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get('email') || '').trim().toLowerCase();
  const password = String(form.get('password') || '');

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return NextResponse.redirect(new URL('/login?error=invalid', req.url));
  }

  setSession(email);
  return NextResponse.redirect(new URL('/dashboard', req.url));
}
