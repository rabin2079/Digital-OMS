import { clearSession } from '@/lib/auth';
export async function POST(){clearSession(); return Response.redirect(new URL('/login','http://localhost:3000'));}
