
import { NextResponse, type NextRequest } from 'next/server';
// No custom verifyAuth needed for this client-side Firebase Auth approach for /panel

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const timestamp = new Date().toISOString();
  console.log(`[Middleware RUNNING AT: ${timestamp}] Pathname: ${pathname}`);

  // For client-side Firebase Auth checking on /panel, middleware might be very simple
  // or not needed at all for /panel route protection, as the page itself handles it.
  // However, it can still be useful for other tasks or if you want a preliminary redirect
  // if NO Firebase session indicator is present (though that's harder without a server-readable cookie).

  // For now, let's assume /panel will handle its own auth checks on the client-side after loading.
  // The main purpose here is to let Next.js serve the /panel and /auth/login pages.

  if (
    pathname.startsWith('/auth/login') ||
    pathname.startsWith('/api/') || // Allow all API routes (Firebase SDK might use some)
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.webmanifest') || // for PWA manifest
    pathname.startsWith('/panel') // Allow access to /panel, client-side auth will handle it
  ) {
    console.log(`[Middleware] Allowing pass-through for: ${pathname}`);
    return NextResponse.next();
  }

  // If you had other protected routes that NEEDED server-side cookie verification,
  // that logic would go here. But for /panel, we're relying on client-side checks.

  console.log(`[Middleware] Path ${pathname} did not match specific rules. Allowing.`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply middleware to all routes to log, but specific handling is minimal for now.
    // The important part is that /panel and /auth/login are allowed to be served.
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/panel/:path*',
    '/panel',
    '/auth/login',
  ],
};
