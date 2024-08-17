import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import db from './lib/db'
import { compare } from 'bcrypt'

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: 'login',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'your-email@example.com' },
        password: { label: 'Password', type: 'password', placeholder: 'Your Password' },
      },
      authorize: async (credentials: any): Promise<any> => {
        if (!credentials.email || !credentials.password) return null

        const existingUser = await db.user.findUnique({
          where: { email: credentials?.email },
        })
        if (!existingUser) return null

        const isPasswordMatch = await compare(credentials.password, existingUser.password)
        if (!isPasswordMatch) return null

        const { password, ...rest } = existingUser

        return existingUser
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id
      }
      return token
    },
    session({ session, token }: any) {
      session.user.id = token.id
      return session
    },
  },
})
