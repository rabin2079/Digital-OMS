import { NextRequest, NextResponse } from 'next/server';
export function middleware(req: NextRequest){
  const { pathname } = req.nextUrl;
  if(pathname.startsWith('/dashboard')||pathname.startsWith('/customers')||pathname.startsWith('/services')||pathname.startsWith('/orders')||pathname.startsWith('/settings')){
    if(!req.cookies.get('oms_session')) return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}
