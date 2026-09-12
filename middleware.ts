import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isValidShortCode, NOT_FOUND_TTL_SECONDS } from '@/lib/shortCode';

const RESERVED_PATHS = new Set([
  'privacy-policy',
  'terms-of-service',
]);

export function middleware(request: NextRequest): NextResponse {
  const segment = request.nextUrl.pathname.slice(1);

  if (!segment || RESERVED_PATHS.has(segment) || isValidShortCode(segment)) {
    return NextResponse.next();
  }

  return new NextResponse('Short URL not found', {
    status: 404,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': `public, s-maxage=${NOT_FOUND_TTL_SECONDS}, max-age=60`,
      'CDN-Cache-Control': `public, s-maxage=${NOT_FOUND_TTL_SECONDS}`,
      'Vercel-CDN-Cache-Control': `public, s-maxage=${NOT_FOUND_TTL_SECONDS}`,
    },
  });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|privacy-policy|terms-of-service)[^/.]+)',
  ],
};
