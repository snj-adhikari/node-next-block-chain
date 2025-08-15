import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      provider?: 'google' | 'facebook'
      blockchains?: string[]
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    provider?: 'google' | 'facebook'
    blockchains?: string[]
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    provider?: 'google' | 'facebook'
  }
}