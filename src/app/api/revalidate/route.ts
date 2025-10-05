// src/app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  // 1. Get the secret token from environment variables
  const secret = process.env.REVALIDATION_SECRET_TOKEN;
  const body = await request.json();
  
  // 2. Check if the secret token matches
  if (request.headers.get('x-revalidation-token') !== secret) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  // 3. Get the path to revalidate from the request body
  const path = body.path;
  if (!path) {
    return NextResponse.json({ message: 'Path is required' }, { status: 400 });
  }

  try {
    // 4. Trigger the revalidation
    revalidatePath(path, 'page');
    console.log(`Revalidated path: ${path}`);
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}