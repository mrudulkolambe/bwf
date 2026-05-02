import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('bwf-auth-token')?.value;
    console.log("COOKIES", request.cookies.getAll())
    const pathname = request.nextUrl.pathname;

    // Define the base API URL for server-side fetching
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const profileUrl = `${apiUrl}/api/partners/me`;

    console.log(`[Middleware] Request:`, { pathname, hasToken: !!token, token: token });

    const publicRoutes: string[] = [
        '/',
        '/auth/role',
        '/auth/phone',
        '/auth/login',
        '/auth/basic',
    ];

    const isPublicRoute = publicRoutes.some((r) => pathname === r || pathname.startsWith(r + '/'));

    if (isPublicRoute) {
        if (token && pathname === '/auth/role') {
            // If they have a token and are trying to go to role selection, 
            // we should let the validation below handle where they belong
        } else {
            return NextResponse.next();
        }
    }

    if (!token) {
        // Redirect to initial step if no token is found on private routes
        return NextResponse.redirect(new URL('/auth/role', request.url));
    }

    try {
        console.log(`[Middleware] Fetching profile from:`, profileUrl);

        const response = await fetch(profileUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (response.status === 401) {
            console.log('[Middleware] Token invalid or profile fetch failed');
            const res = NextResponse.redirect(new URL('/auth/role', request.url));
            res.cookies.delete('bwf-auth-token');
            return res;
        }

        const responseData = await response.json();
        const partner = responseData?.data;
        const onboarding = partner?.onboarding;

        // Onboarding Logic
        if (!onboarding?.basic) {
            if (pathname !== '/auth/basic') {
                return NextResponse.redirect(new URL('/auth/basic', request.url));
            }
        } else if (!onboarding?.business) {
            if (pathname !== '/auth/business') {
                return NextResponse.redirect(new URL('/auth/business', request.url));
            }
        } else if (!onboarding?.completed) {
            if (pathname !== '/auth/verify') {
                return NextResponse.redirect(new URL('/auth/verify', request.url));
            }
        } else {
            // Flow completed
            if (pathname.startsWith('/auth')) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        }

        return NextResponse.next();
    } catch (error) {
        console.error('[Middleware] Auth validation error:', error);
        // Fallback to next() to avoid blocking completely in case of API downtime, 
        // or redirect to role if strictness is preferred.
        return NextResponse.next();
    }
}


export const config = {
    matcher: [
        '/((?!api|_next|static|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|bmp|tiff|tif)$).*)',
    ],
};
