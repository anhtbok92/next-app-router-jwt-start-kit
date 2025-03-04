import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';

interface ExtendedUser {
  id: string;
  email: string;
  accessToken: string;
}

const authConfig = {
  providers: [
    CredentialProvider({
      name: 'Login with email and password',
      credentials: {
        email: {
          type: 'email'
        },
        password: {
          type: 'password'
        }
      },
      async authorize(credentials, req) {
        const res = await fetch('https://api.escuelajs.co/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        console.log({ res });

        if (!res.ok) {
          throw new Error('Invalid credentials');
        }
        const user = await res.json();
        const fullUser = {
          id: '1',
          name: 'John',
          email: credentials?.email as string,
          accessToken: user?.access_token
        } as ExtendedUser;
        if (fullUser) {
          return fullUser;
        } else {
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as ExtendedUser;
        token.accessToken = u.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      const s = session as any;
      s.accessToken = token.accessToken;
      return session;
    }
  },
  pages: {
    signIn: '/' // Trang login là landing page
  }
} satisfies NextAuthConfig;

export default authConfig;
