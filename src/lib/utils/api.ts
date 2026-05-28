import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import type { ApiResponse } from '@/types';

/**
 * Get authenticated user from session
 */
export async function getAuthUser(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return null;
  }

  return session.user;
}

/**
 * Require authentication and return user
 */
export async function requireAuth(request: NextRequest) {
  const user = await getAuthUser(request);

  if (!user) {
    return {
      error: NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      ),
      user: null,
    };
  }

  return { user, error: null };
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: any, defaultMessage = 'Internal server error') {
  console.error('API Error:', error);

  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: error.message || defaultMessage,
    },
    { status: error.status || 500 }
  );
}

/**
 * Create success response
 */
export function successResponse<T>(data: T, message?: string, status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status }
  );
}

/**
 * Create error response
 */
export function errorResponse(error: string, status = 400, details?: any) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error,
      ...(details && { details }),
    },
    { status }
  );
}
