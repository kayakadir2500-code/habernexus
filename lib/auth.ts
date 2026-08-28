import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        await db.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name || "HaberNexus Okuru",
            image: user.image,
          },
          create: {
            email: user.email,
            name: user.name || "HaberNexus Okuru",
            image: user.image,
          },
        });
        return true;
      } catch (err) {
        console.error("Kullanıcı kaydedilirken hata:", err);
        return true;
      }
    },
    async session({ session }) {
      if (session?.user?.email) {
        try {
          const dbUser = await db.user.findUnique({
            where: { email: session.user.email },
          });
          if (dbUser) {
            (session.user as any).id = dbUser.id;
          }
        } catch {}
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "habernexus-secret-key-2026",
  pages: {
    signIn: "/profil",
  },
};