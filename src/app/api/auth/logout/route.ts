import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Clear the custom admin session cookie
    cookies().delete('admin-session-token');
    console.log('[API/logout] Admin session cookie cleared.');
    return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
  } catch (error) {
    console.error('[API/logout] Logout API error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred during logout.' }, { status: 500 });
  }
}
