import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { checkRegistrationStatus, getUserByEmail, validateUser } from "@/services/AuthService";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma/client";
import { Adapter } from "next-auth/adapters";
declare module "next-auth" {
  interface User {
    role: string;
    registrationComplete: boolean;
    emailVerified: Date | null;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      registrationComplete: boolean;
      emailVerified: Date | null;
    } & DefaultSession["user"];
  }
  interface JWT {
    id: string;
    role: string;
    registrationComplete: boolean;
    emailVerified: Date | null;
  }
}

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  providers: [
    Google,
    Credentials({
      async authorize(credentials) {
        const email = credentials.email as string;
        const password = credentials.password as string;

        if (!email || !password) return null;

        const user = await getUserByEmail(email);

        if (!user) return null;

        const isValid = await validateUser(user, password);
        if (isValid) return user;

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.registrationComplete = user.registrationComplete;
        token.emailVerified = user.emailVerified;
      }
      if (trigger === "update" && session) {
        const regStatus = await checkRegistrationStatus(token.id as string);
        token.registrationComplete = regStatus.registrationComplete;
        token.emailVerified = regStatus.emailVerified;
      }
      if(account?.provider === "google" && trigger !== "update") token.emailVerified = new Date();
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.registrationComplete = token.registrationComplete as boolean;
      session.user.emailVerified = token.emailVerified as Date | null;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma) as Adapter,
});
