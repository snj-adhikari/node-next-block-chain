import { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import { UserService } from '../../../../../backend/src/services/UserService'

const userService = new UserService()

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log('🔐 User signing in:', user.email)
        
        if (account?.provider === 'google' && user.email && user.name) {
          // Create or get user from database
          const dbUser = await userService.createUser({
            email: user.email,
            name: user.name,
            image: user.image || undefined,
            provider: 'google',
            googleId: account.providerAccountId,
          })
          
          console.log('✅ User processed in database:', dbUser.id)
        }
        
        return true
      } catch (error) {
        console.error('❌ Error in signIn callback:', error)
        return false
      }
    },
    async session({ session, token }) {
      try {
        if (session.user?.email) {
          // Get user from database and add ID to session
          const dbUser = await userService.getUserByEmail(session.user.email)
          if (dbUser) {
            session.user.id = dbUser.id
            session.user.provider = dbUser.provider
            session.user.blockchains = dbUser.blockchains
          }
        }
        
        console.log('📝 Session created for:', session.user?.email)
        return session
      } catch (error) {
        console.error('❌ Error in session callback:', error)
        return session
      }
    },
    async jwt({ token, user, account }) {
      try {
        // Add database user info to token
        if (user?.email) {
          const dbUser = await userService.getUserByEmail(user.email)
          if (dbUser) {
            token.id = dbUser.id
            token.provider = dbUser.provider
          }
        }
        
        return token
      } catch (error) {
        console.error('❌ Error in jwt callback:', error)
        return token
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }