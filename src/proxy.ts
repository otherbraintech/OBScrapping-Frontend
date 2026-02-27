import { NextRequest, NextResponse } from 'next/server';
import { decrypt, updateSession } from '@/lib/auth';

const protectedRoutes = ['/', '/dashboard', '/scrapes'];
const publicRoutes = ['/login', '/register', '/api/webhook'];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path) || path.startsWith('/dashboard') || path.startsWith('/scrapes');
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = req.cookies.get('session')?.value;
  const session = cookie ? await decrypt(cookie).catch(() => null) : null;

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (isPublicRoute && session && !path.startsWith('/api')) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  if (session) {
    return await updateSession(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/webhook|_next/static|_next/image|.*\\.png$).*)'],
};
