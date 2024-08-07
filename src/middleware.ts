import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export default withAuth(
  function middleware (req) {
    // console.log('MY REQ', req)
    const token = req.nextauth.token
    if (token == null) {
      if (req.nextUrl.pathname !== '/auth/login') {
        return NextResponse.redirect(new URL('/auth/login', req.url))
      } else {
        return NextResponse.next()
      }
    }
    try {
      const decodedUser = jwt.decode(token?.access_token as string) as jwt.JwtPayload
      // console.log('Detalles del Usuario', decodedUser)

      const encontre = decodedUser?.groups.find((obj: any) => obj === 1 || obj === 3)

      if (req.nextUrl.pathname.startsWith('/admin') && encontre === undefined) {
        return NextResponse.rewrite(new URL('/denied', req.url))
      }
    } catch (error) {
      // console.error('Error al decodificar el token', error)
      return NextResponse.redirect(new URL('/error', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !(token == null)
    }
  }
)

// export const config = { matcher: ["/:path*"] };
export const config = { matcher: ['/admin/:path*', '/user/:path*'] }
