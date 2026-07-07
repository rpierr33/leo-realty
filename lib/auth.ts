import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Trim submitted + env values so a stray newline/space in an env var
        // (or a fat-fingered paste) can never break admin login again. Email is
        // compared case-insensitively. Mirrors the hardened kle-mortgage auth.
        const email = String(credentials?.email || '').trim();
        const password = String(credentials?.password || '').trim();

        if (!email || !password) return null;

        // Env-based admin auth (no DB required for initial setup)
        const adminEmail = (process.env.ADMIN_EMAIL || 'admin@leorealty.com').trim();
        const adminPassword = (process.env.ADMIN_PASSWORD || 'leorealty2024').trim();

        if (email.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
          return {
            id: '1',
            email: adminEmail,
            name: 'Admin',
            role: 'admin',
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
});
