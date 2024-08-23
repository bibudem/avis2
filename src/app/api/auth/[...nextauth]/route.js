import NextAuth from 'next-auth';
import { validateAuth } from '@/config/passport';

const handler = NextAuth(validateAuth);

export { handler as GET, handler as POST };
