import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module 'next-auth' {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          response_type: 'code',
          prompt: 'consent'
        }
      }
    }),
  ],
  pages: {
    signIn: "/login",
  },
};