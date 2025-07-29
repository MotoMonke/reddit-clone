import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenForMiddleware } from './app/lib/jwt';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token || !verifyTokenForMiddleware(token)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/createpost','/notifications','/settings'],
};