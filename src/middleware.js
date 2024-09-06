import { NextResponse } from 'next/server';
import cookie from 'cookie';

export async function middleware(request) {
    const { pathname } = request.nextUrl;
    const cookies = cookie.parse(request.headers.get('cookie') || '');
    const userData = cookies['userData'];

    if (pathname.startsWith('/admin')) {
        const session = userData ? JSON.parse(userData) : null;
         console.log(session);
        // Rediriger vers la page de connexion si aucune session n'est trouvée
        if (!session) {
            return NextResponse.redirect(new URL('/api/auth/logout', request.url));
        }
        // Rediriger si l'utilisateur n'est pas admin
        if (!session.isAdmin) {
            return NextResponse.redirect(new URL('/not-access', request.url));
        }

    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
