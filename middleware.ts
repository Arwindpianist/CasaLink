import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define protected routes and their required roles
const PROTECTED_ROUTES = {
  '/admin': ['platform_admin', 'management'],
  '/admin/condos': ['platform_admin', 'management'],
  '/security': ['platform_admin', 'security'],
  '/security/visitors': ['platform_admin', 'security'],
  '/resident': ['platform_admin', 'management', 'resident', 'moderator'],
  '/resident/board': ['platform_admin', 'management', 'resident', 'moderator'],
  '/resident/chat': ['platform_admin', 'management', 'resident', 'moderator'],
  '/resident/profile': ['platform_admin', 'management', 'resident', 'moderator'],
  '/resident/qr': ['platform_admin', 'management', 'resident'],
  '/visitor': ['platform_admin', 'visitor'],
  '/visitor/amenity': ['platform_admin', 'resident', 'visitor'],
  '/visitor/scan': ['platform_admin', 'visitor'],
  '/demo': ['platform_admin', 'management', 'security', 'resident', 'visitor', 'moderator']
}

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/demo',
  '/api',
  '/_next',
  '/favicon.ico',
  '/casalink-favicon'
]

// Create route matchers for Clerk
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/security(.*)',
  '/resident(.*)',
  '/visitor(.*)'
]);

const isPublicRoute = createRouteMatcher([
  '/',
  '/login',
  '/demo',
  '/api(.*)',
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
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
