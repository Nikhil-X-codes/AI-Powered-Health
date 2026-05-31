import { NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(request) {
  try {
    console.log('[Login] Route hit');

    const body = await request.json();
    const { email, password } = body;

    console.log('[Login] Body parsed:', {
      email: email || '(missing)',
      hasPassword: !!password,
    });

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const authResult = await loginUser(email, password);

    // Raw auth result for debugging; will show when missing token
    try {
      console.log('[Login] Raw authResult:', JSON.stringify(authResult, null, 2));
    } catch (err) {
      console.log('[Login] Raw authResult (stringify failed):', authResult);
    }

    const { user, token } = authResult || {};

    console.log('[Login] Auth result:', {
      hasUser: !!user,
      hasToken: !!token,
      userId: user?.id || '(missing)',
    });

    // Expect loginUser to return both `user` and `token`.
    if (!user || !token) {
      console.error('[Login] Incomplete auth payload returned from loginUser:', authResult);

      return NextResponse.json(
        { error: 'Login succeeded but the server returned an incomplete response.' },
        { status: 500 }
      );
    }

    // Create response with token in cookie
    const response = NextResponse.json(
      {
        success: true,
        user,
        token,
      },
      { status: 200 }
    );

    response.headers.set('Cache-Control', 'no-store');

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[Login] ERROR:', error.code || 'N/A', error.message);

    // Distinguish between auth errors and server/connection errors
    if (error.message === 'Invalid credentials') {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Connection / database errors should return 503 (Service Unavailable)
    return NextResponse.json(
      { error: 'Service temporarily unavailable. Please try again.' },
      { status: 503 }
    );
  }
}
