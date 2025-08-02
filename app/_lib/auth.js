// Be sure to install auth.js beta
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { createUser, getUser, verifyPassword } from "./database-actions";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await getUser(credentials.email);

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = verifyPassword(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.fullName,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // Gets called whenever user tries to access route defined in middleware.js
    authorized({ auth, request }) {
      // If true is returned, then user is authorized to access route otherwise user is redirected to signin page
      return !!auth?.user;
    },

    // Callback gets called when user attempts to sign in, different from signIn function exported below (this acts like middleware)
    async signIn({ user, account, profile }) {
      // For OAuth providers (Google), create user if they don't exist
      if (account?.provider === "google") {
        try {
          const existingUser = await getUser(user.email);
          if (!existingUser) {
            await createUser({
              email: user.email,
              fullName: user.name,
              password: null, // OAuth users don't need password
            });
          }
        } catch (error) {
          console.error("Error creating OAuth user:", error);
          return false;
        }
      }
      return true;
    },

    async session({ session, user }) {
      try {
        const userData = await getUser(session.user.email);
        if (userData) {
          session.user.userId = userData.id;
          session.user.fullName = userData.fullName;
        }
        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        return session;
      }
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
});
