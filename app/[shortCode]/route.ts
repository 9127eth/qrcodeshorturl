import { normalizeHttpUrl } from '@/lib/webRisk';
import {
  isValidShortCode,
  NOT_FOUND_TTL_SECONDS,
  REDIRECT_TTL_SECONDS,
} from '@/lib/shortCode';

export const dynamic = 'force-dynamic';
export const maxDuration = 5;

function cacheHeaders(ttl: number, extra?: HeadersInit): Headers {
  return new Headers({
    'Cache-Control': `public, s-maxage=${ttl}, max-age=60`,
    'CDN-Cache-Control': `public, s-maxage=${ttl}`,
    'Vercel-CDN-Cache-Control': `public, s-maxage=${ttl}`,
    ...extra,
  });
}

function textResponse(message: string, status: number, ttl: number): Response {
  return new Response(message, {
    status,
    headers: cacheHeaders(ttl, {
      'Content-Type': 'text/plain; charset=utf-8',
    }),
  });
}

function safeDestination(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  return normalizeHttpUrl(value);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shortCode: string }> }
): Promise<Response> {
  const { shortCode } = await params;

  if (!isValidShortCode(shortCode)) {
    return textResponse('Short URL not found', 404, NOT_FOUND_TTL_SECONDS);
  }

  try {
    const { db } = await import('@/lib/firebaseAdmin');
    const docSnap = await db.collection('urls').doc(shortCode).get();
    if (!docSnap.exists) {
      return textResponse('Short URL not found', 404, NOT_FOUND_TTL_SECONDS);
    }

    const destination = safeDestination(docSnap.data()?.longUrl);
    if (!destination) {
      return textResponse('Invalid short URL', 404, NOT_FOUND_TTL_SECONDS);
    }

    return new Response(null, {
      status: 307,
      headers: cacheHeaders(REDIRECT_TTL_SECONDS, {
        Location: destination,
      }),
    });
  } catch (error) {
    console.error('Failed to resolve short URL:', error);
    return new Response('Unable to resolve short URL', {
      status: 503,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  }
}

export async function HEAD(
  request: Request,
  context: { params: Promise<{ shortCode: string }> }
): Promise<Response> {
  const response = await GET(request, context);
  return new Response(null, {
    status: response.status,
    headers: response.headers,
  });
}
