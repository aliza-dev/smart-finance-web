import NextAuth, { type DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import authConfig from "./auth.config"

declare module "next-auth" {
  interface Session {
    user: {
      currency?: string;
    } & DefaultSession["user"]
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.currency = (token.currency as string) || "PKR";
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // Fetch currency on initial sign in
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        token.currency = dbUser?.currency || "PKR";
      }
      if (trigger === "update" && session?.currency) {
        token.currency = session.currency;
      }
      return token;
    }
  },
  ...authConfig,
})
