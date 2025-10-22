import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://213.199.54.41:8000';

export async function handleProxy(req: NextRequest) {
  const { searchParams, pathname } = new URL(req.url);
  const path = searchParams.get('path');
  if (!path) {
    return NextResponse.json({ error: 'Missing "path" query parameter' }, { status: 400 });
  }

  const targetUrl = `${BACKEND_URL}/${path}`;
  const method = req.method;
  const headers = new Headers(req.headers);
  headers.delete('host'); // avoid leaking host header

  let body: BodyInit | undefined;
  if (method !== 'GET' && method !== 'HEAD') {
    body = await req.text();
  }

  try {
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
    });

    const contentType = response.headers.get('content-type') || '';
    const data =
      contentType.includes('application/json')
        ? await response.json()
        : await response.text();

    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    console.error('Proxy error:', err);
    return NextResponse.json({ error: 'Failed to reach backend' }, { status: 502 });
  }
}

// Export all methods supported by Next.js API routes
export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
