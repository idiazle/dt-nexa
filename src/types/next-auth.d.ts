import { type UserStructure } from '@/lib/utils'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  // Authorize return data
  interface Session {
    user: UserStructure
    access_token: string
  }
  interface User {
    access_token: string
    refresh_token: string
  }
}
