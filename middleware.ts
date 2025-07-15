import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './app/lib/jwt';

export function middleware(request: NextRequest) {
    console.log("middleware")
  const token = request.cookies.get('token')?.value;
  console.log('got token');
  console.log(token)
  if (!token || !verifyToken(token)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  console.log('token is good');
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};