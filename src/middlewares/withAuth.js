import { withAuth as withAuthMiddleware } from 'next-auth/middleware'
import { adminRoute } from '@/config/app'

export const withAuth = (next) => {
  return withAuthMiddleware({
    callbacks: {
      authorized({ req, token }) {

        if (token) {
          return true
        }

        return req.nextUrl.pathname.startsWith(adminRoute) ? token?.user.isAdmin : true
      }
    }
  })
}