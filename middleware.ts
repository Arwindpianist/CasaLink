import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Create route matchers for Clerk
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/security(.*)',
  '/resident(.*)',
  '/visitor(.*)',
  '/api/auth(.*)'
]);

const isPublicRoute = createRouteMatcher([
  '/',
  '/login',
  '/demo',
  '/api/webhooks(.*)',
  '/_next(.*)',
  '/favicon.ico',
  '/casalink-favicon(.*)'
]);

export default clerkMiddleware((auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) {
    return;
  }

  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    auth.protect();
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
