import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { createUser, getUser } from "./database-actions";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await getUser(credentials.email);

        if (!user) {
          throw new Error("No user found with this email.");
        }

        // const isValid = await bcrypt.compare(
        //   credentials.password,
        //   user.passwordHash
        // );
        const isValid = credentials.password === user.password;

        if (!isValid) {
          throw new Error("Invalid email or password.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
        };
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
      // user object gets access to authenticated user object. name, email etc.
      // If the user doesn't exist in the databse, create a new user, if not don't do anything
      try {
        const existingUser = await getUser(user.email);
        if (!existingUser)
          await createUser({ email: user.email, fullName: user.name });
        return true;
      } catch {
        return false;
      }
    },

    // Adding the user's id to the session object for easy access throughout application. It runs after the user successfully authenticates.
    async session({ session }) {
      // console.log(session);
      const userData = await getUser(session.user.email);
      session.user.userId = userData.id;
      // Fetch and store the user's subscription status in the session
      // const subscription = await fetchUserSubscription(userData.id);
      // session.user.subscription = subscription;
      return session;
    },
  },
  // Defines custom sign in page if user hits protected route and is not signed in.
  pages: {
    signIn: "/signin",
  },
};

export const {
  auth,
  // These are called when user actually clicks on the sign in or sign out buttons
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
